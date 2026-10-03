import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

old_left = """.pdp-left-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}"""

new_left = """.pdp-left-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 100px;
  align-self: start;
}"""

content = content.replace(old_left, new_left)

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)
