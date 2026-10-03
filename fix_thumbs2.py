import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

content = content.replace(
    "border-radius: 20px;\n  border: 4px solid transparent;\n  padding: 0;",
    "border-radius: 24px;\n  border: 4px solid transparent;\n  padding: 2px;"
)
content = content.replace(
    "border-radius: 16px;\n}",
    "border-radius: 18px;\n}"
)

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)
