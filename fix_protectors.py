import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# We need to find the protectors block and update its images array
# The protectors list starts at `export const protectors = [` and ends at the next `export const`
start = content.find('export const protectors = [')
end = content.find('export const comforters = [', start)

protectors_block = content[start:end]

# For each product in the protectors block, we replace:
#     images: [
#       '/images/generated/sleepnest_mattress_protector.jpg',
#     ],
# with:
#     images: [
#       '/videos/protector_video.mp4',
#       '/images/generated/sleepnest_mattress_protector.jpg',
#     ],

new_protectors_block = re.sub(
    r"images:\s*\[\n\s*'/images/generated/sleepnest_mattress_protector.jpg',\n\s*\]",
    "images: [\n      '/videos/protector_video.mp4',\n      '/images/generated/sleepnest_mattress_protector.jpg',\n    ]",
    protectors_block
)

content = content[:start] + new_protectors_block + content[end:]

with open('src/data/products.js', 'w') as f:
    f.write(content)

