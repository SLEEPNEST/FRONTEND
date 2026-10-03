import re

with open('src/pages/ProductDetailPage.jsx', 'r') as f:
    content = f.read()

# Remove the title and the layers-top-full image block
to_remove = """          <h2 className="layers-title">Mattress Layers</h2>
          
                    <div className="layers-top-full">
            <img src="/images/generated/sleepnest_mattress_layers_labeled.jpg" alt="SleepNest Mattress Layers" style={{ width: '100%', borderRadius: '24px', display: 'block' }} />
          </div>"""

content = content.replace(to_remove, "")

with open('src/pages/ProductDetailPage.jsx', 'w') as f:
    f.write(content)
