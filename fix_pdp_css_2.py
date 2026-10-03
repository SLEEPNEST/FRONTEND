import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

content = content.replace(".offers-wrapper { order: 8; }", ".offers-section-wrapper { order: 8; }")

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)
