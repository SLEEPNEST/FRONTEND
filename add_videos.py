import re
import sys

with open('src/data/products.js', 'r') as f:
    content = f.read()

# We want to find the mattresses array specifically, or any object with `category: 'mattress',`
# A reliable way: split the file by objects (or just find all images: [ arrays inside the mattresses array)
# It's easier: since all mattresses are in the `export const mattresses = [` array (and maybe `allProducts`),
# actually let's just find `category: 'mattress',` and then the subsequent `images: [` block.

def replace_images(match):
    prefix = match.group(1)
    images_block = match.group(2)
    # Check if video is already there
    if "'/videos/mattress_video.mp4'" not in images_block:
        # Insert video at the start of the array
        images_block = images_block.replace('images: [', "images: [\n      '/videos/mattress_video.mp4',", 1)
    return prefix + images_block

# Regex to match `category: 'mattress'` followed by anything up to `images: [` and the rest of the array.
# Use negative lookahead to ensure we don't jump to the next object's `images: [`.
# Actually simpler:
# match = re.sub(r"(category:\s*'mattress'[^}]*?)(images:\s*\[)", lambda m: m.group(1) + "images: [\n      '/videos/mattress_video.mp4',", content, flags=re.DOTALL)
# wait, if the video is already there, we don't want to add it again.

parts = re.split(r"(category:\s*'mattress')", content)
for i in range(1, len(parts), 2):
    # parts[i] is "category: 'mattress'"
    # parts[i+1] is the rest of the object
    if "'/videos/mattress_video.mp4'" not in parts[i+1]:
        parts[i+1] = re.sub(r"images:\s*\[", "images: [\n      '/videos/mattress_video.mp4',", parts[i+1], count=1)

new_content = "".join(parts)

with open('src/data/products.js', 'w') as f:
    f.write(new_content)

print("Updated products.js successfully.")
