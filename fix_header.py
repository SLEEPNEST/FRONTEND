import re

with open('src/components/Header.jsx', 'r') as f:
    content = f.read()

# Replace the specific button
old_btn = """              <button className="pd-pill">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5c38c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <span>My Orders</span>
              </button>"""

new_btn = """              <button className="pd-pill" onClick={() => {navigate('/my-orders'); setMobileOpen(false);}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5c38c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <span>My Orders</span>
              </button>"""

content = content.replace(old_btn, new_btn)

with open('src/components/Header.jsx', 'w') as f:
    f.write(content)
