import re

with open('src/pages/AccountPage.jsx', 'r') as f:
    content = f.read()

# Make the My Orders box in AccountPage a Link to /my-orders
old_box = """                <div className="as-quick-box active">
                  <Package size={20} className="q-icon" />
                  <span>My Orders</span>
                </div>"""
                
new_box = """                <Link to="/my-orders" className="as-quick-box active">
                  <Package size={20} className="q-icon" />
                  <span>My Orders</span>
                </Link>"""

content = content.replace(old_box, new_box)

with open('src/pages/AccountPage.jsx', 'w') as f:
    f.write(content)
