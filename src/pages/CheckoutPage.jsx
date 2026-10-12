// Checkout / Payment Page
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CreditCard, Smartphone, Building2, Banknote, Shield, ChevronRight, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import logoImg from '../assets/logo.png';
import './CheckoutPage.css';

const STEPS = ['Delivery', 'Payment', 'Review'];

const paymentMethods = [
  { id: 'upi', label: 'UPI', Icon: Smartphone, desc: 'Pay with PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', Icon: CreditCard, desc: 'Visa, Mastercard, Rupay' },
  { id: 'netbanking', label: 'Net Banking', Icon: Building2, desc: 'All major Indian banks' },
  { id: 'cod', label: 'Cash on Delivery', Icon: Banknote, desc: 'Pay when you receive' },
  { id: 'emi', label: 'EMI / Pay Later', Icon: CreditCard, desc: 'No Cost EMI available' },
];

export default function CheckoutPage() {
  const { cart, cartTotal, user, authReady, defaultAddress, refreshCart, refreshAddresses, showToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [orderPlaced, setOrderPlaced] = useState(null); // the created order
  const [loading, setLoading] = useState(false);
  const [addressErrors, setAddressErrors] = useState({});
  // When the form was filled from a saved address and left unchanged, the order uses that address id
  const [prefill, setPrefill] = useState(null); // { id, snapshot }

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
  });

  // Pre-fill the delivery form with the saved default address (only while the form is still empty)
  useEffect(() => {
    if (!defaultAddress) return;
    setAddress((current) => {
      if (Object.values(current).some(Boolean)) return current;
      const street = [defaultAddress.flatNo, defaultAddress.floor && `Floor ${defaultAddress.floor}`, defaultAddress.building, defaultAddress.address, defaultAddress.landmark]
        .filter(Boolean)
        .join(', ');
      const filled = {
        name: defaultAddress.name || '',
        phone: defaultAddress.phone || '',
        pincode: defaultAddress.pincode || '',
        address: street,
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
      };
      setPrefill({ id: defaultAddress.id, snapshot: JSON.stringify(filled) });
      return filled;
    });
  }, [defaultAddress]);

  const discount = Math.round(cartTotal * 0.05);
  const gst = Math.round((cartTotal - discount) * 0.18);
  const finalTotal = cartTotal - discount + gst;

  const validateAddress = () => {
    const errors = {};
    if (address.name.trim().length < 2) errors.name = 'Please enter your full name';
    if (!/^[6-9]\d{9}$/.test(address.phone.replace(/\D/g, '').slice(-10))) errors.phone = 'Enter a valid 10-digit mobile number';
    if (address.address.trim().length < 3) errors.address = 'Please enter your address';
    if (!/^\d{6}$/.test(address.pincode.trim())) errors.pincode = 'Enter a 6-digit pincode';
    if (!address.city.trim()) errors.city = 'Please enter your city';
    if (!address.state) errors.state = 'Please select your state';
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateAddress()) setStep(1);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      showToast('Please log in to place your order', 'info');
      navigate('/account', { state: { from: '/checkout' } });
      return;
    }
    if (!cart.length) {
      showToast('Your cart is empty', 'error');
      return;
    }
    if (!validateAddress()) {
      setStep(0);
      return;
    }
    setLoading(true);
    try {
      const unchangedSaved = prefill && prefill.snapshot === JSON.stringify(address);
      const { order } = await api.orders.create(
        unchangedSaved
          ? { paymentMethod, addressId: prefill.id }
          : {
              paymentMethod,
              shippingAddress: { ...address, phone: address.phone.replace(/\D/g, '').slice(-10) },
              saveAddress: true,
            }
      );
      setOrderPlaced(order);
      showToast('Order placed successfully!', 'success');
      // The backend empties the saved cart once the order is created
      await Promise.all([refreshCart(), refreshAddresses()]).catch(() => {});
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="container">
          <div className="order-success-inner">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h1>Order Placed Successfully!</h1>
            <p>Your order has been confirmed. You will receive a confirmation email and SMS shortly.</p>
            <div className="order-id">
              <strong>Order ID:</strong> #{orderPlaced.orderNumber}
            </div>
            <div className="order-success-steps">
              {[
                { label: 'Order Confirmed', done: true, time: 'Just now' },
                { label: 'Processing', done: false, time: '1-2 hours' },
                { label: 'Dispatched', done: false, time: '24 hours' },
                { label: 'Delivered', done: false, time: '5-7 business days' },
              ].map((s) => (
                <div key={s.label} className={`order-step ${s.done ? 'done' : ''}`}>
                  <div className="order-step-dot" />
                  <div>
                    <p className="order-step-label">{s.label}</p>
                    <p className="order-step-time">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="success-ctas">
              <Link to="/" className="btn btn-primary btn-lg">Continue Shopping</Link>
              <Link to={`/my-orders/${orderPlaced.orderNumber}`} className="btn btn-outline">Track Order</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Stepper */}
        <div className="checkout-stepper">
          <Link to="/" className="checkout-logo">
            <img src={logoImg} alt="SleepNest Logo" className="checkout-logo-img" />
          </Link>
          <div className="stepper">
            {STEPS.map((s, i) => (
              <div key={s} className={`stepper-item ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="stepper-dot">
                  {i < step ? <Check size={14} /> : <span>{i + 1}</span>}
                </div>
                <span className="stepper-label">{s}</span>
                {i < STEPS.length - 1 && <div className="stepper-line" />}
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-layout">
          {/* Left: Form */}
          <div className="checkout-form-area">

            {/* Step 0: Delivery */}
            {step === 0 && (
              <div className="checkout-section">
                <h2 className="checkout-section-title">Delivery Address</h2>

                {/* Login CTA */}
                {authReady && !user && (
                <div className="checkout-login-cta">
                  <span>Already have an account?</span>
                  <Link to="/account" state={{ from: '/checkout' }} className="login-link">Login for faster checkout</Link>
                </div>
                )}

                <div className="checkout-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter your full name"
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      />
                      {addressErrors.name && <span className="sn-field-error">{addressErrors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+91 XXXXX XXXXX"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      />
                      {addressErrors.phone && <span className="sn-field-error">{addressErrors.phone}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="House/Flat number, Street, Landmark"
                      value={address.address}
                      onChange={(e) => setAddress({ ...address, address: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                    {addressErrors.address && <span className="sn-field-error">{addressErrors.address}</span>}
                  </div>
                  <div className="form-row-3">
                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="6-digit pincode"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                        maxLength={6}
                      />
                      {addressErrors.pincode && <span className="sn-field-error">{addressErrors.pincode}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                      {addressErrors.city && <span className="sn-field-error">{addressErrors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <select
                        className="form-input form-select"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      >
                        <option value="">Select State</option>
                        {[...new Set(['Karnataka','Maharashtra','Tamil Nadu','Delhi','Gujarat','Rajasthan','Telangana','Kerala','West Bengal','Uttar Pradesh', ...(address.state ? [address.state] : [])])].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {addressErrors.state && <span className="sn-field-error">{addressErrors.state}</span>}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  style={{ marginTop: 8 }}
                  onClick={handleContinueToPayment}
                  disabled={!address.name || !address.phone || !address.pincode}
                >
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="checkout-section">
                <h2 className="checkout-section-title">Payment Method</h2>
                <div className="payment-options">
                  {paymentMethods.map(({ id, label, Icon, desc }) => (
                    <button
                      key={id}
                      className={`payment-option ${paymentMethod === id ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(id)}
                    >
                      <div className="payment-option-radio">
                        {paymentMethod === id && <div className="radio-dot" />}
                      </div>
                      <div className="payment-option-icon">
                        <Icon size={20} />
                      </div>
                      <div className="payment-option-text">
                        <span className="payment-option-label">{label}</span>
                        <span className="payment-option-desc">{desc}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* UPI Input */}
                {paymentMethod === 'upi' && (
                  <div className="payment-detail-form">
                    <label className="form-label">UPI ID</label>
                    <input type="text" className="form-input" placeholder="name@paytm or name@upi" />
                    <div className="upi-apps">
                      {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map((app) => (
                        <button key={app} className="upi-app-btn">{app}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Input */}
                {paymentMethod === 'card' && (
                  <div className="payment-detail-form">
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input type="text" className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input type="text" className="form-input" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input type="password" className="form-input" placeholder="***" maxLength={3} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Name on Card</label>
                      <input type="text" className="form-input" placeholder="As printed on card" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'emi' && (
                  <div className="payment-detail-form">
                    <p className="emi-note">No Cost EMI available on select cards. EMI starts from ₹{Math.round(finalTotal / 12).toLocaleString()}/month.</p>
                    <div className="emi-options">
                      {[3, 6, 9, 12].map((m) => (
                        <button key={m} className="emi-option">
                          {m} months · ₹{Math.round(finalTotal / m).toLocaleString()}/mo
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="checkout-nav">
                  <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="checkout-section">
                <h2 className="checkout-section-title">Review & Place Order</h2>

                {/* Summary Review */}
                <div className="review-section">
                  <div className="review-row">
                    <h4>Delivery To</h4>
                    <button className="review-edit" onClick={() => setStep(0)}>Edit</button>
                  </div>
                  <p className="review-detail">{address.name} · {address.phone}</p>
                  <p className="review-detail">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                </div>

                <div className="review-section">
                  <div className="review-row">
                    <h4>Payment</h4>
                    <button className="review-edit" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p className="review-detail">{paymentMethods.find(m => m.id === paymentMethod)?.label}</p>
                </div>

                <div className="review-section">
                  <h4>Order Items ({cart.length})</h4>
                  {cart.map((item) => (
                    <div key={item.cartId} className="review-item">
                      <img src={item.images?.[0]} alt={item.name} className="review-item-img" />
                      <div className="review-item-info">
                        <p className="review-item-name">{item.name}</p>
                        <p className="review-item-meta">Size: {item.selectedSize} · Qty: {item.qty}</p>
                      </div>
                      <p className="review-item-price">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="checkout-nav">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn btn-gold btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    style={{ minWidth: 200, justifyContent: 'center' }}
                  >
                    {loading ? (
                      <span className="loading-spinner">Processing...</span>
                    ) : !user ? (
                      <>Login to Place Order</>
                    ) : (
                      <>Place Order · ₹{finalTotal.toLocaleString()}</>
                    )}
                  </button>
                </div>

                <div className="order-disclaimer">
                  <Shield size={14} />
                  <span>Your payment information is encrypted and secure. By placing your order, you agree to our Terms & Conditions.</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="checkout-summary">
            <div className="checkout-summary-card">
              <h3>Order Summary</h3>
              <div className="checkout-items">
                {cart.map((item) => (
                  <div key={item.cartId} className="checkout-item">
                    <div className="checkout-item-img">
                      <img src={item.images?.[0]} alt={item.name} />
                      <span className="checkout-item-qty">{item.qty}</span>
                    </div>
                    <div className="checkout-item-info">
                      <p className="checkout-item-name">{item.name}</p>
                      <p className="checkout-item-size">{item.selectedSize}</p>
                    </div>
                    <p className="checkout-item-price">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="checkout-summary-rows">
                <div className="checkout-summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                <div className="checkout-summary-row"><span>Discount (5%)</span><span style={{ color: 'var(--success)' }}>-₹{discount.toLocaleString()}</span></div>
                <div className="checkout-summary-row"><span>GST</span><span>₹{gst.toLocaleString()}</span></div>
                <div className="checkout-summary-row"><span>Shipping</span><span style={{ color: 'var(--success)' }}>FREE</span></div>
              </div>
              <div className="checkout-summary-total">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
