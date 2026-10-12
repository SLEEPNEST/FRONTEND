import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, ChevronRight, X, Minus, Plus, Truck, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import './CartPage.css';
import cushionImg from '../assets/banner_pillow.jpg';
import studyTableImg from '../assets/banner_wood_bed.jpg';
import logoImg from '../assets/logo.png';

const EMPTY_ADDRESS = {
  flatNo: '', floor: '', building: '', address: '', landmark: '',
  pincode: '', city: '', state: '', name: '', phone: '', label: 'Home',
};

export default function CartPage() {
  const {
    cart, removeFromCart, updateQty, cartTotal, user, addresses, defaultAddress,
    requestOtp, verifyOtp, updateProfile, refreshAddresses, showToast,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('Furniture');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddressDrawer, setShowAddressDrawer] = useState(false);
  const [loginStep, setLoginStep] = useState('phone'); // 'phone' or 'otp'
  const [mobileNumber, setMobileNumber] = useState('');

  // OTP login state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [details, setDetails] = useState({ name: '', email: '' });
  const [detailErrors, setDetailErrors] = useState({});
  const otpRefs = useRef([]);
  const afterLoginPath = useRef(null);

  // Address drawer state
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState({});
  const [savingAddress, setSavingAddress] = useState(false);

  // "OTP" button on the account page opens this login modal
  useEffect(() => {
    if (location.state?.openLogin && !user) {
      afterLoginPath.current = location.state.from || null;
      setShowLoginModal(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate, user]);

  useEffect(() => {
    if (otpTimer <= 0) return undefined;
    const t = setTimeout(() => setOtpTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);

  const closeLogin = () => {
    setShowLoginModal(false);
    setLoginStep('phone');
    setAuthError('');
    setOtpDigits(['', '', '', '', '', '']);
  };

  const continueAfterLogin = (hasAddresses) => {
    closeLogin();
    if (afterLoginPath.current) {
      navigate(afterLoginPath.current);
      afterLoginPath.current = null;
    } else if (hasAddresses) {
      navigate('/checkout');
    } else {
      openAddressDrawer();
    }
  };

  const handleGetOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setAuthError('Please enter a valid 10-digit mobile number');
      return;
    }
    setAuthBusy(true);
    setAuthError('');
    try {
      const res = await requestOtp(cleanMobile);
      setLoginStep('otp');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimer(60);
      showToast(res.devOtp ? `${res.message}. Test OTP: ${res.devOtp}` : res.message, 'success');
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      e.preventDefault();
      setOtpDigits(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setAuthError('Please enter the 6-digit OTP');
      return;
    }
    setAuthBusy(true);
    setAuthError('');
    try {
      const res = await verifyOtp(cleanMobile, otp);
      if (res.needsDetails) {
        setDetails({ name: res.user.name || '', email: res.user.email || '' });
        setLoginStep('details');
      } else {
        showToast(`Welcome back${res.user.name ? ', ' + res.user.name : ''}!`, 'success');
        const saved = await refreshAddresses().catch(() => []);
        continueAfterLogin(saved.length > 0);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleConfirmDetails = async () => {
    const errors = {};
    if (details.name.trim().length < 2) errors.name = 'please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) errors.email = 'please enter email';
    setDetailErrors(errors);
    if (Object.keys(errors).length) return;

    setAuthBusy(true);
    try {
      await updateProfile({ name: details.name.trim(), email: details.email.trim() });
      showToast('Welcome to SleepNest!', 'success');
      const saved = await refreshAddresses().catch(() => []);
      continueAfterLogin(saved.length > 0);
    } catch (err) {
      setDetailErrors({ email: err.message });
    } finally {
      setAuthBusy(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    if (!user) {
      afterLoginPath.current = null;
      setShowLoginModal(true);
      return;
    }
    if (addresses.length === 0) openAddressDrawer();
    else navigate('/checkout');
  };

  function openAddressDrawer() {
    setAddressForm((f) => ({
      ...EMPTY_ADDRESS,
      ...f,
      name: f.name || user?.name || details.name || '',
      phone: f.phone || user?.phone || cleanMobile || '',
    }));
    setAddressErrors({});
    setShowAddressDrawer(true);
  }

  const setAddr = (field) => (e) => setAddressForm({ ...addressForm, [field]: e.target.value });

  const handleSaveAddress = async () => {
    const a = addressForm;
    const errors = {};
    if (!a.flatNo.trim()) errors.flatNo = 'Required';
    if (!a.floor.trim()) errors.floor = 'Required';
    if (a.address.trim().length < 3) errors.address = 'Please enter the area / street';
    if (!a.landmark.trim()) errors.landmark = 'Required';
    if (!/^\d{6}$/.test(a.pincode.trim())) errors.pincode = 'Enter a 6-digit pincode';
    if (!a.city.trim()) errors.city = 'Required';
    if (!a.state.trim()) errors.state = 'Required';
    if (a.name.trim().length < 2) errors.name = 'Required';
    if (!/^[6-9]\d{9}$/.test(a.phone.replace(/\D/g, '').slice(-10))) errors.phone = 'Enter a valid mobile number';
    setAddressErrors(errors);
    if (Object.keys(errors).length) {
      showToast('Please fill in all required address fields', 'error');
      return;
    }

    setSavingAddress(true);
    try {
      await api.addresses.create({ ...a, phone: a.phone.replace(/\D/g, '').slice(-10) });
      await refreshAddresses();
      setShowAddressDrawer(false);
      setAddressForm(EMPTY_ADDRESS);
      showToast('Address saved successfully!', 'success');
      navigate('/checkout');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingAddress(false);
    }
  };

  // Same pricing rules as checkout and the backend: 5% offer discount + 18% GST, free delivery
  const cartAmount = cartTotal;
  const couponDiscount = Math.round(cartAmount * 0.05);
  const gstAmount = Math.round((cartAmount - couponDiscount) * 0.18);
  const finalTotal = Math.max(0, cartAmount - couponDiscount + gstAmount);
  const deliveryBy = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  const displayCart = cart;

  return (
    <div className="cart-page-new">
      <div className="container cart-container">
        {/* TOP SECTION: Cart Layout */}
        <div className="cart-grid">
          
          {/* LEFT COLUMN */}
          <div className="cart-left">
            {/* Cart Items */}
            <div className="cart-items-list">
              {displayCart.length === 0 && (
                <div className="cart-item-card sn-state-msg">
                  <h3 className="ci-title"><span className="purple-bar"></span>Your cart is empty</h3>
                  <p style={{ margin: '12px 0' }}>Looks like you haven't added anything yet.</p>
                  <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
              )}
              {displayCart.map(item => (
                <div key={item.cartId} className="cart-item-card">
                  <h3 className="ci-title">
                    <span className="purple-bar"></span>
                    {item.name}
                  </h3>
                  
                  <div className="ci-body">
                    <div className="ci-img">
                      <img src={item.images?.find(img => !img.endsWith('.mp4')) || item.images?.[0]} alt={item.name} />
                    </div>
                    
                    <div className="ci-details">
                      <div className="ci-pricing">
                        <span className="ci-price">₹{item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <>
                            <span className="ci-mrp">MRP ₹{item.originalPrice.toLocaleString()}</span>
                            <span className="ci-off">{Math.round((1 - item.price/item.originalPrice)*100)}% OFF</span>
                          </>
                        )}
                      </div>
                      
                      <div className="ci-actions">
                        <div className="ci-dropdown">
                          {item.selectedSize} <span>▼</span>
                        </div>
                        
                        <div className="ci-qty">
                          <button onClick={() => item.qty > 1 ? updateQty(item.cartId, item.qty - 1) : removeFromCart(item.cartId)}>
                            {item.qty === 1 ? <X size={12}/> : <Minus size={12}/>}
                          </button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.cartId, item.qty + 1)}><Plus size={12}/></button>
                        </div>
                      </div>
                      
                      <div className="ci-delivery">
                        <Truck size={14} color="#16a34a"/> <strong>FREE</strong> Delivery by <strong>{deliveryBy}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Section */}
            <div className="quick-add-section">
              <h4 className="qa-title">
                ⚡ Quick Add <span className="qa-sub">Save a trip with your order here</span>
              </h4>
              <div className="qa-scroll">
                <div className="qa-card">
                  <div className="qa-badge">Cushion</div>
                  <img src={cushionImg} alt="Cushion" className="qa-img"/>
                  <div className="qa-info">
                    <div className="qa-price-row">
                      <span className="qa-price">₹634</span>
                      <span className="qa-mrp">₹799</span>
                      <span className="qa-off">11%</span>
                    </div>
                    <p className="qa-name">Cushion</p>
                    <button className="qa-btn">Add Item</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sleep Nest Rewards Banner */}
            <div className="rewards-banner">
              <div className="rb-content">
                <h2>Sleep Nest Rewards</h2>
                <p>Claim Exclusive Rewards<br/>From Top Brands - Free with Every Sleep Nest Purchase</p>
                <button className="rb-btn">Know More <ChevronRight size={14}/></button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="cart-right">
            
            <div className="right-box location-box">
              <MapPin size={16} color="#16a34a"/>
              <span className="loc-text">Delivering to <strong>{defaultAddress ? `${defaultAddress.pincode}, ${defaultAddress.city}` : '600026, Chennai'}</strong></span>
              <ChevronRight size={16} className="loc-arrow"/>
            </div>

            <div className="right-box coupon-box">
              <div className="cb-top">
                <div className="cb-icon">%</div>
                <div className="cb-text">
                  <strong>HOME <span className="cb-dot">•</span> OFFER APPLIED</strong>
                  <p>Offer valid till 27th August 2025</p>
                </div>
                <button className="cb-remove">Remove</button>
              </div>
              <div className="cb-bottom">
                <div className="cb-icons">
                  <div className="pay-icon" style={{background:'#ea580c'}}></div>
                  <div className="pay-icon" style={{background:'#facc15'}}></div>
                  <div className="pay-icon" style={{background:'#22c55e'}}></div>
                  <div className="pay-icon" style={{background:'#ef4444'}}></div>
                  <span>+ 3</span>
                </div>
                <button className="view-coupons">View All Coupons <ChevronRight size={12}/></button>
              </div>
            </div>

            <div className="right-box price-details-box">
              <h4>Price Details <span>({displayCart.length} item)</span></h4>
              
              <div className="pd-row">
                <span>Cart Total</span>
                <span>₹{cartAmount.toLocaleString()}</span>
              </div>
              <div className="pd-row pd-green">
                <span>Coupon Discount</span>
                <span>- ₹{couponDiscount.toLocaleString()}</span>
              </div>
              <div className="pd-row">
                <span>GST (18%)</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              
              {!user && (
              <div className="wallet-box">
                <div className="wb-row">
                  <span>Use Sleep Nest Cash Amount</span>
                  <button className="wb-login" onClick={() => { afterLoginPath.current = '/cart'; setShowLoginModal(true); }}>Login Now</button>
                </div>
                <p>Login to access your wallet to get extra discount</p>
              </div>
              )}

              <div className="pd-row">
                <span>Delivery Charges</span>
                <span className="pd-free">Free <del>₹899</del></span>
              </div>

              <hr className="pd-divider"/>
              
              <div className="pd-total-row">
                <div className="pd-total-text">
                  <strong>Total Amount</strong>
                  <p>(Inclusive of all taxes)</p>
                </div>
                <strong>₹{finalTotal.toLocaleString()}</strong>
              </div>

              <button className="checkout-btn" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
            </div>

            <div className="right-box cashback-box">
              You will earn upto: <span className="cb-red"><ShieldAlert size={12}/> 158 cashback</span> on this purchase
            </div>

          </div>
        </div>
      </div>


      {/* LOGIN MODAL OVERLAY */}
      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            {/* Left Image Section */}
            <div className="lm-left">
              <img src="/images/generated/login_modal_img.jpg" alt="Login" className="lm-bg-img" />
              <img src={logoImg} alt="SleepNest" className="lm-logo-img" />
            </div>
            
            {/* Right Form Section */}
            <div className="lm-right">
              <button className="lm-close" onClick={closeLogin}>
                <X size={16} />
              </button>
              
              <h2 className="lm-title">Login/Signup</h2>
              
              {loginStep === 'phone' ? (
                <>
                  <div className="lm-input-group">
                    <label>Enter mobile number</label>
                    <div className="lm-phone-input">
                      <div className="lm-country-code">+91</div>
                      <input 
                        type="tel" 
                        placeholder="Mobile Number" 
                        value={mobileNumber}
                        maxLength={10}
                        inputMode="numeric"
                        onChange={(e) => { setMobileNumber(e.target.value.replace(/\D/g, '')); setAuthError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleGetOtp()}
                      />
                    </div>
                  </div>
                  
                  <label className="lm-whatsapp">
                    <input type="checkbox" defaultChecked />
                    <span>Get OTP via WhatsApp</span>
                  </label>
                  
                  {authError && <p className="sn-form-error">{authError}</p>}

                  <button 
                    className={`lm-get-otp ${mobileNumber.length >= 10 ? 'active' : ''}`}
                    onClick={() => mobileNumber.length >= 10 && handleGetOtp()}
                    disabled={authBusy}
                  >
                    {authBusy ? 'Sending...' : 'Get OTP'}
                  </button>
                  
                  <p className="lm-terms">
                    By continuing, I agree to <strong>SleepNest's Terms & Conditions</strong> & <strong>Privacy Policy</strong>
                  </p>
                  
                  <div className="lm-divider">
                    <span>or</span>
                  </div>
                  
                  <div className="lm-social-btns">
                    <button className="lm-social-btn" onClick={() => showToast('Google sign-in is not set up yet. Please use your mobile number or email.', 'info')}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="16" />
                      Google
                    </button>
                    <button className="lm-social-btn" onClick={() => { closeLogin(); navigate('/account', { state: { from: afterLoginPath.current || '/cart' } }); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      Email
                    </button>
                  </div>
                </>
              ) : loginStep === 'otp' ? (
                <>
                  <p className="lm-subtitle">Enter OTP sent to your mobile number, email and WhatsApp</p>
                  
                  <div className="lm-phone-readonly">
                    <div className="lm-country-code">+91</div>
                    <div className="lm-phone-val">{cleanMobile}</div>
                    <button className="lm-change-btn" onClick={() => { setLoginStep('phone'); setAuthError(''); }}>CHANGE</button>
                  </div>
                  
                  <div className="lm-otp-boxes" onPaste={handleOtpPaste}>
                    {otpDigits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        aria-label={`OTP digit ${i + 1}`}
                      />
                    ))}
                  </div>
                  
                  <div className="lm-resend">
                    {otpTimer > 0 ? (
                      <><span className="lm-timer">00:{String(otpTimer).padStart(2, '0')}</span> Resend OTP</>
                    ) : (
                      <button type="button" onClick={handleGetOtp} disabled={authBusy} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {authError && <p className="sn-form-error">{authError}</p>}
                  
                  <button className="lm-verify-otp" onClick={handleVerifyOtp} disabled={authBusy}>{authBusy ? 'Verifying...' : 'Verify OTP'}</button>
                </>
              ) : (
                <>
                  <p className="lm-subtitle">Help us with a few basic details about yourself</p>
                  
                  <div className="lm-details-phone">
                    <div className="lmd-left">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                      <span>+91 {cleanMobile}</span>
                    </div>
                    <button className="lm-change-btn" onClick={() => setLoginStep('phone')}>CHANGE</button>
                  </div>
                  
                  <div className={`lm-input-group lmd-group ${detailErrors.name ? 'error' : ''}`}>
                    <label>Name*</label>
                    <input type="text" className="lm-standard-input" placeholder="Enter Full Name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
                    {detailErrors.name && <span className="lm-error-text">{detailErrors.name}</span>}
                  </div>
                  
                  <div className={`lm-input-group lmd-group ${detailErrors.email ? 'error' : ''}`}>
                    <label>Email*</label>
                    <input type="email" className="lm-standard-input" placeholder="Enter Email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
                    {detailErrors.email && <span className="lm-error-text">{detailErrors.email}</span>}
                  </div>
                  
                  <button className="lm-verify-otp" style={{marginTop: 'auto'}} onClick={handleConfirmDetails} disabled={authBusy}>{authBusy ? 'Saving...' : 'Confirm'}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADDRESS DRAWER OVERLAY */}
      {showAddressDrawer && (
        <div className="address-drawer-overlay" onClick={() => setShowAddressDrawer(false)}>
          <div className="address-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="ad-header">
              <button className="ad-back-btn" onClick={() => setShowAddressDrawer(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h2>Add Address Details</h2>
            </div>
            
            <div className="ad-content">
              <div className="ad-row">
                <div className="ad-group">
                  <label>Flat No./ House no<span>*</span></label>
                  <input type="text" placeholder="Enter here" value={addressForm.flatNo} onChange={setAddr('flatNo')} />
                  {addressErrors.flatNo && <span className="sn-field-error">{addressErrors.flatNo}</span>}
                </div>
                <div className="ad-group">
                  <label>Floor<span>*</span></label>
                  <input type="text" placeholder="Floor" value={addressForm.floor} onChange={setAddr('floor')} />
                  {addressErrors.floor && <span className="sn-field-error">{addressErrors.floor}</span>}
                </div>
              </div>
              
              <div className="ad-group">
                <label>Building Name</label>
                <input type="text" placeholder="Enter here" value={addressForm.building} onChange={setAddr('building')} />
              </div>
              
              <div className="ad-group">
                <label>Area, Street, sector vilage <span>*</span></label>
                <textarea placeholder="Enter Address Here" rows={3} value={addressForm.address} onChange={setAddr('address')}></textarea>
                {addressErrors.address && <span className="sn-field-error">{addressErrors.address}</span>}
              </div>
              
              <div className="ad-group">
                <label>Landmark <span>*</span></label>
                <input type="text" placeholder="Landmark" value={addressForm.landmark} onChange={setAddr('landmark')} />
                {addressErrors.landmark && <span className="sn-field-error">{addressErrors.landmark}</span>}
              </div>
              
              <div className="ad-group">
                <label>Pincode <span>*</span></label>
                <input type="text" inputMode="numeric" maxLength={6} placeholder="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })} />
                {addressErrors.pincode && <span className="sn-field-error">{addressErrors.pincode}</span>}
              </div>
              
              <div className="ad-row">
                <div className="ad-group">
                  <label>City <span>*</span></label>
                  <input type="text" placeholder="City" value={addressForm.city} onChange={setAddr('city')} />
                  {addressErrors.city && <span className="sn-field-error">{addressErrors.city}</span>}
                </div>
                <div className="ad-group">
                  <label>State <span>*</span></label>
                  <input type="text" placeholder="State" value={addressForm.state} onChange={setAddr('state')} />
                  {addressErrors.state && <span className="sn-field-error">{addressErrors.state}</span>}
                </div>
              </div>
              
              <div className="ad-row">
                <div className="ad-group">
                  <label className="ad-label-icon">Receiver's Name <span>*</span> <ShieldAlert size={12}/></label>
                  <input type="text" placeholder="" value={addressForm.name} onChange={setAddr('name')} />
                  {addressErrors.name && <span className="sn-field-error">{addressErrors.name}</span>}
                </div>
                <div className="ad-group">
                  <label className="ad-label-icon">Receiver's Phone No <span>*</span> <ShieldAlert size={12}/></label>
                  <input type="tel" inputMode="numeric" maxLength={10} placeholder="" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })} />
                  {addressErrors.phone && <span className="sn-field-error">{addressErrors.phone}</span>}
                </div>
              </div>
              
              {user && (
              <div className="ad-user-info-section">
                <label className="ad-label-icon">Logged in user information <ShieldAlert size={12}/></label>
                <div className="ad-user-box">
                  <strong>{(user.name || 'SleepNest Customer').toUpperCase()}</strong>{user.phone && (<> <span className="ad-divider">|</span> <span>+91 {user.phone}</span></>)}
                  {user.email && <div className="ad-email">{user.email}</div>}
                </div>
              </div>
              )}
              
              <div className="ad-save-as">
                <label>Save this address by <span>*</span></label>
                <div className="ad-tags">
                  {['Home', 'Work', 'Other'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className={`ad-tag ${addressForm.label === label ? 'active' : ''}`}
                      onClick={() => setAddressForm({ ...addressForm, label })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="ad-footer">
              <button 
                className="ad-submit-btn active" 
                style={{background: '#5c38c9', color: 'white', cursor: 'pointer'}} 
                onClick={handleSaveAddress}
                disabled={savingAddress}
              >
                {savingAddress ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
