import re

with open('src/pages/AccountPage.jsx', 'r') as f:
    content = f.read()

# Replace the entire <div className="account-content-new"> block up to the closing tags
start = content.find('<div className="account-content-new">')
end = content.find('</div>\n        </div>\n      </div>\n    );', start)

new_content = """<div className="account-content-new">
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
            </div>"""

if start != -1 and end != -1:
    updated = content[:start] + new_content + content[end:]
    with open('src/pages/AccountPage.jsx', 'w') as f:
        f.write(updated)
else:
    print("Could not find the block to replace!")

