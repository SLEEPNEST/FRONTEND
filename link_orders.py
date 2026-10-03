import re

with open('src/pages/MyOrdersPage.jsx', 'r') as f:
    content = f.read()

# Replace `<div className="order-card-new" key={i}>` with `<Link to={"/my-orders/" + order.id} className="order-card-new" key={i} style={{display:'block', textDecoration:'none', color:'inherit'}}>`
# and `</div>` with `</Link>` for the card

old_str = """          {filteredOrders.map((order, i) => (
            <div className="order-card-new" key={i}>
              <div className="order-card-top">"""

new_str = """          {filteredOrders.map((order, i) => (
            <Link to={`/my-orders/${order.id}`} className="order-card-new" key={i} style={{display:'block', textDecoration:'none', color:'inherit'}}>
              <div className="order-card-top">"""

content = content.replace(old_str, new_str)

old_str_end = """              </div>
            </div>
          ))}"""
          
new_str_end = """              </div>
            </Link>
          ))}"""
          
content = content.replace(old_str_end, new_str_end)

with open('src/pages/MyOrdersPage.jsx', 'w') as f:
    f.write(content)
