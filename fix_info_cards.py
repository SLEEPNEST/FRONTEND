import re

with open('src/pages/ProductDetailPage.css', 'r') as f:
    content = f.read()

# Change mobile grid to a scrolling flex row
new_mobile_info_cards = """
  .pdp-info-cards {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 12px;
    padding-bottom: 8px;
    grid-template-columns: none; /* override grid */
  }
  .info-card-pill {
    min-width: 140px;
    scroll-snap-align: start;
    flex-shrink: 0;
  }
  .info-card-pill::-webkit-scrollbar { display: none; }
  .pdp-info-cards::-webkit-scrollbar { display: none; }
"""

# Let's just insert it into the max-width: 576px block
content = content.replace("  .pdp-info-cards {\n    grid-template-columns: 1fr;\n  }", new_mobile_info_cards)

# Also let's fix max-width: 992px to also use the same scrolling behavior for better tablet experience
content = content.replace("  .pdp-info-cards {\n    grid-template-columns: repeat(2, 1fr);\n  }", "  /* pdp-info-cards handled below */")

with open('src/pages/ProductDetailPage.css', 'w') as f:
    f.write(content)

