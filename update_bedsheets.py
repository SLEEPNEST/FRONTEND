import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Split content by "export const bedsheets =" and then by "export const protectors"
parts = content.split("export const bedsheets = [")
before_bedsheets = parts[0]
after_split = parts[1].split("export const protectors = [")
bedsheets_content = after_split[0]
after_bedsheets = after_split[1]

# In bedsheets_content, replace all Unsplash image URLs with the new bedsheet image
bedsheets_content = re.sub(r"'https://images\.unsplash\.com/[^']+'", "'/images/generated/sleepnest_bedsheet.jpg'", bedsheets_content)

content = before_bedsheets + "export const bedsheets = [" + bedsheets_content + "export const protectors = [" + after_bedsheets

with open('src/data/products.js', 'w') as f:
    f.write(content)
