import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useApp, useCatalog } from '../context/AppContext';
import NewArrivalCard from './NewArrivalCard';
import './NewArrivalsSection.css';


export default function NewArrivalsSection() {
  const { addToCart } = useApp();
  const { mattresses } = useCatalog();

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'Standard', 1);
    
  };

  const formattedProducts = mattresses.slice(0, 3).map(p => ({
    ...p,
    image: p.images.length > 1 ? p.images[1] : p.images[0],
    feature1: p.features?.[0],
    feature2: p.features?.[1],
    discount: parseInt(p.discount)
  }));

  return (
    <section className="new-arrivals-section">
      <div className="new-arrivals-banner-header">
        <div className="container">
          <div className="new-arrivals-title-row">
            <div className="new-arrivals-heading-group">
              <span className="new-outline-badge">NEW</span>
              <h2 className="new-arrivals-title">Arrivals</h2>
            </div>
            <p className="new-arrivals-subtitle">
              Be the first to explore our newest furniture and home essentials, crafted for modern homes.
            </p>
          </div>

          {/* Top Pill */}
          <div className="new-arrivals-main-pills">
            <button className="main-pill-btn active">
              Mattresses
            </button>
          </div>
        </div>
      </div>

      <div className="container">

        {/* Product Cards Grid */}
        <div className="new-arrivals-cards-grid">
          {formattedProducts.map((product) => (
            <NewArrivalCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
