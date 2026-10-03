import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

# Replace width and height of video-play-icon
content = content.replace("  width: 24px;\n  height: 24px;", "  width: 48px;\n  height: 48px;\n  font-size: 20px;")

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)
