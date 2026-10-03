import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# We want to add the new images to the `images: [...]` array of mattresses.
# A simple way is to find the occurrences of `/videos/mattress_video.mp4'`
# and insert the new images right after it.

new_images = ",\n      '/images/generated/sleepnest_mattress_front.jpg',\n      '/images/generated/sleepnest_mattress_angle.jpg'"

# Find where video is inserted and replace with video + new images
content = content.replace("'/videos/mattress_video.mp4'", "'/videos/mattress_video.mp4'" + new_images)

with open('src/data/products.js', 'w') as f:
    f.write(content)
