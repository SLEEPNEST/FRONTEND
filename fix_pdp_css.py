import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

# Replace the incorrect order classes with the correct ones
content = content.replace(".pdp-price-container { order: 5; }", ".choose-size-block { order: 5; }")
content = content.replace(".pdp-offers-container { order: 6; }", ".pdp-divider { order: 6; }")
content = content.replace(".pdp-options-container { order: 7; }", ".delivery-info-row { order: 7; }")
content = content.replace(".add-to-cart-wrapper { order: 8; }", ".offers-wrapper { order: 8; }")
content = content.replace(".pdp-buy-now { order: 9; }", ".pdp-promo-banner { order: 9; }")

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)

