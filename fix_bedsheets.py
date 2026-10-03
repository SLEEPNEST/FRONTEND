import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

start = content.find('export const bedsheets = [')
end = content.find('export const protectors = [', start)

bedsheets_block = content[start:end]

new_bedsheets_block = re.sub(
    r"images:\s*\[\n\s*'/images/generated/sleepnest_bedsheet.jpg',\n\s*\]",
    "images: [\n      '/videos/bedsheet_video.mp4',\n      '/images/generated/sleepnest_bedsheet.jpg',\n    ]",
    bedsheets_block
)

content = content[:start] + new_bedsheets_block + content[end:]

with open('src/data/products.js', 'w') as f:
    f.write(content)

