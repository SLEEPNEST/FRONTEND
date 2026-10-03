// Account Page
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, Eye, EyeOff, Lock, ShoppingCart, Grid, Store, ShieldCheck, Video, Percent, Home, BookOpen, Phone, FileText, MessageCircle, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
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

export default function AccountPage() {
  const { user, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });

  const handleAuth = (e) => {
    e.preventDefault();
    const mockUser = { name: form.name || 'Valued Customer', email: form.email, phone: form.phone };
    dispatch({ type: 'SET_USER', payload: mockUser });
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
  };

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
                    <h3 className="as-name">{user.name || 'AKASH AN...'}</h3>
                    <Link to="/profile" className="as-profile-link">My Profile</Link>
                  </div>
                </div>
                <div className="as-location">
                  <MapPin size={16} />
                  <span>Tiruvannamalai<br/>632326 <span style={{fontSize:10}}>✏️</span></span>
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
                  <button className="orders-tab-pill active">All</button>
                  <button className="orders-tab-pill">In Progress</button>
                  <button className="orders-tab-pill">Delivered</button>
                  <button className="orders-tab-pill">Cancelled</button>
                </div>
                <div className="orders-date-select">
                  <span>Select date range</span> <ChevronDown size={16}/>
                </div>
              </div>
              
              {/* Order List */}
              <div className="orders-list-new">
                
                {/* Order 1 */}
                <div className="order-card-new">
                  <div className="order-card-top">
                    <div className="order-status-pill in-progress">
                      <span className="dot"></span> In progress
                    </div>
                    <span className="order-pipe">|</span>
                    <span className="order-date-new">10 May 2021</span>
                  </div>
                  <div className="order-card-main">
                    <div className="oc-img-col">
                      <div className="oc-img-wrapper">
                        <img src="/images/generated/sleepnest_mattress_card.jpg" alt="Mattress" />
                        <div className="oc-img-overlay">+4</div>
                      </div>
                    </div>
                    <div className="oc-info-col">
                      <div className="oc-id">Order ID: ABC-6457325</div>
                      <div className="oc-desc">SleepNest Ortho Mattress | Cloud Pillows | Waterproof Protector & 2 more items</div>
                      <div className="oc-price">₹ 12,500</div>
                    </div>
                    <div className="oc-arrow-col">
                      <ChevronRight size={24} color="#8c2b2b"/>
                    </div>
                  </div>
                </div>

                {/* Order 2 */}
                <div className="order-card-new">
                  <div className="order-card-top">
                    <div className="order-status-pill delivered">
                      <span className="dot"></span> Delivered
                    </div>
                    <span className="order-pipe">|</span>
                    <span className="order-date-new">10 May 2021</span>
                  </div>
                  <div className="order-card-main">
                    <div className="oc-img-col">
                      <div className="oc-img-wrapper">
                        <img src="/images/generated/sleepnest_bedsheet.jpg" alt="Bedsheet" />
                      </div>
                    </div>
                    <div className="oc-info-col">
                      <div className="oc-id">Order ID: ABC-6457325</div>
                      <div className="oc-desc">Premium Cotton Bedsheet (Queen Size)</div>
                      <div className="oc-price">₹ 2,499</div>
                    </div>
                    <div className="oc-arrow-col">
                      <ChevronRight size={24} color="#8c2b2b"/>
                    </div>
                  </div>
                </div>

                {/* Order 3 */}
                <div className="order-card-new">
                  <div className="order-card-top">
                    <div className="order-status-pill delivered">
                      <span className="dot"></span> Delivered
                    </div>
                    <span className="order-pipe">|</span>
                    <span className="order-date-new">10 May 2021</span>
                  </div>
                  <div className="order-card-main">
                    <div className="oc-img-col">
                      <div className="oc-img-wrapper">
                        <img src="/images/generated/sleepnest_pillow.jpg" alt="Pillow" />
                      </div>
                    </div>
                    <div className="oc-info-col">
                      <div className="oc-id">Order ID: ABC-6457325</div>
                      <div className="oc-desc">Memory Foam Contour Pillow</div>
                      <div className="oc-price">₹ 1,899</div>
                    </div>
                    <div className="oc-arrow-col">
                      <ChevronRight size={24} color="#8c2b2b"/>
                    </div>
                  </div>
                </div>

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
              <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
              <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Register</button>
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
                  <button type="button" style={{ display: 'block', marginTop: 6, fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    Forgot password?
                  </button>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                {isLogin ? 'Login' : 'Create Account'}
              </button>

              <div className="auth-divider"><span>or continue with</span></div>

              <div className="auth-social">
                <button type="button" className="auth-social-btn">
                  <span>🇬</span> Google
                </button>
                <button type="button" className="auth-social-btn">
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
