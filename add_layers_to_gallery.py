import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Replace Riserox images
content = content.replace("'/images/generated/mattress_performance.jpg',", "'/images/generated/mattress_performance.jpg', '/images/generated/sleepnest_mattress_layers_carousel.jpg',")
# Replace Hybrid images
content = content.replace("'/images/generated/mattress_hybrid.jpg',", "'/images/generated/mattress_hybrid.jpg', '/images/generated/sleepnest_mattress_layers_carousel.jpg',")
# Replace Original images
content = content.replace("'/images/generated/mattress_original.jpg',", "'/images/generated/mattress_original.jpg', '/images/generated/sleepnest_mattress_layers_carousel.jpg',")

with open('src/data/products.js', 'w') as f:
    f.write(content)
