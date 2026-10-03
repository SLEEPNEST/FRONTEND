import re

with open('src/pages/ProductDetailPage.jsx', 'r') as f:
    content = f.read()

replacement = """          <div className="layers-top-full">
            <img src="/images/generated/sleepnest_mattress_layers_labeled.jpg" alt="SleepNest Mattress Layers" style={{ width: '100%', borderRadius: '24px', display: 'block' }} />
          </div>"""

# Replace from `<div className="layers-top-grid">` up to its closing `</div>` before `<div className="layers-bottom-grid">`
content = re.sub(r'<div className="layers-top-grid">[\s\S]*?(?=<div className="layers-bottom-grid">)', replacement + "\n\n", content)

with open('src/pages/ProductDetailPage.jsx', 'w') as f:
    f.write(content)
