import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings2, Grid, List, Tag, X } from 'lucide-react';
import { useApp, useCatalog } from '../context/AppContext';
import './MattressPage.css';

export default function ProtectorPage() {
  const { addToCart, showToast } = useApp();
  const { protectors } = useCatalog();
  const [showFilter, setShowFilter] = useState(false);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product, 'Queen', 1).then((ok) => {
      if (ok && showToast) showToast(`Added ${product.name} to cart!`);
    });
  };

  return (
    <div className="mattress-plp-page">
      {/* 1. Hero Section (Home Page Style) */}
      <section className="plp-hero plp-hero-fullbleed">
        <div className="plp-hero-slide">
          <img src="/images/generated/protector_category.png" alt="Protector" className="plp-hero-bg-img" />
          <div className="plp-hero-overlay">
            <div className="plp-hero-content">
              <h1 className="plp-hero-title">Protector</h1>
              <p className="plp-hero-desc">
                Safeguard your mattress with our 100% waterproof and breathable protectors. Shield against spills, stains, and allergens without compromising on comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="plp-main">
        <div className="plp-container">
          
          {/* Top Toolbar */}
          <div className="plp-toolbar">
            <div className="plp-toolbar-left">
              <button className="plp-filter-btn" onClick={() => setShowFilter(true)}>
                Filter <Settings2 size={16} />
              </button>
              <div className="plp-sort">
                <span>Sort by</span>
                <select className="plp-sort-select">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
            
            <div className="plp-toolbar-right">
              <div className="plp-compare-toggle">
                <span>Compare</span>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="plp-view-as">
                <span>View as</span>
                <button className="view-icon"><List size={18} color="#666"/></button>
                <button className="view-icon active"><Grid size={18} color="#000"/></button>
              </div>
            </div>
          </div>
          
          {showFilter && <div className="plp-filter-overlay mobile-only" onClick={() => setShowFilter(false)}></div>}

          <div className="plp-layout">
            
            {/* Left Sidebar Filters */}
            <aside className={`plp-sidebar ${showFilter ? 'open' : ''}`}>
              <div className="plp-sidebar-header mobile-only">
                <h3>Filters</h3>
                <button className="plp-close-filter" onClick={() => setShowFilter(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="plp-filter-block">
                <h3 className="plp-filter-title">Availability <span className="arrow-up"></span></h3>
                <div className="plp-filter-options">
                  <label className="plp-checkbox">
                    <input type="checkbox" />
                    <span className="chk-label">In stock</span>
                    <span className="chk-count">(13)</span>
                  </label>
                  <label className="plp-checkbox disabled">
                    <input type="checkbox" disabled />
                    <span className="chk-label">Out of stock</span>
                    <span className="chk-count">(0)</span>
                  </label>
                </div>
              </div>

              <div className="plp-filter-block">
                <h3 className="plp-filter-title">Price <span className="arrow-up"></span></h3>
                <div className="plp-price-inputs">
                  <div className="price-input">
                    <span>₹</span>
                    <input type="number" defaultValue="0" />
                  </div>
                  <span className="price-dash">-</span>
                  <div className="price-input">
                    <span>₹</span>
                    <input type="number" defaultValue="2999" />
                  </div>
                </div>
                <div className="plp-price-slider">
                  <div className="slider-track"></div>
                  <div className="slider-handle left"></div>
                  <div className="slider-handle right"></div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="plp-grid">
              {protectors.map(product => {
                // Mock standard values if product object misses them
                const original = product.originalPrice || product.price * 1.6;
                const emi = product.emi || Math.round(product.price / 12);
                const discount = product.discount || 30;

                return (
                  <Link to={`/product/${product.id}`} key={product.id} className="plp-product-card">
                    <div className="plp-pc-img-wrap">
                      <img src={product.images.find(img => !img.endsWith('.mp4')) || product.images[0]} alt={product.name} />
                      <div className="plp-discount-tag">
                        <Tag size={10} style={{marginRight: 4, transform: 'scaleX(-1)'}}/> Up to {discount}% off
                      </div>
                    </div>
                    <div className="plp-pc-info">
                      <h3 className="plp-pc-title">{product.name}</h3>
                      <div className="plp-pc-pricing">
                        <span className="plp-pc-price">From Rs. {product.price.toLocaleString()}.00</span>
                        <span className="plp-pc-orig">Rs. {original.toLocaleString()}.00</span>
                      </div>
                      <div className="plp-pc-emi">
                        or Rs.{emi} /Month <span className="emi-link"><span className="emi-icon"></span> Buy on EMI &gt;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. Explore Categories */}
      <section className="plp-explore">
        <div className="plp-container">
          <h2 className="plp-explore-title">Explore Other <span>Categories</span></h2>
          <div className="plp-explore-grid">
            <Link to="/mattress" className="plp-explore-item">
              <div className="explore-img-wrap">
                <img src="/images/generated/explore_mattress.jpg" alt="Mattress" />
              </div>
              <h4>Mattress</h4>
            </Link>
            <Link to="/bedsheet" className="plp-explore-item">
              <div className="explore-img-wrap">
                <img src="/images/generated/bedsheet_hero.jpg" alt="Bedsheet" />
              </div>
              <h4>Bedsheet</h4>
            </Link>
            <Link to="/comforter" className="plp-explore-item">
              <div className="explore-img-wrap">
                <img src="/images/generated/comforter_category.jpg" alt="Comforter" />
              </div>
              <h4>Comforter</h4>
            </Link>
            <Link to="/pillow" className="plp-explore-item">
              <div className="explore-img-wrap">
                <img src="/images/generated/pillow_category.png" alt="Pillow" />
              </div>
              <h4>Pillow</h4>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
