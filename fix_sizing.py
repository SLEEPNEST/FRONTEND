import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

# 1. Add flex-shrink: 0 to .pdp-thumbs-new
old_thumbs = """.pdp-thumbs-new {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 90px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20px; /* Give some breathing room at the bottom */
}"""

new_thumbs = """.pdp-thumbs-new {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 90px;
  flex-shrink: 0; /* PREVENT SQUISHING! */
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20px; /* Give some breathing room at the bottom */
}"""

content = content.replace(old_thumbs, new_thumbs)


# 2. Let's make the grid column wider for the left side to increase product size
content = content.replace("grid-template-columns: 1.1fr 0.9fr;", "grid-template-columns: 1.3fr 0.9fr;")

# 3. Increase max-height of images wrapper so it can actually get bigger
content = content.replace("max-height: 500px;", "max-height: 650px;")

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)

