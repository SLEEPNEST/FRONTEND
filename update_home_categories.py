import re

with open('src/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Mattress
content = content.replace("'/images/generated/mattress_hero_ai.jpg'", "'/images/generated/sleepnest_mattress_category.jpg'")
# Bedsheet
content = content.replace("'/images/generated/category_bedsheet_stack.jpg'", "'/images/generated/sleepnest_bedsheet.jpg'")
# Protector
content = content.replace("'/images/generated/protector_category.png'", "'/images/generated/sleepnest_mattress_protector.jpg'")
# Comforter
content = content.replace("'/images/generated/comforter_hero.jpg'", "'/images/generated/sleepnest_comforter.jpg'")
# Pillow
content = content.replace("'/images/generated/pillow_hero_ai.jpg'", "'/images/generated/sleepnest_pillow.jpg'")

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(content)
