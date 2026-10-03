import re

with open('src/pages/AccountPage.jsx', 'r') as f:
    content = f.read()

# I will replace the entire returned JSX for logged in user
start = content.find('  if (user) {')
end = content.find('  return (\n    <div className="account-page account-auth-page">')

new_jsx = """  if (user) {
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
                <div className="as-quick-box active">
                  <Package size={20} className="q-icon" />
                  <span>My Orders</span>
                </div>
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
              <h2 className="orders-page-title">My Orders</h2>
              
              {/* Order List */}
              <div className="orders-list">
                
                {/* Order 1 */}
                <div className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-date">Placed on: 12 Aug, 2026</span>
                      <span className="order-id">Order #SN-9823741</span>
                    </div>
                    <div className="order-status-badge delivered">Delivered</div>
                  </div>
                  <div className="order-card-body">
                    <div className="order-items">
                      <div className="order-item">
                        <div className="oi-img">
                          <img src="/images/generated/sleepnest_mattress_card.jpg" alt="Mattress" />
                        </div>
                        <div className="oi-details">
                          <h4>SleepNest Ortho Memory Foam Mattress</h4>
                          <p className="oi-meta">Size: Queen | Thickness: 8 inches</p>
                          <p className="oi-price">₹12,499</p>
                        </div>
                      </div>
                    </div>
                    <div className="order-actions">
                      <button className="btn-order-outline">Track Order</button>
                      <button className="btn-order-outline">View Invoice</button>
                      <button className="btn-order-primary">Write Review</button>
                    </div>
                  </div>
                </div>

                {/* Order 2 */}
                <div className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-date">Placed on: 28 Jul, 2026</span>
                      <span className="order-id">Order #SN-7729112</span>
                    </div>
                    <div className="order-status-badge processing">In Transit</div>
                  </div>
                  <div className="order-card-body">
                    <div className="order-items">
                      <div className="order-item">
                        <div className="oi-img">
                          <img src="/images/generated/sleepnest_pillow.jpg" alt="Pillow" />
                        </div>
                        <div className="oi-details">
                          <h4>SleepNest Ergonomic Contour Memory Foam Pillow</h4>
                          <p className="oi-meta">Size: Standard | Qty: 2</p>
                          <p className="oi-price">₹3,598</p>
                        </div>
                      </div>
                    </div>
                    <div className="order-actions">
                      <button className="btn-order-primary">Track Order</button>
                      <button className="btn-order-outline">Cancel</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
"""

content = content[:start] + new_jsx + content[end:]

# Add imports for new icons
content = content.replace("import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, Eye, EyeOff, Lock } from 'lucide-react';",
"import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, Eye, EyeOff, Lock, ShoppingCart, Grid, Store, ShieldCheck, Video, Percent, Home, BookOpen, Phone, FileText, MessageCircle, ChevronDown } from 'lucide-react';")

with open('src/pages/AccountPage.jsx', 'w') as f:
    f.write(content)

