// SleepNest Header Component - Exact Sleep Nest layout mirrored
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { navLinks } from '../data/products';
import {
  Search, ShoppingCart, Heart, User, MapPin, Phone,
  ChevronDown, X, Menu, Zap, Tag, LogIn, Shield
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import './Header.css';

export default function Header() {
  const { cartCount, wishlist, searchQuery, selectedCity, dispatch, showToast } = useApp();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      {/* Announcement Banner */}
      <div className="announcement-bar">
        <div className="announcement-inner">
          {location.pathname === '/bedsheet' || location.pathname === '/bedsheets' ? (
            <>
              <span>🎁 Buy 2 Bedsheets, Get 1 Pillow Cover Free</span>
              <span className="ann-sep">|</span>
              <span>Free Delivery</span>
            </>
          ) : location.pathname === '/protector' || location.pathname === '/mattress-protector' || location.pathname === '/protectors' ? (
            <>
              <span>🛡️ Protect Your Mattress Investment</span>
              <span className="ann-sep">|</span>
              <span>Free Delivery on Orders Above ₹999</span>
            </>
          ) : location.pathname === '/comforter' || location.pathname === '/comforters' ? (
            <>
              <span>🍂 Winter Warmth Sale — Up to 40% Off Comforters</span>
              <span className="ann-sep">|</span>
              <span>Free Delivery</span>
            </>
          ) : location.pathname === '/pillow' || location.pathname === '/pillows' ? (
            <>
              <span>💆 Wake Up Pain-Free | Buy Any 2 Pillows, Save 20%</span>
            </>
          ) : (
            <>
              <span>🚚 Free Delivery + Setup</span>
              <span className="ann-sep">|</span>
              <span>100-Night Trial</span>
              <span className="ann-sep">|</span>
              <span>10-Year Warranty</span>
            </>
          )}
        </div>
      </div>

      {/* Main Header */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Top Row */}
          <div className="header-top">
            {/* Left: Mobile Toggle + Logo */}
            <div className="logo-group">
              <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="logo-link">
                <div className="logo">
                  <img src={logoImg} alt="SleepNest Logo" className="header-logo-img" />
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <form className={`search-form ${searchFocus ? 'focused' : ''}`} onSubmit={handleSearch}>
              <button type="submit" className="search-icon-btn">
                <Search size={18} />
              </button>
              <input
                type="text"
                placeholder="Search for mattresses, beds, pillows, comforters..."
                value={searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                className="search-input"
              />
              {searchQuery && (
                <button type="button" className="search-clear" onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}>
                  <X size={16} />
                </button>
              )}
            </form>

            {/* Right Actions */}
            <div className="header-actions">
              {/* City / Location */}
              <div className="city-selector-wrapper">
                <button className="action-btn text-link-btn" onClick={() => setCityOpen(!cityOpen)}>
                  <MapPin size={15} />
                  <span>{selectedCity || 'Chennai'}</span>
                  <ChevronDown size={12} />
                </button>
                {cityOpen && (
                  <div className="city-dropdown-menu">
                    <div className="city-dropdown-title">Select City</div>
                    {['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata'].map((city) => (
                      <button
                        key={city}
                        className={`city-option ${selectedCity === city ? 'active' : ''}`}
                        onClick={() => {
                          dispatch({ type: 'SET_CITY', payload: city });
                          setCityOpen(false);
                          showToast(`Location updated to ${city}`);
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Support */}
              <a href="tel:+917676761001" className="action-btn icon-btn" title="Support">
                <Phone size={19} />
              </a>

              {/* Wishlist */}
              <Link to="/wishlist" className="action-btn icon-btn" title="Wishlist">
                <div className="icon-wrapper">
                  <Heart size={19} />
                  {wishlist.length > 0 && (
                    <span className="badge-dot">{wishlist.length}</span>
                  )}
                </div>
              </Link>

              {/* Account */}
              <button className="action-btn icon-btn" title="Account" onClick={() => setMobileOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <User size={19} />
              </button>

              {/* Cart */}
              <Link to="/cart" className="action-btn cart-pill-btn">
                <ShoppingCart size={19} />
                <span className="cart-badge-val">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>


      
        {/* Secondary Categories Nav */}
        <div className="categories-subnav">
          <div className="container">
            <nav className="subnav-list">
              <Link to="/mattress" className="subnav-item" onClick={() => setMobileOpen(false)}>Mattress</Link>
              <Link to="/bedsheet" className="subnav-item" onClick={() => setMobileOpen(false)}>Bedsheet</Link>
              <Link to="/protector" className="subnav-item" onClick={() => setMobileOpen(false)}>Protector</Link>
              <Link to="/comforter" className="subnav-item" onClick={() => setMobileOpen(false)}>Comforter</Link>
              <Link to="/pillow" className="subnav-item" onClick={() => setMobileOpen(false)}>Pillow</Link>
            </nav>
          </div>
        </div>
      </header>


      {/* Profile / Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="profile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="pd-header">
              <div className="pd-user">
                <div className="pd-avatar"><User size={20}/></div>
                <div className="pd-user-info">
                  <strong>AKASH AN...</strong>
                  <a href="#" className="pd-my-profile">My Profile</a>
                </div>
              </div>
              <div className="pd-location">
                <div className="pd-loc-pin"><MapPin size={16}/></div>
                <div className="pd-loc-info">
                  <span>Tiruvannamalai</span>
                  <strong>632326 <span className="pd-edit-icon">✎</span></strong>
                </div>
              </div>
            </div>

            <div className="pd-pills">
              <button className="pd-pill" onClick={() => {navigate('/cart'); setMobileOpen(false);}}>
                <ShoppingCart size={20} color="#5c38c9"/>
                <span>My Cart</span>
              </button>
              <button className="pd-pill" onClick={() => {navigate('/my-orders'); setMobileOpen(false);}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5c38c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <span>My Orders</span>
              </button>
              <button className="pd-pill">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5c38c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                <span>Wallet</span>
              </button>
            </div>

            <div className="pd-menu-list">
              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5c38c9" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                <span>Browse Categories</span>
              </a>
              <Link to="/stores" className="pd-menu-item" onClick={() => setMobileOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5c38c9" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>Nearby Stores</span>
              </Link>
              <a href="#" className="pd-menu-item">
                <Shield size={18} color="#5c38c9"/>
                <span style={{display:'flex', alignItems:'center', gap:'8px'}}>Zense - AI Sleep Solutions <span className="pd-badge-new">New</span></span>
                <ChevronDown size={16} className="pd-ml-auto" color="#64748b"/>
              </a>
              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                <span style={{color: '#000', fontWeight: 600}}>Live Shop</span>
              </a>
              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><circle cx="9" cy="9" r="2"></circle><circle cx="15" cy="15" r="2"></circle><line x1="19" y1="5" x2="5" y2="19"></line></svg>
                <span style={{color: '#000', fontWeight: 600}}>Offers</span>
              </a>
              
              <hr className="pd-divider"/>

              <a href="#" className="pd-menu-item">
                <Heart size={18} color="#000"/>
                <span>Wishlist</span>
              </a>
              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                <span>Wall Makeover</span>
              </a>
              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                <span>Blog</span>
              </a>
              <a href="#" className="pd-menu-item">
                <Phone size={18} color="#000"/>
                <span>Contact Us</span>
              </a>
              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <span>FAQs</span>
              </a>
              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                <span>Feedback</span>
              </a>

              <hr className="pd-divider"/>

              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                <span>Design</span>
                <ChevronDown size={16} className="pd-ml-auto" color="#64748b"/>
              </a>
              <a href="#" className="pd-menu-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                <span>Buying Guide</span>
                <ChevronDown size={16} className="pd-ml-auto" color="#64748b"/>
              </a>
              <a href="#" className="pd-menu-item">
                <User size={18} color="#000"/>
                <span>About Us</span>
                <ChevronDown size={16} className="pd-ml-auto" color="#64748b"/>
              </a>
            </div>

            <div className="pd-footer">
              <button className="pd-logout-btn" onClick={() => setMobileOpen(false)}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
