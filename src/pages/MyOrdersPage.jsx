import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import './AccountPage.css'; // Reuse styles

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'In Progress', 'Delivered', 'Cancelled'];

  const dummyOrders = [
    {
      id: 'ABC-6457325',
      date: '10 May 2021',
      status: 'In progress',
      desc: 'SleepNest Ortho Mattress | Cloud Pillows | Waterproof Protector & 2 more items',
      price: '12,500',
      image: '/images/generated/sleepnest_mattress_card.jpg',
      badge: '+4',
      statusColor: 'in-progress'
    },
    {
      id: 'ABC-6457324',
      date: '02 April 2021',
      status: 'Delivered',
      desc: 'Premium Cotton Bedsheet (Queen Size)',
      price: '2,499',
      image: '/images/generated/sleepnest_bedsheet.jpg',
      statusColor: 'delivered'
    },
    {
      id: 'ABC-6457323',
      date: '15 March 2021',
      status: 'Delivered',
      desc: 'Memory Foam Contour Pillow (Pack of 2)',
      price: '1,899',
      image: '/images/generated/sleepnest_pillow.jpg',
      statusColor: 'delivered'
    }
  ];

  const filteredOrders = activeTab === 'All' 
    ? dummyOrders 
    : dummyOrders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());

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
          <div className="orders-date-select">
            <span>Select date range</span> <ChevronDown size={16}/>
          </div>
        </div>
        
        {/* Order List */}
        <div className="orders-list-new" style={{ marginTop: '24px' }}>
          {filteredOrders.map((order, i) => (
            <Link to={`/my-orders/${order.id}`} className="order-card-new" key={i} style={{display:'block', textDecoration:'none', color:'inherit'}}>
              <div className="order-card-top">
                <div className={`order-status-pill ${order.statusColor}`}>
                  <span className="dot"></span> {order.status}
                </div>
                <span className="order-pipe">|</span>
                <span className="order-date-new">{order.date}</span>
              </div>
              <div className="order-card-main">
                <div className="oc-img-col">
                  <div className="oc-img-wrapper">
                    <img src={order.image} alt="Product" />
                    {order.badge && <div className="oc-img-overlay">{order.badge}</div>}
                  </div>
                </div>
                <div className="oc-info-col">
                  <div className="oc-id">Order ID: {order.id}</div>
                  <div className="oc-desc">{order.desc}</div>
                  <div className="oc-price">₹ {order.price}</div>
                </div>
                <div className="oc-arrow-col">
                  <ChevronRight size={24} color="#8c2b2b"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
