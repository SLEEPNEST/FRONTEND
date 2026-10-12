// Account Page
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, Eye, EyeOff, Lock, ShoppingCart, Grid, Store, ShieldCheck, Video, Percent, Home, BookOpen, Phone, FileText, MessageCircle, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatDate, formatINR, statusPill, orderSummaryText } from '../utils/orderFormat';
import './AccountPage.css';

const tabs = [
  { id: 'login', label: 'Login', Icon: User },
];

const accountMenu = [
  { id: 'orders', label: 'My Orders', Icon: Package },
  { id: 'wishlist', label: 'Wishlist', Icon: Heart, path: '/wishlist' },
  { id: 'addresses', label: 'Addresses', Icon: MapPin },
  { id: 'payments', label: 'Payment Methods', Icon: CreditCard },
];

const ORDER_TABS = ['All', 'In Progress', 'Delivered', 'Cancelled'];

export default function AccountPage() {
  const { user, authReady, login, register, logout, defaultAddress, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [orderTab, setOrderTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Where to go after logging in (e.g. back to checkout)
  const redirectTo = location.state?.from || new URLSearchParams(location.search).get('redirect');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setOrdersLoading(true);
    setOrdersError('');
    api.orders
      .my({ status: orderTab === 'All' ? undefined : orderTab.toLowerCase().replace(' ', '-') })
      .then((res) => { if (!cancelled) setOrders(res.orders); })
      .catch((err) => { if (!cancelled) setOrdersError(err.message); })
      .finally(() => { if (!cancelled) setOrdersLoading(false); });
    return () => { cancelled = true; };
  }, [user, orderTab]);

  const validate = () => {
    if (!isLogin && form.name.trim().length < 2) return 'Please enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address';
    if (!isLogin && form.phone && !/^(\+?91)?[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) return 'Please enter a valid 10-digit mobile number';
    if (!isLogin && form.password.length < 6) return 'Password must be at least 6 characters';
    if (!form.password) return 'Please enter your password';
    return '';
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const problem = validate();
    setFormError(problem);
    if (problem) return;

    setSubmitting(true);
    try {
      const loggedIn = isLogin
        ? await login(form.email.trim(), form.password)
        : await register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined, password: form.password });
      showToast(isLogin ? `Welcome back${loggedIn.name ? ', ' + loggedIn.name : ''}!` : 'Account created successfully!', 'success');
      setForm({ email: '', password: '', name: '', phone: '' });
      if (redirectTo) navigate(redirectTo);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!authReady && !user) {
    return (
      <div className="account-page">
        <div className="container"><p className="sn-state-msg">Loading your account...</p></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="account-layout">
            {/* Sidebar matching screenshot */}
            <aside className="account-sidebar-new">
              <div className="as-header">
                <div className="as-user-info">
                  <div className="as-avatar">
                    <User size={24} />
                  </div>
                  <div className="as-details">
                    <h3 className="as-name">{user.name || user.phone || 'My Account'}</h3>
                    <Link to="/profile" className="as-profile-link">My Profile</Link>
                  </div>
                </div>
                <div className="as-location">
                  <MapPin size={16} />
                  <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {defaultAddress ? (<>{defaultAddress.city}<br/>{defaultAddress.pincode} <span style={{fontSize:10}}>✏️</span></>) : (<>Add address<br/><span style={{fontSize:10}}>✏️</span></>)}
                  </Link>
                </div>
              </div>

              <div className="as-quick-links">
                <Link to="/cart" className="as-quick-box">
                  <ShoppingCart size={20} className="q-icon" />
                  <span>My Cart</span>
                </Link>
                <Link to="/my-orders" className="as-quick-box active">
                  <Package size={20} className="q-icon" />
                  <span>My Orders</span>
                </Link>
                <div className="as-quick-box">
                  <CreditCard size={20} className="q-icon" />
                  <span>Wallet</span>
                </div>
              </div>

              <div className="as-nav-list">
                <Link to="/" className="as-nav-item">
                  <Grid size={18} className="n-icon" /> <span>Browse Categories</span>
                </Link>
                <Link to="/stores" className="as-nav-item">
                  <Store size={18} className="n-icon" /> <span>Nearby Stores</span>
                </Link>
                <div className="as-nav-item">
                  <ShieldCheck size={18} className="n-icon" /> <span>Zense - AI Sleep Solutions</span> <span className="n-badge-red">New</span> <ChevronDown size={16} className="n-caret"/>
                </div>
                <div className="as-nav-item">
                  <Video size={18} className="n-icon text-red" /> <span>Live Shop</span>
                </div>
                <div className="as-nav-item">
                  <Percent size={18} className="n-icon text-orange" /> <span>Offers</span>
                </div>

                <div className="as-nav-divider"></div>

                <Link to="/wishlist" className="as-nav-item">
                  <Heart size={18} className="n-icon" /> <span>Wishlist</span>
                </Link>
                <div className="as-nav-item">
                  <Home size={18} className="n-icon" /> <span>Wall Makeover</span>
                </div>
                <div className="as-nav-item">
                  <BookOpen size={18} className="n-icon" /> <span>Blog</span>
                </div>
                <div className="as-nav-item">
                  <Phone size={18} className="n-icon" /> <span>Contact Us</span>
                </div>
                <div className="as-nav-item">
                  <FileText size={18} className="n-icon" /> <span>FAQs</span>
                </div>
                <div className="as-nav-item">
                  <MessageCircle size={18} className="n-icon" /> <span>Feedback</span>
                </div>
              </div>

              <button className="as-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </aside>

            {/* Content */}
            <div className="account-content-new">
              {/* Breadcrumbs */}
              <div className="orders-breadcrumbs">
                <Link to="/">Home</Link> <ChevronRight size={14}/> <Link to="/account">My Account</Link> <ChevronRight size={14}/> <span>My Orders</span>
              </div>
              
              {/* Filter Row */}
              <div className="orders-filter-row">
                <div className="orders-tabs">
                  {ORDER_TABS.map((tab) => (
                    <button
                      key={tab}
                      className={`orders-tab-pill ${orderTab === tab ? 'active' : ''}`}
                      onClick={() => setOrderTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <Link to="/my-orders" className="orders-date-select" style={{ textDecoration: 'none' }}>
                  <span>View all orders</span> <ChevronRight size={16}/>
                </Link>
              </div>
              
              {/* Order List */}
              <div className="orders-list-new">
                {ordersLoading && <p className="sn-state-msg">Loading your orders...</p>}
                {!ordersLoading && ordersError && <p className="sn-state-msg sn-state-error">{ordersError}</p>}
                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div className="sn-state-msg">
                    <p>No {orderTab === 'All' ? '' : orderTab.toLowerCase() + ' '}orders yet.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>Start Shopping</Link>
                  </div>
                )}
                {!ordersLoading && !ordersError && orders.slice(0, 5).map((order) => {
                  const pill = statusPill(order.status);
                  const firstItem = order.items[0];
                  return (
                    <Link to={`/my-orders/${order.orderNumber}`} className="order-card-new" key={order.id} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                      <div className="order-card-top">
                        <div className={`order-status-pill ${pill.className}`}>
                          <span className="dot"></span> {pill.label}
                        </div>
                        <span className="order-pipe">|</span>
                        <span className="order-date-new">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-card-main">
                        <div className="oc-img-col">
                          <div className="oc-img-wrapper">
                            <img src={firstItem?.image} alt={firstItem?.name || 'Product'} />
                            {order.items.length > 1 && <div className="oc-img-overlay">+{order.items.length - 1}</div>}
                          </div>
                        </div>
                        <div className="oc-info-col">
                          <div className="oc-id">Order ID: {order.orderNumber}</div>
                          <div className="oc-desc">{orderSummaryText(order)}</div>
                          <div className="oc-price">₹ {formatINR(order.total)}</div>
                        </div>
                        <div className="oc-arrow-col">
                          <ChevronRight size={24} color="#8c2b2b"/>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div></div>
        </div>
      </div>
    );
  }
  return (
    <div className="account-page account-auth-page">
      <div className="container">
        <div className="auth-container">
          {/* Left: Brand */}
          <div className="auth-brand">
            <div className="auth-brand-inner">
              <h1 className="auth-brand-name">SleepNest</h1>
              <p className="auth-brand-tagline">Sleep Better. Live Better.</p>
              <div className="auth-benefits">
                {[
                  '✓ Track your orders in real-time',
                  '✓ Save addresses for faster checkout',
                  '✓ Exclusive member discounts',
                  '✓ 100-night trial & easy returns',
                ].map((b) => (
                  <p key={b} className="auth-benefit">{b}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="auth-form-card">
            <div className="auth-tabs">
              <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setFormError(''); }}>Login</button>
              <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setFormError(''); }}>Register</button>
            </div>

            <form onSubmit={handleAuth} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {isLogin && (
                  <button type="button" onClick={() => showToast('Use "OTP" below to log in with your mobile number, then set a new password from My Profile.', 'info')} style={{ display: 'block', marginTop: 6, fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    Forgot password?
                  </button>
                )}
              </div>

              {formError && <p className="sn-form-error" role="alert">{formError}</p>}

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={submitting}>
                {submitting ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
              </button>

              <div className="auth-divider"><span>or continue with</span></div>

              <div className="auth-social">
                <button type="button" className="auth-social-btn" onClick={() => showToast('Google sign-in is not set up yet. Please use email or OTP.', 'info')}>
                  <span>🇬</span> Google
                </button>
                <button type="button" className="auth-social-btn" onClick={() => navigate('/cart', { state: { openLogin: true, from: redirectTo || '/account' } })}>
                  <span>📱</span> OTP
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
