import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Replace Riserox images
content = content.replace("'/images/generated/mattress_performance.jpg', ", "")
# Replace Hybrid images
content = content.replace("'/images/generated/mattress_hybrid.jpg', ", "")
# Replace Original images
content = content.replace("'/images/generated/mattress_original.jpg', ", "")

with open('src/data/products.js', 'w') as f:
    f.write(content)
