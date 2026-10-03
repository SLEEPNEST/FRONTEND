import re

with open('src/data/products.js', 'r') as f:
    content = f.read()

# Replace Riserox
content = content.replace(
    "'/images/generated/mattress_performance.jpg', '/images/generated/new_arrival_mattress_card.jpg', '/images/generated/mattress_detail_2.jpg', '/images/generated/mattress_detail_3.jpg',",
    "'/images/generated/sleepnest_mattress_card.jpg', '/images/generated/sleepnest_mattress_front.jpg', '/images/generated/sleepnest_mattress_context.jpg', '/images/generated/sleepnest_mattress_layers_carousel.jpg',"
)

# Replace Hybrid
content = content.replace(
    "'/images/generated/mattress_hybrid.jpg', '/images/generated/mattress_detail_1.jpg', '/images/generated/mattress_detail_2.jpg', '/images/generated/mattress_detail_3.jpg',",
    "'/images/generated/sleepnest_mattress_card.jpg', '/images/generated/sleepnest_mattress_front.jpg', '/images/generated/sleepnest_mattress_context.jpg', '/images/generated/sleepnest_mattress_layers_carousel.jpg',"
)

# Replace Original
content = content.replace(
    "'/images/generated/mattress_original.jpg', '/images/generated/pure_luxe_latex_mattress.jpg', '/images/generated/mattress_detail_2.jpg', '/images/generated/mattress_detail_3.jpg',",
    "'/images/generated/sleepnest_mattress_card.jpg', '/images/generated/sleepnest_mattress_front.jpg', '/images/generated/sleepnest_mattress_context.jpg', '/images/generated/sleepnest_mattress_layers_carousel.jpg',"
)

with open('src/data/products.js', 'w') as f:
    f.write(content)
