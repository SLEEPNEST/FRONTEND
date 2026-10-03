import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Replace the first 3 Pravatar links with the new local images
content = content.replace("'https://i.pravatar.cc/80?img=47'", "'/images/generated/customer_1.png'")
content = content.replace("'https://i.pravatar.cc/80?img=12'", "'/images/generated/customer_2.png'")
content = content.replace("'https://i.pravatar.cc/80?img=32'", "'/images/generated/customer_3.png'")

with open('src/data/products.js', 'w') as f:
    f.write(content)
