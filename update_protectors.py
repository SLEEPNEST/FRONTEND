import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Replace Unsplash images for protectors with the new protector image
# sleepnest-waterproof-mattress-protector
content = content.replace("'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80'", "'/images/generated/sleepnest_mattress_protector.jpg'")

# sleepnest-bamboo-cooling-protector
content = content.replace("'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80'", "'/images/generated/sleepnest_mattress_protector.jpg'")

# sleepnest-quilted-plush-protector
content = content.replace("'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80'", "'/images/generated/sleepnest_mattress_protector.jpg'")

# sleepnest-anti-bug-encasement
content = content.replace("'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80'", "'/images/generated/sleepnest_mattress_protector.jpg'")

with open('src/data/products.js', 'w') as f:
    f.write(content)
