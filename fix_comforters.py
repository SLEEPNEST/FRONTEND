import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

start = content.find('export const comforters = [')
end = content.find('export const pillows = [', start)

comforters_block = content[start:end]

new_comforters_block = re.sub(
    r"images:\s*\[\n\s*'/images/generated/sleepnest_comforter.jpg',\n\s*\]",
    "images: [\n      '/videos/comforter_video.mp4',\n      '/images/generated/sleepnest_comforter.jpg',\n    ]",
    comforters_block
)

content = content[:start] + new_comforters_block + content[end:]

with open('src/data/products.js', 'w') as f:
    f.write(content)

