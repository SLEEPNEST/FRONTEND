import re

with open('src/pages/ProductDetailPage.jsx', 'r') as f:
    content = f.read()

sticky_bar = """
      {/* ── MOBILE STICKY BOTTOM BAR ── */}
      <div className="pdp-mobile-sticky-bar mobile-only">
        <div className="sticky-bar-price">
          <span className="sb-price">₹{product.price.toLocaleString()}</span>
          <span className="sb-mrp">₹{original.toLocaleString()}</span>
        </div>
        <button className="btn-add-to-cart" onClick={handleAddToCart}>
          <ShoppingCart size={18}/> Add to Cart
        </button>
      </div>

    </div>
  );
}
"""

content = content.replace("    </div>\n  );\n}", sticky_bar)

with open('src/pages/ProductDetailPage.jsx', 'w') as f:
    f.write(content)

with open('src/pages/ProductDetailPage.css', 'a') as f:
    f.write("""

/* ── STICKY BOTTOM BAR (MOBILE ONLY) ── */
.pdp-mobile-sticky-bar {
  display: none;
}

@media (max-width: 992px) {
  .pdp-page {
    padding-bottom: 90px; /* Space for sticky bar */
  }

  .mobile-only {
    display: flex !important;
  }

  .pdp-mobile-sticky-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
    z-index: 100;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    border-top: 1px solid var(--gray-200);
  }
  
  .sticky-bar-price {
    display: flex;
    flex-direction: column;
  }
  
  .sb-price {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-dark);
    line-height: 1;
  }
  
  .sb-mrp {
    font-size: 13px;
    color: var(--gray-500);
    text-decoration: line-through;
    margin-top: 4px;
  }
  
  .pdp-mobile-sticky-bar .btn-add-to-cart {
    flex-grow: 1;
    padding: 14px;
    font-size: 16px;
    margin-top: 0;
  }

  /* Fix Mobile Ordering */
  .pdp-grid-new {
    display: flex;
    flex-direction: column;
  }
  
  /* Use flex order by breaking out columns */
  .pdp-left-col, .pdp-right-col {
    display: contents;
  }

  .pdp-images-wrapper { order: 1; }
  .pdp-info-cards { order: 10; margin-top: 24px; }
  
  .pdp-new-title { order: 2; margin-top: 8px; }
  .pdp-new-rating-row { order: 3; }
  .choose-series-block { order: 4; }
  .pdp-price-container { order: 5; }
  .pdp-offers-container { order: 6; }
  .pdp-options-container { order: 7; }
  .add-to-cart-wrapper { order: 8; }
  .pdp-buy-now { order: 9; }
  .pdp-promo-banner { order: 11; }
  .fbt-section-new { order: 12; }
}
""")
