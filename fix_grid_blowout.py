import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

# Fix grid columns and add min-width: 0
old_grid = """.pdp-grid-new {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  margin-top: 24px;
}"""

new_grid = """.pdp-grid-new {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 24px;
}"""

old_left = """.pdp-left-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 100px;
  align-self: start;
}"""

new_left = """.pdp-left-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 100px;
  align-self: start;
  min-width: 0;
}"""

old_right = """.pdp-right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}"""

new_right = """.pdp-right-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}"""

content = content.replace(old_grid, new_grid)
content = content.replace(old_left, new_left)
content = content.replace(old_right, new_right)

# Also let's ensure the main image container has min-width: 0
old_main_img = """.pdp-main-img-container {
  flex-grow: 1;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: var(--soft-beige);
}"""

new_main_img = """.pdp-main-img-container {
  flex-grow: 1;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: var(--soft-beige);
  min-width: 0;
}"""
content = content.replace(old_main_img, new_main_img)

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)
