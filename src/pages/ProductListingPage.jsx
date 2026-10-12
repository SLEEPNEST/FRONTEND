// Product Listing Page (used for Mattress, Bed, Sofa, Pillows etc.)
import { useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, ChevronDown, X, Filter, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { navLinks } from '../data/products';
import { useCatalog } from '../context/AppContext';
import './ProductListingPage.css';

const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Average Rating' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'discount', label: 'Discount %' },
];

const filterGroups = [
  {
    label: 'Price Range',
    key: 'price',
    options: ['Under ₹10,000', '₹10,000–₹20,000', '₹20,000–₹40,000', '₹40,000+'],
  },
  {
    label: 'Firmness',
    key: 'firmness',
    options: ['Soft', 'Medium', 'Medium Firm', 'Firm', 'Dual'],
  },
  {
    label: 'Size',
    key: 'size',
    options: ['Single', 'Double', 'Queen', 'King', 'Baby/Crib'],
  },
  {
    label: 'Rating',
    key: 'rating',
    options: ['4★ & above', '4.5★ & above', '4.8★ & above'],
  },
];

export default function ProductListingPage() {
  const { category } = useParams();
  const location = useLocation();
  const { allProducts } = useCatalog();
  const searchTerm = (new URLSearchParams(location.search).get('q') || '').trim().toLowerCase();

  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilters, setActiveFilters] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null);

  // Determine category from URL
  const categoryMap = {
    mattress: { label: 'Mattresses', category: 'mattress' },
    bed: { label: 'Beds & Frames', category: 'bed' },
    sofa: { label: 'Sofas', category: 'sofa' },
    pillows: { label: 'Pillows', category: 'pillow' },
    bedroom: { label: 'Bedroom', category: null },
    living: { label: 'Living Room', category: null },
    dining: { label: 'Dining', category: null },
    decor: { label: 'Decor', category: null },
    kids: { label: 'Kids', category: null },
  };

  const currentCat = categoryMap[category] || { label: 'All Products', category: null };

  const filteredProducts = useMemo(() => {
    let products = currentCat.category
      ? allProducts.filter((p) => p.category === currentCat.category)
      : allProducts;

    // Header search (/search?q=...)
    if (searchTerm) {
      products = products.filter((p) =>
        [p.name, p.subcategory, p.category].some((v) => String(v || '').toLowerCase().includes(searchTerm))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc': products = [...products].sort((a, b) => a.price - b.price); break;
      case 'price-desc': products = [...products].sort((a, b) => b.price - a.price); break;
      case 'rating': products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'discount': products = [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
      default: break;
    }
    return products;
  }, [category, sortBy, allProducts, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFilter = (key, value) => {
    setActiveFilters((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const activeFilterCount = Object.values(activeFilters).flat().length;

  return (
    <div className="plp-page">
      {/* Breadcrumb */}
      <div className="plp-breadcrumb">
        <div className="container">
          <nav className="breadcrumb-nav">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>{currentCat.label}</span>
          </nav>
        </div>
      </div>

      {/* Category Hero */}
      <div className="plp-hero" style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))' }}>
        <div className="container">
          <div className="plp-hero-inner">
            <div>
              <h1 className="plp-hero-title">{currentCat.label}</h1>
              <p className="plp-hero-sub">
                {filteredProducts.length}+ products · Free delivery · 100-night trial
              </p>
            </div>
            <div className="plp-hero-stats">
              <div className="plp-stat">
                <span>55%</span>
                <small>Max Off</small>
              </div>
              <div className="plp-stat">
                <span>100N</span>
                <small>Trial</small>
              </div>
              <div className="plp-stat">
                <span>10yr</span>
                <small>Warranty</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters Bar */}
      <div className="plp-filter-bar">
        <div className="container">
          <div className="plp-filter-bar-inner">
            {/* Subcategory Chips (simulated) */}
            <div className="plp-chips">
              <button className="plp-chip active">All</button>
              {category === 'mattress' && (
                <>
                  <button className="plp-chip">Ortho Foam</button>
                  <button className="plp-chip">EcoLatex</button>
                  <button className="plp-chip">Pocket Spring</button>
                  <button className="plp-chip">Dual Comfort</button>
                  <button className="plp-chip">Kids</button>
                </>
              )}
              {category === 'bed' && (
                <>
                  <button className="plp-chip">Solid Wood</button>
                  <button className="plp-chip">Hydraulic</button>
                  <button className="plp-chip">Upholstered</button>
                  <button className="plp-chip">Platform</button>
                </>
              )}
              {category === 'sofa' && (
                <>
                  <button className="plp-chip">3 Seater</button>
                  <button className="plp-chip">L-Shape</button>
                  <button className="plp-chip">Recliner</button>
                  <button className="plp-chip">Sofa Cum Bed</button>
                </>
              )}
            </div>

            {/* Sort & View */}
            <div className="plp-controls">
              <button
                className="plp-filter-btn"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter size={16} />
                Filters
                {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
              </button>

              <div className="plp-sort">
                <label>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-input form-select"
                  style={{ padding: '8px 36px 8px 12px', fontSize: '13px' }}
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="plp-layout">
          {/* Sidebar Filters */}
          <aside className={`plp-sidebar ${filtersOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  className="sidebar-clear"
                  onClick={() => setActiveFilters({})}
                >
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>

            {filterGroups.map((group) => (
              <div key={group.key} className="filter-group">
                <button
                  className="filter-group-toggle"
                  onClick={() => setExpandedFilter(expandedFilter === group.key ? null : group.key)}
                >
                  <span>{group.label}</span>
                  <ChevronDown size={16} className={expandedFilter === group.key ? 'rotated' : ''} />
                </button>
                {expandedFilter !== group.key && (
                  <div className="filter-options">
                    {group.options.map((opt) => (
                      <label key={opt} className="filter-option">
                        <input
                          type="checkbox"
                          checked={(activeFilters[group.key] || []).includes(opt)}
                          onChange={() => toggleFilter(group.key, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </aside>

          {/* Products Grid */}
          <div className="plp-products">
            <div className="plp-result-count">
              Showing <strong>{filteredProducts.length}</strong> products
              {activeFilterCount > 0 && (
                <span className="active-tags">
                  {Object.entries(activeFilters).flatMap(([key, vals]) =>
                    vals.map((v) => (
                      <button key={`${key}-${v}`} className="filter-tag" onClick={() => toggleFilter(key, v)}>
                        {v} <X size={12} />
                      </button>
                    ))
                  )}
                </span>
              )}
            </div>

            <div className={viewMode === 'list' ? 'product-list-view' : 'product-grid-4'}>
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} compact={viewMode === 'list'} />
              ))}

              {filteredProducts.length === 0 && (
                <div className="empty-state">
                  <span>😴</span>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or browse all products.</p>
                  <Link to="/" className="btn btn-primary">Browse All</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
