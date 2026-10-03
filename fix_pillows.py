import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

start = content.find('export const pillows = [')
end = content.find('export const allProducts =', start)

pillows_block = content[start:end]

new_pillows_block = re.sub(
    r"images:\s*\[\n\s*'/images/generated/sleepnest_pillow.jpg',\n\s*\]",
    "images: [\n      '/videos/pillow_video.mp4',\n      '/images/generated/sleepnest_pillow.jpg',\n    ]",
    pillows_block
)

content = content[:start] + new_pillows_block + content[end:]

with open('src/data/products.js', 'w') as f:
    f.write(content)

