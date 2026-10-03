import re

with open('src/components/Header.jsx', 'r') as f:
    content = f.read()

subnav_html = """
        {/* Secondary Categories Nav */}
        <div className="categories-subnav">
          <div className="container">
            <nav className="subnav-list">
              <Link to="/mattress" className="subnav-item" onClick={() => setMobileOpen(false)}>Mattress</Link>
              <Link to="/bedsheet" className="subnav-item" onClick={() => setMobileOpen(false)}>Bedsheet</Link>
              <Link to="/protector" className="subnav-item" onClick={() => setMobileOpen(false)}>Protector</Link>
              <Link to="/comforter" className="subnav-item" onClick={() => setMobileOpen(false)}>Comforter</Link>
              <Link to="/pillow" className="subnav-item" onClick={() => setMobileOpen(false)}>Pillow</Link>
            </nav>
          </div>
        </div>
      </header>
"""

# Replace the closing </header> tag with the subnav and then closing tag
content = content.replace("</header>", subnav_html)

with open('src/components/Header.jsx', 'w') as f:
    f.write(content)

with open('src/components/Header.css', 'a') as f:
    f.write("""
/* Secondary Categories Nav */
.categories-subnav {
  background-color: var(--white);
  border-top: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
  padding: 12px 0;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.subnav-list {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
}

.subnav-list::-webkit-scrollbar {
  display: none;
}

.subnav-item {
  color: var(--gray-700);
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.subnav-item:hover {
  color: var(--primary);
}

@media (max-width: 768px) {
  .subnav-list {
    gap: 20px;
    justify-content: flex-start;
    padding: 0 16px;
  }
}
""")

