import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatDate, formatINR, statusPill, orderSummaryText } from '../utils/orderFormat';
import './AccountPage.css'; // Reuse styles

const DATE_RANGES = [
  { id: 'all', label: 'Select date range', days: null },
  { id: '30', label: 'Last 30 days', days: 30 },
  { id: '180', label: 'Last 6 months', days: 180 },
  { id: '365', label: 'Last 1 year', days: 365 },
];

export default function MyOrdersPage() {
  const { user, authReady } = useApp();
  const [activeTab, setActiveTab] = useState('All');
  const [range, setRange] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = ['All', 'In Progress', 'Delivered', 'Cancelled'];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    const days = DATE_RANGES.find((r) => r.id === range)?.days;
    const from = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) : undefined;

    setLoading(true);
    setError('');
    api.orders
      .my({ status: activeTab === 'All' ? undefined : activeTab.toLowerCase().replace(' ', '-'), from })
      .then((res) => { if (!cancelled) setOrders(res.orders); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, activeTab, range]);

  if (authReady && !user) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="sn-state-msg" style={{ marginTop: 48 }}>
            <h2 style={{ marginBottom: 8 }}>Please log in to see your orders</h2>
            <Link to="/account" state={{ from: '/my-orders' }} className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const showList = !loading && authReady && !error;

  return (
    <div className="account-page">
      <div className="container">

        {/* Breadcrumbs */}
        <div className="orders-breadcrumbs" style={{ marginTop: '24px', marginBottom: '32px' }}>
          <Link to="/">Home</Link> <ChevronRight size={14}/> <Link to="/account">My Account</Link> <ChevronRight size={14}/> <span>My Orders</span>
        </div>

        {/* Filter Row */}
        <div className="orders-filter-row">
          <div className="orders-tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`orders-tab-pill ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="orders-date-select" style={{ position: 'relative' }}>
            <span>{DATE_RANGES.find((r) => r.id === range)?.label}</span> <ChevronDown size={16}/>
            <select
              aria-label="Select date range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
            >
              {DATE_RANGES.map((r) => (
                <option key={r.id} value={r.id}>{r.id === 'all' ? 'All time' : r.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Order List */}
        <div className="orders-list-new" style={{ marginTop: '24px' }}>
          {(loading || !authReady) && <p className="sn-state-msg">Loading your orders...</p>}
          {!loading && authReady && error && <p className="sn-state-msg sn-state-error">{error}</p>}
          {showList && orders.length === 0 && (
            <div className="sn-state-msg">
              <p>No {activeTab === 'All' ? '' : activeTab.toLowerCase() + ' '}orders found.</p>
              <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>Start Shopping</Link>
            </div>
          )}
          {showList && orders.map((order) => {
            const pill = statusPill(order.status);
            const firstItem = order.items[0];
            return (
              <Link to={`/my-orders/${order.orderNumber}`} className="order-card-new" key={order.id} style={{display:'block', textDecoration:'none', color:'inherit'}}>
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
      </div>
    </div>
  );
}
