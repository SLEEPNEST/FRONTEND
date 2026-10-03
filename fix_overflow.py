import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

old_thumbs = """.pdp-thumbs-new {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 90px;
  overflow-y: auto;
}"""

new_thumbs = """.pdp-thumbs-new {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 90px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20px; /* Give some breathing room at the bottom */
}
/* Hide scrollbar completely on desktop to keep it clean */
.pdp-thumbs-new::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}"""

content = content.replace(old_thumbs, new_thumbs)

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)
