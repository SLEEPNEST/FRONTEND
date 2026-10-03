import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Split content by "export const pillows ="
parts = content.split("export const pillows = [")
before_pillows = parts[0]
pillows_content = parts[1]

# In pillows_content, replace the generic pillow image URL with the new one
# Wait, I don't know what URL pillows is using. Let's look at the first few lines of pillows.
pillows_content = re.sub(r"'/images/generated/product_contour_pillow\.jpg'", "'/images/generated/sleepnest_pillow.jpg'", pillows_content)

content = before_pillows + "export const pillows = [" + pillows_content

with open('src/data/products.js', 'w') as f:
    f.write(content)
