import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Split content by "export const protectors =" and then by "export const comforters"
parts = content.split("export const protectors = [")
before_protectors = parts[0]
after_split = parts[1].split("export const comforters = [")
protectors_content = after_split[0]
after_protectors = after_split[1]

# In protectors_content, replace all image URLs with the new protector image
protectors_content = re.sub(r"'https://images\.unsplash\.com/[^']+'", "'/images/generated/sleepnest_mattress_protector.jpg'", protectors_content)

content = before_protectors + "export const protectors = [" + protectors_content + "export const comforters = [" + after_protectors

with open('src/data/products.js', 'w') as f:
    f.write(content)
