// SleepNest API client — every backend call goes through here.
// The backend URL comes from VITE_API_URL (see .env.example); it is never hardcoded in pages.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const TOKEN_KEY = 'sleepnest_token';

export const tokenStore = {
  get() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage unavailable */ }
  },
  clear() {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
  },
};

export class ApiError extends Error {
  constructor(message, status = 0, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body, query } = {}) {
  const token = tokenStore.get();
  const qs = query
    ? '?' + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')).toString()
    : '';

  let res;
  try {
    res = await fetch(`${API_URL}${path}${qs}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the SleepNest server. Please check your connection and try again.', 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    if (res.status === 401 && token) {
      tokenStore.clear();
      window.dispatchEvent(new Event('sleepnest:unauthorized'));
    }
    throw new ApiError(data.message || `Request failed (${res.status})`, res.status, data.errors);
  }
  return data;
}

const enc = encodeURIComponent;

export const api = {
  auth: {
    register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    requestOtp: (phone) => request('/auth/otp/request', { method: 'POST', body: { phone } }),
    verifyOtp: (phone, otp) => request('/auth/otp/verify', { method: 'POST', body: { phone, otp } }),
    me: () => request('/auth/me'),
    updateMe: (payload) => request('/auth/me', { method: 'PUT', body: payload }),
    changePassword: (currentPassword, newPassword) =>
      request('/auth/password', { method: 'PUT', body: { currentPassword, newPassword } }),
  },
  products: {
    list: (query) => request('/products', { query }),
    get: (id) => request(`/products/${enc(id)}`),
  },
  cart: {
    get: () => request('/cart'),
    add: (productId, selectedSize, qty = 1) => request('/cart/items', { method: 'POST', body: { productId, selectedSize, qty } }),
    update: (cartId, qty) => request(`/cart/items/${enc(cartId)}`, { method: 'PATCH', body: { qty } }),
    remove: (cartId) => request(`/cart/items/${enc(cartId)}`, { method: 'DELETE' }),
    clear: () => request('/cart', { method: 'DELETE' }),
    merge: (items) => request('/cart/merge', { method: 'POST', body: { items } }),
  },
  wishlist: {
    get: () => request('/wishlist'),
    add: (productId) => request(`/wishlist/${enc(productId)}`, { method: 'POST' }),
    remove: (productId) => request(`/wishlist/${enc(productId)}`, { method: 'DELETE' }),
    merge: (productIds) => request('/wishlist/merge', { method: 'POST', body: { productIds } }),
  },
  addresses: {
    list: () => request('/addresses'),
    create: (payload) => request('/addresses', { method: 'POST', body: payload }),
    update: (id, payload) => request(`/addresses/${enc(id)}`, { method: 'PUT', body: payload }),
    setDefault: (id) => request(`/addresses/${enc(id)}/default`, { method: 'PATCH' }),
    remove: (id) => request(`/addresses/${enc(id)}`, { method: 'DELETE' }),
  },
  orders: {
    create: (payload) => request('/orders', { method: 'POST', body: payload }),
    my: (query) => request('/orders/my', { query }),
    get: (id) => request(`/orders/${enc(id)}`),
    cancel: (id, reason) => request(`/orders/${enc(id)}/cancel`, { method: 'PATCH', body: { reason } }),
  },
  newsletter: {
    subscribe: (email) => request('/newsletter', { method: 'POST', body: { email, source: 'homepage' } }),
  },
};

export default api;
