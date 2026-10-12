import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, MessageCircle, Star, Copy, Home, User, Download, Banknote, HelpCircle, Trophy, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatINR, shortDate, formatAddress, PAYMENT_LABELS } from '../utils/orderFormat';
import './OrderDetailPage.css';

const CANCELLABLE = ['Confirmed', 'Shipped'];

// Turns an order from the API into the fields this page already displays
function toView(o) {
  const first = o.items[0] || {};
  const extra = o.items.length - 1;
  const when = (status) => o.statusHistory?.find((h) => h.status === status)?.at;
  const savings = o.listingTotal - o.subtotal + o.discount;
  return {
    id: o.orderNumber,
    title: extra > 0 ? `${first.name} & ${extra} more item${extra > 1 ? 's' : ''}` : first.name,
    variant: o.items.map((i) => `${i.selectedSize} × ${i.qty}`).join(', '),
    seller: 'SleepNest Official',
    price: formatINR(o.total),
    offer: o.discount > 0 ? '1 offer' : '0 offers',
    image: first.image,
    status: o.status,
    confirmedDate: shortDate(when('Confirmed') || o.createdAt),
    shippedDate: when('Shipped') ? shortDate(when('Shipped')) : null,
    outForDeliveryDate: when('Out for Delivery') ? shortDate(when('Out for Delivery')) : null,
    expectedDate: shortDate(o.expectedDelivery),
    deliveredDate: shortDate(o.deliveredAt || when('Delivered')),
    cancelledDate: shortDate(o.cancelledAt || when('Cancelled')),
    returnPolicy: o.deliveredAt ? shortDate(new Date(new Date(o.deliveredAt).getTime() + 7 * 864e5)) : '',
    returnEnded: o.deliveredAt ? Date.now() > new Date(o.deliveredAt).getTime() + 7 * 864e5 : false,
    label: o.shippingAddress.label || 'Home',
    address: formatAddress(o.shippingAddress),
    name: o.shippingAddress.name,
    phone: o.shippingAddress.phone,
    listingPrice: formatINR(o.listingTotal),
    sellingPrice: formatINR(o.subtotal),
    totalFees: formatINR(o.gst + (o.shipping || 0)),
    discount: `-${formatINR(savings)}`,
    paidBy: PAYMENT_LABELS[o.paymentMethod] || o.paymentMethod,
    items: o.items,
    raw: o,
  };
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const { user, authReady, showToast } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (!authReady) return undefined;
    if (!user) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    api.orders
      .get(orderId)
      .then((res) => { if (!cancelled) setData(res.order); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [orderId, user, authReady]);

  const handleCancel = async () => {
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    setCancelling(true);
    try {
      const res = await api.orders.cancel(data.orderNumber, 'Cancelled by customer');
      setData(res.order);
      showToast('Your order has been cancelled', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard?.writeText(data.orderNumber).then(
      () => showToast('Order ID copied', 'success'),
      () => {}
    );
  };

  if (authReady && !user) {
    return (
      <div className="order-detail-page">
        <div className="sn-state-msg" style={{ marginTop: 48 }}>
          <h2 style={{ marginBottom: 8 }}>Please log in to view this order</h2>
          <Link to="/account" state={{ from: `/my-orders/${orderId}` }} className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loading || !authReady) {
    return <div className="order-detail-page"><p className="sn-state-msg">Loading order details...</p></div>;
  }

  if (error || !data) {
    return (
      <div className="order-detail-page">
        <div className="sn-state-msg sn-state-error" style={{ marginTop: 48 }}>
          <p>{error || 'Order not found'}</p>
          <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: 12 }}>Back to My Orders</Link>
        </div>
      </div>
    );
  }

  const order = toView(data);
  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';
  const canCancel = CANCELLABLE.includes(order.status);

  return (
    <div className="order-detail-page">
      <div className="od-breadcrumbs">
        <Link to="/">Home</Link> <ChevronRight size={14}/>
        <Link to="/account">My Account</Link> <ChevronRight size={14}/>
        <Link to="/my-orders">My Orders</Link> <ChevronRight size={14}/>
        <span>{order.id}</span>
      </div>

      <div className="od-container">
        {/* Left Column */}
        <div className="od-left">

          <div className="od-card">
            <div className="od-product-sec">
              <div className="od-product-info">
                <h1>{order.title} ({order.variant})</h1>
                <div className="od-product-meta">
                  <span>{order.variant}</span>
                  <span>Seller: {order.seller}</span>
                </div>
                <div className="od-product-price">
                  ₹{order.price} <span className="od-offer">{order.offer}</span>
                </div>
              </div>
              <img src={order.image} alt={order.title} className="od-product-img" />
            </div>

            <div className="od-tracking-sec">
              <div className={`od-timeline ${!isDelivered ? 'pending-timeline' : ''}`}>
                <div className="od-timeline-step completed">
                  <div className="od-step-icon"></div>
                  <div className="od-step-text">Order Confirmed, {order.confirmedDate}</div>
                </div>
                {isDelivered ? (
                  <div className="od-timeline-step completed">
                    <div className="od-step-icon"></div>
                    <div className="od-step-text">Delivered, {order.deliveredDate}</div>
                  </div>
                ) : isCancelled ? (
                  <div className="od-timeline-step completed">
                    <div className="od-step-icon"></div>
                    <div className="od-step-text">Cancelled, {order.cancelledDate}</div>
                  </div>
                ) : (
                  <>
                    <div className={`od-timeline-step ${order.shippedDate ? 'completed' : 'pending'}`}>
                      <div className="od-step-icon"></div>
                      <div className="od-step-text">Shipped{order.shippedDate ? `, ${order.shippedDate}` : ''}</div>
                    </div>
                    <div className={`od-timeline-step ${order.outForDeliveryDate ? 'completed' : 'pending'}`}>
                      <div className="od-step-icon"></div>
                      <div className="od-step-text">Out for Delivery{order.outForDeliveryDate ? `, ${order.outForDeliveryDate}` : ''}</div>
                    </div>
                    <div className="od-timeline-step pending">
                      <div className="od-step-icon"></div>
                      <div className="od-step-text">Delivery expected by {order.expectedDate}</div>
                    </div>
                  </>
                )}
              </div>

              <div className="od-all-updates">
                See All Updates <ChevronRight size={16} style={{marginTop: 2}}/>
              </div>

              {isDelivered && (
                <div className="od-return-policy">
                  Return policy {order.returnEnded ? 'ended' : 'ends'} on {order.returnPolicy}
                </div>
              )}
            </div>

            {canCancel && (
              <button className="od-chat-btn" onClick={handleCancel} disabled={cancelling} style={{ color: '#c62828' }}>
                <XCircle size={20} /> {cancelling ? 'Cancelling...' : confirmCancel ? 'Tap again to confirm cancellation' : 'Cancel order'}
              </button>
            )}

            <a className="od-chat-btn" href="tel:+917676761001" style={{ textDecoration: 'none' }}>
              <MessageCircle size={20} /> Chat with us
            </a>
          </div>

          <div className="od-card od-rate-sec">
            <h2>Rate your experience</h2>
            <div className="od-rate-box">
              <div className="od-rate-text">
                <PackageIcon /> Rate the product
              </div>
              <div className="od-stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={28} color="#878787" strokeWidth={1.5} />)}
              </div>
            </div>
          </div>

          <div className="od-bottom-id">
            Order #{order.id} <Copy size={12} style={{marginLeft: 4, cursor:'pointer'}} onClick={copyOrderId}/>
          </div>

        </div>

        {/* Right Column */}
        <div className="od-right">

          <div className="od-right-card">
            <div className="od-right-header">
              <h3>Delivery details</h3>
              <ChevronUp size={20} color="#878787"/>
            </div>
            <div className="od-right-body">
              <div className="od-address-block">
                <div className="od-address-row">
                  <Home size={16} className="icon"/>
                  <div className="od-address-text">
                    <strong>{order.label}</strong> {order.address}
                  </div>
                </div>
                <div className="od-address-row">
                  <User size={16} className="icon"/>
                  <div className="od-address-text">
                    <strong>{order.name}</strong> {order.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="od-right-card" style={{border: '1px solid #2874f0'}}>
            <div className="od-right-header">
              <h3>Price details</h3>
              <ChevronUp size={20} color="#878787"/>
            </div>
            <div className="od-right-body">
              <div className="od-price-row">
                <span>Listing price</span>
                <span style={{textDecoration:'line-through', color:'#878787'}}>₹{order.listingPrice}</span>
              </div>
              <div className="od-price-row">
                <span style={{display:'flex', alignItems:'center', gap:4}}>Selling price <HelpCircle size={14} color="#878787"/></span>
                <span>₹{order.sellingPrice}</span>
              </div>
              <div className="od-price-row">
                <span style={{display:'flex', alignItems:'center', gap:4}}>Total fees (GST) <ChevronDown size={14} color="#878787"/></span>
                <span>₹{order.totalFees}</span>
              </div>
              <div className="od-price-row discount">
                <span style={{display:'flex', alignItems:'center', gap:4}}>Other discount <ChevronDown size={14} color="#878787"/></span>
                <span>{order.discount}</span>
              </div>

              <div className="od-price-row total">
                <span>Total amount</span>
                <span>₹{order.price}</span>
              </div>

              <div className="od-paid-by">
                <span>{data.paymentStatus === 'paid' ? 'Paid By' : 'Payment'}</span>
                <span style={{display:'flex', alignItems:'center', gap:4, fontWeight: 500}}><Banknote size={16}/> {order.paidBy}</span>
              </div>

              <button className="od-download-btn" onClick={() => window.print()}>
                <Download size={18}/> Download Invoice
              </button>
            </div>
          </div>

          <div className="od-right-card">
            <div className="od-right-header">
              <h3 style={{display:'flex', alignItems:'center', gap:8}}><Trophy size={18}/> Offers earned</h3>
              <ChevronDown size={20} color="#878787"/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function PackageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#878787" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  );
}
