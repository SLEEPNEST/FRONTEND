import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Replace Riserox images
content = content.replace("'/images/generated/mattress_performance.jpg', '/images/generated/new_arrival_mattress_card.jpg'", "'/images/generated/mattress_performance.jpg'")
# Replace Hybrid images
content = content.replace("'/images/generated/mattress_hybrid.jpg', '/images/generated/mattress_detail_1.jpg'", "'/images/generated/mattress_hybrid.jpg'")
# Replace Original images
content = content.replace("'/images/generated/mattress_original.jpg', '/images/generated/pure_luxe_latex_mattress.jpg'", "'/images/generated/mattress_original.jpg'")

with open('src/data/products.js', 'w') as f:
    f.write(content)
