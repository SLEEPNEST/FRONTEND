// SleepNest Global App Context
// Guests: cart & wishlist live in localStorage (as before).
// Logged-in users: cart, wishlist, addresses and orders are stored in MongoDB through the API,
// so they survive refreshes, logouts and different devices.
import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { api, tokenStore } from '../services/api';
import { allProducts as staticProducts } from '../data/products';

const AppContext = createContext(null);

const initialState = {
  cart: [],
  wishlist: [],
  toasts: [],
  user: null,
  authReady: false, // true once we know whether a saved login token is valid
  addresses: [],
  products: staticProducts, // replaced by the catalogue from the API once loaded
  productsLoaded: false,
  selectedCity: 'Chennai',
  searchQuery: '',
  compareList: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, selectedCity: action.payload };
    case 'ADD_TO_CART': {
      const addQty = action.payload.qty || 1;
      const exists = state.cart.find(
        (i) => i.id === action.payload.id && i.selectedSize === action.payload.selectedSize
      );
      if (exists) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.payload.id && i.selectedSize === action.payload.selectedSize
              ? { ...i, qty: Math.min(i.qty + addQty, 20) }
              : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, qty: addQty }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((i) => i.cartId !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.cartId === action.payload.cartId ? { ...i, qty: action.payload.qty } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'TOGGLE_WISHLIST': {
      const inWishlist = state.wishlist.find((i) => i.id === action.payload.id);
      return {
        ...state,
        wishlist: inWishlist
          ? state.wishlist.filter((i) => i.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      };
    }
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, productsLoaded: true };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'AUTH_READY':
      return { ...state, authReady: true };
    case 'LOGOUT':
      return { ...state, user: null, cart: [], wishlist: [], addresses: [] };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

function readSavedStore() {
  try {
    return JSON.parse(localStorage.getItem('sleepnest_store') || 'null') || {};
  } catch {
    return {};
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const saved = readSavedStore();
    // Only the basket and preferences come from the browser; the user always comes from the API.
    return {
      ...init,
      cart: Array.isArray(saved.cart) ? saved.cart : [],
      wishlist: Array.isArray(saved.wishlist) ? saved.wishlist : [],
      selectedCity: saved.selectedCity || init.selectedCity,
    };
  });

  const userRef = useRef(null);
  const wishlistRef = useRef([]);
  useEffect(() => {
    userRef.current = state.user;
    wishlistRef.current = state.wishlist;
  }, [state.user, state.wishlist]);

  const { cart, wishlist, selectedCity } = state;
  useEffect(() => {
    try {
      localStorage.setItem('sleepnest_store', JSON.stringify({ cart, wishlist, selectedCity }));
    } catch { /* storage unavailable */ }
  }, [cart, wishlist, selectedCity]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD_TOAST', payload: { message, type, id } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  }, []);

  // ── Data loaders ──────────────────────────────────────────
  const refreshCart = useCallback(async () => {
    const { items } = await api.cart.get();
    dispatch({ type: 'SET_CART', payload: items });
    return items;
  }, []);

  const refreshAddresses = useCallback(async () => {
    const { addresses } = await api.addresses.list();
    dispatch({ type: 'SET_ADDRESSES', payload: addresses });
    return addresses;
  }, []);

  // After a login: keep the guest basket (mergeGuest), then load everything saved for this account
  const startSession = useCallback(async (token, user, { mergeGuest }) => {
    tokenStore.set(token);
    userRef.current = user;
    dispatch({ type: 'SET_USER', payload: user });

    const saved = mergeGuest ? readSavedStore() : {};
    const guestCart = Array.isArray(saved.cart) ? saved.cart : [];
    const guestWishlist = Array.isArray(saved.wishlist) ? saved.wishlist : [];

    const [cartRes, wishRes] = await Promise.all([
      guestCart.length
        ? api.cart.merge(guestCart.map((i) => ({ productId: i.id, selectedSize: i.selectedSize, qty: i.qty })))
        : api.cart.get(),
      guestWishlist.length ? api.wishlist.merge(guestWishlist.map((i) => i.id)) : api.wishlist.get(),
    ]);
    dispatch({ type: 'SET_CART', payload: cartRes.items });
    dispatch({ type: 'SET_WISHLIST', payload: wishRes.items });
    refreshAddresses().catch(() => {});
    return user;
  }, [refreshAddresses]);

  // Restore the session on page load / refresh
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = tokenStore.get();
      if (token) {
        try {
          const { user } = await api.auth.me();
          // The locally cached basket is a copy of the server one, so don't merge it again
          if (!cancelled) await startSession(token, user, { mergeGuest: false });
        } catch (err) {
          if (err.status === 401) {
            tokenStore.clear();
            dispatch({ type: 'LOGOUT' });
          } else if (!cancelled) {
            showToast(err.message, 'error');
          }
        }
      }
      if (!cancelled) dispatch({ type: 'AUTH_READY' });
    })();
    return () => { cancelled = true; };
  }, [startSession, showToast]);

  // Product catalogue from MongoDB (falls back to the bundled list if the API is unreachable)
  useEffect(() => {
    api.products
      .list({ limit: 200 })
      .then(({ products }) => {
        if (products?.length) dispatch({ type: 'SET_PRODUCTS', payload: products });
      })
      .catch((err) => console.warn('[SleepNest] Using bundled product list:', err.message));
  }, []);

  // Token rejected by the server (expired / account disabled)
  useEffect(() => {
    const onUnauthorized = () => {
      if (!userRef.current) return;
      userRef.current = null;
      dispatch({ type: 'LOGOUT' });
      showToast('Your session has expired. Please log in again.', 'error');
    };
    window.addEventListener('sleepnest:unauthorized', onUnauthorized);
    return () => window.removeEventListener('sleepnest:unauthorized', onUnauthorized);
  }, [showToast]);

  // ── Auth ──────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { token, user } = await api.auth.login(email, password);
    return startSession(token, user, { mergeGuest: true });
  }, [startSession]);

  const register = useCallback(async (form) => {
    const { token, user } = await api.auth.register(form);
    return startSession(token, user, { mergeGuest: true });
  }, [startSession]);

  const requestOtp = useCallback((phone) => api.auth.requestOtp(phone), []);

  const verifyOtp = useCallback(async (phone, otp) => {
    const res = await api.auth.verifyOtp(phone, otp);
    await startSession(res.token, res.user, { mergeGuest: true });
    return res; // { user, needsDetails, isNewUser }
  }, [startSession]);

  const updateProfile = useCallback(async (data) => {
    const { user } = await api.auth.updateMe(data);
    dispatch({ type: 'SET_USER', payload: user });
    return user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    userRef.current = null;
    dispatch({ type: 'LOGOUT' });
    showToast('You have been logged out', 'info');
  }, [showToast]);

  // ── Cart ──────────────────────────────────────────────────
  const syncError = useCallback((err) => {
    showToast(err.message || 'Could not update your cart', 'error');
    refreshCart().catch(() => {});
  }, [showToast, refreshCart]);

  const addToCart = useCallback(async (product, selectedSize, qty = 1) => {
    const size = selectedSize || product.sizes?.[0] || 'Standard';
    const quantity = Math.max(1, Number(qty) || 1);
    if (!userRef.current) {
      const cartId = `${product.id}-${size}-${Date.now()}`;
      dispatch({ type: 'ADD_TO_CART', payload: { ...product, selectedSize: size, cartId, qty: quantity } });
      showToast('Added to cart!', 'success');
      return true;
    }
    try {
      const { items } = await api.cart.add(product.id, size, quantity);
      dispatch({ type: 'SET_CART', payload: items });
      showToast('Added to cart!', 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  }, [showToast]);

  const removeFromCart = useCallback((cartId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });
    if (userRef.current) {
      api.cart.remove(cartId).then(({ items }) => dispatch({ type: 'SET_CART', payload: items })).catch(syncError);
    }
  }, [syncError]);

  const updateQty = useCallback((cartId, qty) => {
    if (qty < 1 || qty > 20) return;
    dispatch({ type: 'UPDATE_QTY', payload: { cartId, qty } });
    if (userRef.current) {
      api.cart.update(cartId, qty).then(({ items }) => dispatch({ type: 'SET_CART', payload: items })).catch(syncError);
    }
  }, [syncError]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    if (userRef.current) api.cart.clear().catch(syncError);
  }, [syncError]);

  // ── Wishlist ──────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    const exists = wishlistRef.current.some((i) => i.id === product.id);
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    if (!userRef.current) return;
    (exists ? api.wishlist.remove(product.id) : api.wishlist.add(product.id))
      .then(({ items }) => dispatch({ type: 'SET_WISHLIST', payload: items }))
      .catch((err) => {
        showToast(err.message, 'error');
        api.wishlist.get().then(({ items }) => dispatch({ type: 'SET_WISHLIST', payload: items })).catch(() => {});
      });
  }, [showToast]);

  const isInWishlist = useCallback(
    (id) => state.wishlist.some((i) => i.id === id),
    [state.wishlist]
  );

  const cartCount = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const defaultAddress = state.addresses.find((a) => a.isDefault) || state.addresses[0] || null;

  return (
    <AppContext.Provider
      value={{
        ...state,
        cartCount,
        cartTotal,
        defaultAddress,
        isAuthenticated: !!state.user,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        refreshCart,
        toggleWishlist,
        showToast,
        isInWishlist,
        login,
        register,
        requestOtp,
        verifyOtp,
        updateProfile,
        logout,
        refreshAddresses,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Products grouped the same way src/data/products.js exports them
// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  const { products, productsLoaded } = useApp();
  return useMemo(() => {
    const by = (cat) => products.filter((p) => p.category === cat);
    return {
      allProducts: products,
      mattresses: by('mattress'),
      bedsheets: by('bedsheets'),
      protectors: by('protectors'),
      comforters: by('comforter'),
      pillows: by('pillows'),
      productsLoaded,
    };
  }, [products, productsLoaded]);
}
