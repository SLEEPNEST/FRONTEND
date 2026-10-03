import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

content = content.replace(
    "'/videos/mattress_video.mp4',\n      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80',",
    "'/videos/mattress_video.mp4',\n      '/images/generated/sleepnest_mattress_card.jpg', '/images/generated/sleepnest_mattress_front.jpg', '/images/generated/sleepnest_mattress_context.jpg', '/images/generated/sleepnest_mattress_layers_carousel.jpg',"
)

with open('src/data/products.js', 'w') as f:
    f.write(content)
