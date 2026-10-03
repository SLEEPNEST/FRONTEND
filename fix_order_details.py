import re

with open('src/pages/OrderDetailPage.jsx', 'r') as f:
    content = f.read()

# Replace the static order with dynamic logic
new_logic = """  const { orderId } = useParams();
  
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
"""

# Replace from `const { orderId }` up to `return (`
content = re.sub(r'  const { orderId } = useParams\(\);.*?return \(', new_logic + '\n  return (', content, flags=re.DOTALL)

# Update tracking UI
old_tracking = """            <div className="od-tracking-sec">
              <div className="od-timeline">
                <div className="od-timeline-step">
                  <div className="od-step-icon"></div>
                  <div className="od-step-text">Order Confirmed, {order.confirmedDate}</div>
                </div>
                <div className="od-timeline-step">
                  <div className="od-step-icon"></div>
                  <div className="od-step-text">Delivered, {order.deliveredDate}</div>
                </div>
              </div>
              
              <div className="od-all-updates">
                See All Updates <ChevronRight size={16} style={{marginTop: 2}}/>
              </div>
              
              <div className="od-return-policy">
                Return policy ended on {order.returnPolicy}
              </div>
            </div>"""

new_tracking = """            <div className="od-tracking-sec">
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
            </div>"""

content = content.replace(old_tracking, new_tracking)

with open('src/pages/OrderDetailPage.jsx', 'w') as f:
    f.write(content)

