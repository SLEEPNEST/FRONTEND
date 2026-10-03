import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

# I want to make sure the `.pdp-thumb-img` always acts as a perfect circle container,
# and its children (img / video) fill it entirely without changing size when active.

# Let's replace `.pdp-thumb-img` and `.pdp-thumb-img.active` CSS
# We'll make it 50% border radius so it's a circle, 
# and use box-sizing: border-box.

new_thumb_css = """
.pdp-thumb-img {
  width: 72px;
  height: 72px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 3px solid transparent;
  padding: 0;
  background: none;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.pdp-thumb-img img, .pdp-thumb-img video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  box-sizing: border-box;
}

.pdp-thumb-img.active {
  border-color: #0066cc;
}
"""

content = re.sub(r'\.pdp-thumb-img \{.*?\n\}', '', content, flags=re.DOTALL)
content = re.sub(r'\.pdp-thumb-img img \{.*?\n\}', '', content, flags=re.DOTALL)
content = re.sub(r'\.pdp-thumb-img\.active \{.*?\n\}', '', content, flags=re.DOTALL)
content = re.sub(r'\.pdp-thumb-img video \{.*?\n\}', '', content, flags=re.DOTALL)

# Insert it where .pdp-thumbs-new is defined
content = content.replace('.pdp-thumbs-new {', new_thumb_css + '\n.pdp-thumbs-new {')

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)
