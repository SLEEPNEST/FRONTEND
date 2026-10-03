import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Split content by "export const comforters =" and then by "export const pillows"
parts = content.split("export const comforters = [")
before_comforters = parts[0]
after_split = parts[1].split("export const pillows = [")
comforters_content = after_split[0]
after_comforters = after_split[1]

# In comforters_content, replace all Unsplash image URLs with the new comforter image
comforters_content = re.sub(r"'https://images\.unsplash\.com/[^']+'", "'/images/generated/sleepnest_comforter.jpg'", comforters_content)

content = before_comforters + "export const comforters = [" + comforters_content + "export const pillows = [" + after_comforters

with open('src/data/products.js', 'w') as f:
    f.write(content)
