import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Replace all occurrences of the layers image with the context image + layers image
content = content.replace("'/images/generated/sleepnest_mattress_layers_carousel.jpg'", "'/images/generated/sleepnest_mattress_context.jpg',\n      '/images/generated/sleepnest_mattress_layers_carousel.jpg'")

with open('src/data/products.js', 'w') as f:
    f.write(content)
