import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, MessageCircle, Star, Copy, Home, User, Download, Banknote, HelpCircle, Trophy } from 'lucide-react';
import './OrderDetailPage.css';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  
  const allOrders = {
    'ABC-6457325': {
      id: 'ABC-6457325',
      title: 'SleepNest Ortho Mattress',
      variant: 'King Size, 8 Inch',
      seller: 'SleepNest Official',
      price: '12,500',
      offer: '1 offer',
      image: '/images/generated/sleepnest_mattress_card.jpg',
      status: 'In progress',
      confirmedDate: 'May 10',
      shippedDate: 'May 12',
      outForDeliveryDate: 'Expected by May 15',
      address: 'M.g.r street Marusoor, arni, Marusoor Tiruvannamalai...',
      name: 'Akash',
      phone: '8870392530',
      listingPrice: '17,999',
      sellingPrice: '12,500',
      totalFees: '109',
      discount: '-5,608'
    },
    'ABC-6457324': {
      id: 'ABC-6457324',
      title: 'Premium Cotton Bedsheet',
      variant: 'Queen Size',
      seller: 'SleepNest Official',
      price: '2,499',
      offer: '0 offers',
      image: '/images/generated/sleepnest_bedsheet.jpg',
      status: 'Delivered',
      confirmedDate: 'Apr 02',
      deliveredDate: 'Apr 05',
      returnPolicy: 'Apr 12',
      address: 'M.g.r street Marusoor, arni, Marusoor Tiruvannamalai...',
      name: 'Akash',
      phone: '8870392530',
      listingPrice: '3,999',
      sellingPrice: '2,499',
      totalFees: '50',
      discount: '-1,550'
    },
    'ABC-6457323': {
      id: 'ABC-6457323',
      title: 'Memory Foam Contour Pillow',
      variant: 'Pack of 2',
      seller: 'SleepNest Official',
      price: '1,899',
      offer: '2 offers',
      image: '/images/generated/sleepnest_pillow.jpg',
      status: 'Delivered',
      confirmedDate: 'Mar 15',
      deliveredDate: 'Mar 18',
      returnPolicy: 'Mar 25',
      address: 'M.g.r street Marusoor, arni, Marusoor Tiruvannamalai...',
      name: 'Akash',
      phone: '8870392530',
      listingPrice: '2,999',
      sellingPrice: '1,899',
      totalFees: '40',
      discount: '-1,140'
    }
  };

  const order = allOrders[orderId] || allOrders['ABC-6457325'];
  const isDelivered = order.status === 'Delivered';

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
                ) : (
                  <>
                    <div className="od-timeline-step completed">
                      <div className="od-step-icon"></div>
                      <div className="od-step-text">Shipped, {order.shippedDate}</div>
                    </div>
                    <div className="od-timeline-step pending">
                      <div className="od-step-icon"></div>
                      <div className="od-step-text">Out for Delivery</div>
                    </div>
                    <div className="od-timeline-step pending">
                      <div className="od-step-icon"></div>
                      <div className="od-step-text">Delivery expected by {order.outForDeliveryDate?.split('by ')[1]}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="od-all-updates">
                See All Updates <ChevronRight size={16} style={{marginTop: 2}}/>
              </div>
              
              {isDelivered && (
                <div className="od-return-policy">
                  Return policy ended on {order.returnPolicy}
                </div>
              )}
            </div>

            <button className="od-chat-btn">
              <MessageCircle size={20} /> Chat with us
            </button>
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
            Order #{order.id} <Copy size={12} style={{marginLeft: 4, cursor:'pointer'}}/>
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
                    <strong>Home</strong> {order.address}
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
                <span style={{display:'flex', alignItems:'center', gap:4}}>Total fees <ChevronDown size={14} color="#878787"/></span>
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
                <span>Paid By</span>
                <span style={{display:'flex', alignItems:'center', gap:4, fontWeight: 500}}><Banknote size={16}/> Cash On Delivery</span>
              </div>

              <button className="od-download-btn">
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
