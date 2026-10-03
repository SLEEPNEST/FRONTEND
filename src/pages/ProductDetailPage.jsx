import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Shield, Truck, Award, Leaf,
  ChevronRight, ChevronLeft, Check, Minus, Plus, Share2,
  ArrowRight, ThumbsUp, MapPin, Search, Maximize, Play, PlayCircle, X, ChevronDown, CheckCircle2, XCircle, MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { allProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useApp();

  const product = allProducts.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Single | 72" x 30" x 5"');
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSeries, setSelectedSeries] = useState('Classic');
  const [pincode, setPincode] = useState('600026');
  const [isEditingPincode, setIsEditingPincode] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [tempSizeGroup, setTempSizeGroup] = useState('Single');
  const [tempDimension, setTempDimension] = useState('72x30 Inch');
  const [tempThickness, setTempThickness] = useState('5');
  const [showFbtDrawer, setShowFbtDrawer] = useState(false);

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40 }}>
        <span style={{ fontSize: 64 }}>😕</span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--primary)' }}>Product Not Found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product, selectedSize);
    showToast('Added to cart!');
    setShowFbtDrawer(true);
  };

  const seriesData = [
    { id: 'Essential', name: 'Essential', tag: 'Best Value', tagColor: 'green', desc: 'Just the right support to help you fall asleep', mrp: 7813, price: 5169, bank: 4807 },
    { id: 'Classic', name: 'Classic', tag: 'Bestseller', tagColor: 'purple', desc: 'Orthopedic foam for side and back sleepers', mrp: 10408, price: 6669, bank: 6202 },
    { id: 'Infinity', name: 'Infinity', tag: 'Advanced', tagColor: 'blue', desc: 'Lumbar-reinforced foam for long-term back health', mrp: 16284, price: 10959, bank: 10192 },
    { id: 'Ultra', name: 'Ultra', tag: 'Premium', tagColor: 'gray', desc: 'Not available in this size, choose a different size option', disabled: true }
  ];

  const offers = [
    { type: 'Card Offer', price: '₹6,202', icons: ['axis', 'hdfc', 'sbi'] },
    { type: 'UPI-Snapmint', price: '₹2,223', suffix: '/months(2)', icon: 'snapmint', tag: 'No Cost EMI' },
    { type: 'UPI Offer', price: '₹6,564', icon: 'gpay' },
    { type: 'EMI Offer', price: '₹2,283', suffix: '/months(3)', icon: 'hdfc' }
  ];

  const faqs = [
    { q: 'What thickness is suited in this mattress?', a: 'For a person of standard weight (upto 80kg), then you require a mattress thickness of 6 inches (15.24 cm).' },
    { q: 'How is the mattress delivered?', a: 'It is compressed, rolled and shipped in a box for easy handling.' },
    { q: 'Is the mattress cover water proof? Or should I buy it separately?', a: 'The cover is not waterproof. We recommend buying our mattress protector.' },
    { q: 'How is the mattress packed and delivered?', a: 'Vacuum packed and rolled into a compact box.' },
    { q: 'Can I use the mattress immediately or should I put out the mattress in the sun for any smells to go?', a: 'You can use it immediately. Any new foam smell will dissipate within a few hours in a well-ventilated room.' }
  ];

  return (
    <div className="pdp-page">
      <div className="container">
        <div className="pdp-grid-new">
          
          {/* ── Left: Images & Info Cards ─────────────────────────── */}
          <div className="pdp-left-col">
            <div className="pdp-images-wrapper">
              <div className="pdp-thumbs-new">
                {product.images?.map((media, i) => {
                  const isVideo = media.endsWith('.mp4');
                  return (
                    <button
                      key={i}
                      className={`pdp-thumb-img ${selectedImg === i ? 'active' : ''}`}
                      onClick={() => setSelectedImg(i)}
                    >
                      {isVideo ? (
                        <video src={media} style={{width:'100%', height:'100%', objectFit:'cover',}} muted playsInline />
                      ) : (
                        <img src={media} alt={`View ${i + 1}`} />
                      )}
                      {isVideo && (
                        <div className="video-play-icon">▶</div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="pdp-main-img-container">
                {(() => {
                  const currentMedia = product.images?.[selectedImg] || product.images?.[0];
                  if (currentMedia?.endsWith('.mp4')) {
                    return (
                      <video
                        src={currentMedia}
                        className="pdp-hero-img"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    );
                  }
                  return (
                    <img
                      src={currentMedia}
                      alt={product.name}
                      className="pdp-hero-img"
                    />
                  );
                })()}
                
                <div className="pdp-img-controls">
                  <button className="img-ctrl-btn"><img src="/icons/similar.svg" alt="" style={{width: 14, display:'none'}}/><Maximize size={14}/> Similar Product</button>
                  <button className="img-ctrl-btn"><Maximize size={14}/> Zoom</button>
                  
                  <div style={{flexGrow: 1}}></div>
                  <button className="img-action-btn"><Heart size={16}/></button>
                  <button className="img-action-btn"><Share2 size={16}/></button>
                </div>
              </div>
            </div>

            <div className="pdp-info-cards">
              <div className="info-card-pill">
                <div className="info-card-icon"><Shield size={20} color="#5c38c9"/></div>
                <div className="info-card-text">
                  <strong>Try for 100 Days</strong>
                  <span>Not satisfied? Get your money back</span>
                </div>
              </div>
              <div className="info-card-pill">
                <div className="info-card-icon"><Truck size={20} color="#5c38c9"/></div>
                <div className="info-card-text">
                  <strong>Free Shipping</strong>
                </div>
              </div>
              <div className="info-card-pill">
                <div className="info-card-icon"><Award size={20} color="#5c38c9"/></div>
                <div className="info-card-text">
                  <strong>10 years manufacturer warranty</strong>
                </div>
              </div>
              <div className="info-card-pill">
                <div className="info-card-icon"><Search size={20} color="#5c38c9"/></div>
                <div className="info-card-text">
                  <strong>Need a Size not Shown?</strong>
                  <span>Order with custom options</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Details & Purchase ───────────────────────── */}
          <div className="pdp-right-col">
            <h1 className="pdp-new-title">{product.name} | 10 Years Warranty</h1>
            
            <div className="pdp-new-rating-row">
              <div className="rating-badge-green">
                {product.rating} <Star size={12} fill="currentColor"/> | {product.reviewCount || '4.56L'}
              </div>
              <div className="cart-added-stats">
                <ShoppingCart size={14}/> <strong>21,100+</strong> added to the cart past week
              </div>
            </div>

            {/* Choose Series */}
            <div className="choose-series-block">
              <div className="series-header">
                <h3>Choose Series</h3>
                <button className="compare-series-btn"><Maximize size={14}/> Compare Series</button>
              </div>
              <div className="series-list">
                {seriesData.map(series => (
                  <label key={series.id} className={`series-card ${selectedSeries === series.id ? 'active' : ''} ${series.disabled ? 'disabled' : ''}`}>
                    <div className="series-radio">
                      <input 
                        type="radio" 
                        name="series" 
                        checked={selectedSeries === series.id} 
                        onChange={() => !series.disabled && setSelectedSeries(series.id)}
                        disabled={series.disabled}
                      />
                    </div>
                    <div className="series-content">
                      <div className="series-top">
                        <div className="series-name-group">
                          <span className="s-name">{series.name}</span>
                          {series.tag && <span className={`s-tag s-tag-${series.tagColor}`}>{series.tag}</span>}
                        </div>
                        {!series.disabled && (
                          <div className="series-pricing">
                            <span className="s-mrp">MRP ₹{series.mrp.toLocaleString()}</span>
                            <span className="s-discount">(36% Off)</span>
                            <span className="s-price">₹{series.price.toLocaleString()}</span>
                          </div>
                        )}
                        {series.disabled && <div className="s-disabled-line">-</div>}
                      </div>
                      <div className="series-bottom">
                        <span className="s-desc">{series.desc}</span>
                        {!series.disabled && (
                          <span className="s-bank">With bank offer <strong>₹{series.bank.toLocaleString()}</strong></span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="tax-inclusive">Price inclusive of all taxes</div>
            </div>

            {/* Choose Size */}
            <div className="choose-size-block">
              <div className="size-header">
                <h3>Choose Size</h3>
                <span className="size-options-badge">116 options</span>
              </div>
              <div className="size-actions">
                <button className="size-dropdown-btn" onClick={() => setShowVariantModal(true)}>
                  {selectedSize} <ChevronDown size={16}/>
                </button>
                <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                  <ShoppingCart size={18}/> Add To Cart
                </button>
              </div>
              <p className="size-warning"><Award size={14}/> Confirm {selectedSize} size fits your bed before purchasing</p>
            </div>

            <hr className="pdp-divider"/>

            {/* Delivery Info */}
            <div className="delivery-info-row">
              <Truck size={18}/> <span>Get it by <strong>Tomorrow</strong></span>
              <div className="pincode-editor">
                <MapPin size={16}/> <strong>{pincode}</strong> 
                <button onClick={() => setIsEditingPincode(true)}><Maximize size={12} style={{transform: 'rotate(45deg)'}}/></button>
              </div>
            </div>

            <hr className="pdp-divider"/>

            {/* Offers */}
            <div className="offers-section-wrapper">
              <div className="offers-timer">● HOME sale ends on 27th Aug</div>
              <div className="offers-scroll">
                {offers.map((offer, i) => (
                  <div key={i} className="offer-card-small">
                    <div className="offer-type">{offer.type}</div>
                    <div className="offer-price">{offer.price}<span className="offer-suffix">{offer.suffix}</span></div>
                    <div className="offer-icons-row">
                      <div className="bank-icon-ph" style={{background: '#e11d48'}}></div>
                      <div className="bank-icon-ph" style={{background: '#2563eb'}}></div>
                      {offer.tag && <span className="offer-emi-tag"><CheckCircle2 size={10}/> {offer.tag}</span>}
                    </div>
                  </div>
                ))}
                <button className="offers-next-btn"><ChevronRight size={16}/></button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Perks Banner */}
      <div className="perks-section">
        <div className="container">
          <div className="perks-header">
            <span className="sparkle">✦</span>
            <h2><span style={{color: '#5c38c9', fontWeight: 800}}>Exclusive</span> purchase perks only at <span style={{color: '#5c38c9', fontWeight: 800}}>Sleep Nest</span></h2>
            <span className="sparkle">✦</span>
          </div>
          
          <div className="perks-grid">
            <div className="perks-video">
              <img src="https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=800&q=80" alt="Factory" />
              <div className="perks-video-overlay">
                <h3>Inside India's<br/><strong>Largest Furniture Factory</strong></h3>
                <button className="watch-now-btn">WATCH NOW <PlayCircle size={20}/></button>
              </div>
            </div>
            
            <div className="perks-table-wrapper">
              <table className="perks-table">
                <thead>
                  <tr>
                    <th>Benefits</th>
                    <th className="highlight-col">Sleep Nest & Stores</th>
                    <th>Other Platforms</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>100 Days Free Trial <ChevronDown size={12}/></td>
                    <td className="highlight-col"><CheckCircle2 size={18} color="#5c38c9"/></td>
                    <td><XCircle size={18} color="#ef4444"/></td>
                  </tr>
                  <tr>
                    <td>Upto 2% Assured Cashback <ChevronDown size={12}/></td>
                    <td className="highlight-col"><CheckCircle2 size={18} color="#5c38c9"/></td>
                    <td><XCircle size={18} color="#ef4444"/></td>
                  </tr>
                  <tr>
                    <td>Free Next Day Delivery <ChevronDown size={12}/></td>
                    <td className="highlight-col"><CheckCircle2 size={18} color="#5c38c9"/></td>
                    <td><CheckCircle2 size={18} color="#5c38c9"/></td>
                  </tr>
                  <tr>
                    <td>Exclusive Card & Payment Offers <ChevronDown size={12}/></td>
                    <td className="highlight-col"><CheckCircle2 size={18} color="#5c38c9"/></td>
                    <td><XCircle size={18} color="#ef4444"/></td>
                  </tr>
                  <tr>
                    <td>Custom Sizes, Perfect Fit <ChevronDown size={12}/></td>
                    <td className="highlight-col"><CheckCircle2 size={18} color="#5c38c9"/></td>
                    <td><XCircle size={18} color="#ef4444"/></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── MATTRESS LAYERS SECTION ──────────────────────────────── */}
      <div className="pdp-mattress-layers-section">
        <div className="container">


<div className="layers-bottom-grid">
            <div className="layers-info-box">
              <div className="layers-badge">Pocket Spring Mattress</div>
              <h3>Zero Partner Disturbance For Deeper, Undisrupted Sleep</h3>
              <p>Ever wake up tired even after a full night's sleep? That often happens when your partner's movements keep disturbing your rest. The Pocket Spring Mattress features individually wrapped springs that move independently — so your sleep stays yours, no matter how much your partner tosses and turns.</p>
              <ul className="layers-benefits-list">
                <li>🛏️ Supports Natural Spinal Alignment</li>
                <li>🌬️ Breathable Open-Spring Structure for Cooler Sleep</li>
              </ul>
            </div>
            <div className="layers-lifestyle-img">
              <img src="/images/generated/mattress_sleeping_cross_section.jpg" alt="Zero Disturbance Sleep" />
            </div>
          </div>
        </div>
      </div>

      {/* ── PDP TABS & PROMO BANNER ──────────────────────────────── */}
      <div className="pdp-tabs-section">
        <div className="container">
          <div className="pdp-tabs-row">
            <button className="pdp-tab active">Product Detail</button>
            <button className="pdp-tab">Specifications</button>
            <button className="pdp-tab">Dimensions</button>
          </div>
          
          <div className="pdp-promo-banner">
            <div className="promo-banner-text">
              <h4>Buy 2 Mattresses Get 1 Pillow Free</h4>
              <p>Add 3 products in cart for the offer to apply</p>
            </div>
            <button className="promo-shop-btn">Shop Now</button>
          </div>
        </div>
      </div>

      {/* Product Detail Dark Section */}
      <div className="dark-specs-section">
        <div className="container">
          <h2 className="dark-sec-title">Product Detail</h2>
          <hr className="dark-sec-divider"/>
          
          <div className="ds-grid">
            <div className="ds-col">
              <h4>Specifications</h4>
              <div className="ds-item">
                <div className="ds-icon-ph"></div>
                <div className="ds-text">
                  <h5>Mattress Feel</h5>
                  <p>Medium Firm</p>
                </div>
              </div>
              <div className="ds-item">
                <div className="ds-icon-ph"></div>
                <div className="ds-text">
                  <h5>Mattress Material</h5>
                  <p>ShapeSense™ Orthopedic Memory Foam</p>
                </div>
              </div>
            </div>
            <div className="ds-col">
              <h4>Product Dimensions</h4>
              <div className="ds-item">
                <div className="ds-icon-ph"></div>
                <div className="ds-text">
                  <h5>Cover Material</h5>
                  <p>Premium Knitted Fabric</p>
                </div>
              </div>
              <div className="ds-item">
                <div className="ds-icon-ph"></div>
                <div className="ds-text">
                  <h5>Mattress Usability</h5>
                  <p>Usable on single side</p>
                </div>
              </div>
            </div>
            <div className="ds-col">
              <h4>Product Policies</h4>
              <div className="ds-item">
                <div className="ds-icon-ph"></div>
                <div className="ds-text">
                  <h5>Cover Type</h5>
                  <p>Removable zipper cover</p>
                </div>
              </div>
              <div className="ds-item">
                <div className="ds-icon-ph"></div>
                <div className="ds-text">
                  <h5>Dimensions</h5>
                  <p>72" x 36" x 5"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Find My Mattress Banner */}
      <div className="find-mattress-banner">
        <div className="container">
          <div className="fmb-inner">
            <img src="/icons/woman-bed.svg" alt="" style={{height: 60, display:'none'}}/>
            <button className="fmb-btn">Find my Mattress <ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section-new">
        <div className="container">
          <h2 className="rs-title">Reviews</h2>
          
          <div className="rs-overall">
            <div className="rs-rating-badge">4.5 <Star size={16} fill="#fff"/></div>
            <div className="rs-rating-text">
              <strong>488,714 Ratings</strong>
              <p>Overall overall rating across all platforms.</p>
            </div>
          </div>

          <div className="rs-customer-images">
            <h4>Images / Videos posted by Customers</h4>
            <div className="rs-img-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rs-cust-img">
                  <img src={`https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=150&q=80&sig=${i}`} alt="Customer photo" />
                  {i === 6 && <div className="rs-img-overlay">+999</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="rs-text-reviews">
            {[
              { r: 5, t: 'Month 8', d: 'Very smooth and soft.', user: 'Sirisha | 8 months ago' },
              { r: 4.5, t: 'Review After 5 years', d: 'We used this mattress for 5 regular years. It is one of the best choices we made.', user: 'Meera | 2 months ago' },
              { r: 5, t: 'Value for money', d: 'Awesome product with value for money.', user: 'Anand | 1 month ago' },
            ].map((rev, i) => (
              <div key={i} className="rs-review-item">
                <div className="rs-rev-badge">{rev.r} <Star size={10} fill="#fff"/></div>
                <h5 className="rs-rev-title">{rev.t}</h5>
                <p className="rs-rev-desc">{rev.d}</p>
                <div className="rs-rev-user"><CheckCircle2 size={12} color="#16a34a"/> {rev.user}</div>
                <hr/>
              </div>
            ))}
            
            <div className="rs-view-all">
              <button className="btn-outline-purple">View All Reviews</button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section-new">
        <div className="container">
          <h2 className="ts-title">Customer Testimonials</h2>
          
          <div className="ts-grid">
            <div className="ts-main-video">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" alt="Testimonial" />
              <div className="ts-vid-overlay">
                <PlayCircle size={48} color="#fff"/>
                <div className="ts-vid-info">
                  <h4>Ajay</h4>
                  <p>IT Professional</p>
                </div>
              </div>
            </div>
            
            <div className="ts-side-videos">
              <div className="ts-side-vid">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" alt="Testimonial 2" />
                <div className="ts-vid-overlay-small"><PlayCircle size={32} color="#fff"/></div>
              </div>
              <div className="ts-side-vid">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" alt="Testimonial 3" />
                <div className="ts-vid-overlay-small"><PlayCircle size={32} color="#fff"/></div>
              </div>
            </div>
          </div>
          
          <div className="ts-text-quote">
            <h4>Ajay | IT Professional</h4>
            <p>"Mine is a rural place. Every parcel takes a long time to deliver. But in Sleep Nest's case, it was delivered in only a few days."</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="faq-section-new">
        <div className="container">
          <h2 className="faq-title">FAQ's</h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <ChevronDown size={16} style={{transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: '0.3s', color: '#5c38c9'}}/>
                  <span>{faq.q}</span>
                </button>
                {openFaq === i && <div className="faq-a"><p>{faq.a}</p></div>}
              </div>
            ))}
          </div>
          <div className="faq-view-all">
            <button className="btn-outline-purple">View All FAQ's</button>
          </div>
        </div>
      </div>
      
      {/* VARIANT OVERLAY MODAL */}
      {showVariantModal && (
        <div className="variant-modal-overlay" onClick={() => setShowVariantModal(false)}>
          <div className="variant-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vm-header">
              <h2>Choose a Variant</h2>
              <button className="vm-close-btn" onClick={() => setShowVariantModal(false)}>
                <X size={16} />
              </button>
            </div>
            
            <div className="vm-content">
              <div className="vm-product-preview">
                <img src={product.images.find(img => !img.endsWith('.mp4')) || product.images[0]} alt="" />
                <span>Sleep Nest ShapeSense Orthopedic Classic Memory Foam Mattress | 10 Years Warranty</span>
              </div>
              
              <div className="vm-video-banner">
                <span>🎯 <a href="#" style={{textDecoration: 'underline'}}>40 seconds of video will save you from ordering a wrong size</a></span>
              </div>
              
              <div className="vm-section">
                <h4>Size Group</h4>
                <div className="vm-pill-grid vm-grid-5">
                  {['Single', 'Diwan', 'Queen', 'King', 'Custom'].map(sg => (
                    <button key={sg} className={`vm-pill ${tempSizeGroup === sg ? 'active' : ''}`} onClick={() => setTempSizeGroup(sg)}>
                      {sg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="vm-section">
                <h4>Dimension</h4>
                <div className="vm-pill-grid vm-grid-4">
                  {['72x30 Inch', '72x35 Inch', '72x36 Inch', '72x42 Inch', '75x30 Inch', '75x35 Inch', '75x36 Inch', '75x42 Inch', '78x30 Inch', '78x35 Inch', '78x36 Inch', '78x42 Inch'].map(dim => (
                    <button key={dim} className={`vm-pill ${tempDimension === dim ? 'active' : ''}`} onClick={() => setTempDimension(dim)}>
                      {dim}
                    </button>
                  ))}
                </div>
              </div>

              <div className="vm-section">
                <h4>Thickness</h4>
                <div className="vm-pill-grid vm-grid-4">
                  {['5', '6', '8', '10'].map(th => (
                    <button key={th} className={`vm-pill ${tempThickness === th ? 'active' : ''}`} onClick={() => setTempThickness(th)}>
                      {th}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="vm-helper">
                <div className="vm-helper-icon">👍</div>
                <div className="vm-helper-text">
                  <strong>({tempThickness} inch Thickness)</strong><br/>
                  Best if the sleepers weighs between than 50 kg - 55 kg
                </div>
              </div>
              
              <button 
                className="vm-confirm-btn" 
                onClick={() => {
                  setSelectedSize(`${tempDimension} (${tempSizeGroup})`);
                  setShowVariantModal(false);
                }}
              >
                Confirm Variant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FBT DRAWER OVERLAY */}
      {showFbtDrawer && (
        <div className="fbt-drawer-overlay" onClick={() => setShowFbtDrawer(false)}>
          <div className="fbt-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="fbt-header">
              <div className="fbt-header-title">
                <h2>Frequently Bought Together</h2>
                <button className="fbt-close-btn" onClick={() => setShowFbtDrawer(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="fbt-note">
                <strong>Note:</strong> <span className="fbt-note-pill">Product size below match your mattress size</span>
              </div>
            </div>
            
            <div className="fbt-content">
              {/* Card 1: Protector */}
              <div className="fbt-card">
                <div className="fbt-card-title">Protector</div>
                <div className="fbt-card-body">
                  <div className="fbt-img-col">
                    <img src="/images/generated/fbt_protector.jpg" alt="Protector" />
                  </div>
                  <div className="fbt-details-col">
                    <div className="fbt-choice-title">Choose Color</div>
                    
                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div className="fbt-swatch" style={{background: '#cba87c'}}></div>
                        <div>
                          <div className="fbt-opt-name">Beige</div>
                          <div className="fbt-opt-price"><strong>₹553</strong> <del>₹852</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>

                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div className="fbt-swatch" style={{background: '#111827'}}></div>
                        <div>
                          <div className="fbt-opt-name">Blue</div>
                          <div className="fbt-opt-price"><strong>₹554</strong> <del>₹852</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>

                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div className="fbt-swatch" style={{background: '#6b7280'}}></div>
                        <div>
                          <div className="fbt-opt-name">Grey</div>
                          <div className="fbt-opt-price"><strong>₹737</strong> <del>₹1,088</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>

                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div className="fbt-swatch" style={{background: '#a78bfa'}}></div>
                        <div>
                          <div className="fbt-opt-name">Lavendar</div>
                          <div className="fbt-opt-price"><strong>₹872</strong> <del>₹1,228</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>
                  </div>
                </div>
                <div className="fbt-footer-pill">73% of mattress buyers also bought protectors</div>
              </div>

              {/* Card 2: Pillow */}
              <div className="fbt-card">
                <div className="fbt-card-title">Sleeping Pillow</div>
                <div className="fbt-card-body">
                  <div className="fbt-img-col">
                    <img src="/images/generated/category_pillow.jpg" alt="Pillow" />
                  </div>
                  <div className="fbt-details-col">
                    <div className="fbt-choice-title">Choose Variant</div>
                    
                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div>
                          <div className="fbt-opt-name">Single</div>
                          <div className="fbt-opt-price"><strong>₹468</strong> <del>₹542</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>

                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div>
                          <div className="fbt-opt-name">Set Of 2</div>
                          <div className="fbt-opt-price"><strong>₹846</strong> <del>₹1,141</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>

                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div>
                          <div className="fbt-opt-name">Set Of 4</div>
                          <div className="fbt-opt-price"><strong>₹1,528</strong> <del>₹2,141</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 3: Dohar */}
              <div className="fbt-card">
                <div className="fbt-card-title">Dohar</div>
                <div className="fbt-card-body">
                  <div className="fbt-img-col">
                    <img src="/images/generated/fbt_dohar.jpg" alt="Dohar" />
                  </div>
                  <div className="fbt-details-col">
                    <div className="fbt-choice-title">Choose Color</div>
                    
                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div className="fbt-swatch" style={{background: '#fbcfe8'}}></div>
                        <div>
                          <div className="fbt-opt-name">Mika Lilac</div>
                          <div className="fbt-opt-price"><strong>₹1,514</strong> <del>₹1,860</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>

                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div className="fbt-swatch" style={{background: '#fed7aa'}}></div>
                        <div>
                          <div className="fbt-opt-name">Mika Orange</div>
                          <div className="fbt-opt-price"><strong>₹1,628</strong> <del>₹1,999</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 4: Comforter */}
              <div className="fbt-card">
                <div className="fbt-card-title">Comforter</div>
                <div className="fbt-card-body">
                  <div className="fbt-img-col">
                    <img src="/images/generated/fbt_comforter.jpg" alt="Comforter" />
                  </div>
                  <div className="fbt-details-col">
                    <div className="fbt-choice-title">Choose Color</div>
                    
                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div className="fbt-swatch" style={{background: '#374151'}}></div>
                        <div>
                          <div className="fbt-opt-name">Black Beauty & Night Owl</div>
                          <div className="fbt-opt-price"><strong>₹1,850</strong> <del>₹2,104</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>

                    <label className="fbt-option">
                      <div className="fbt-option-info">
                        <div className="fbt-swatch" style={{background: '#57534e'}}></div>
                        <div>
                          <div className="fbt-opt-name">Brown Stone & Night Owl</div>
                          <div className="fbt-opt-price"><strong>₹1,850</strong> <del>₹2,104</del></div>
                        </div>
                      </div>
                      <div className="fbt-radio-circle"></div>
                    </label>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="fbt-footer">
              <div className="fbt-total">
                <strong>₹6,537</strong> <span>1 Item <span className="info-i">i</span></span>
              </div>
              <button className="fbt-proceed-btn" onClick={() => navigate('/cart')}>
                <ShoppingCart size={16}/> Proceed to Buy
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ── MOBILE STICKY BOTTOM BAR ── */}
      <div className="pdp-mobile-sticky-bar mobile-only">
        <div className="sticky-bar-price">
          <span className="sb-price">₹{product.price.toLocaleString()}</span>
          <span className="sb-mrp">₹{(product.originalPrice || Math.round(product.price * 1.6)).toLocaleString()}</span>
        </div>
        <button className="btn-add-to-cart" onClick={handleAddToCart}>
          <ShoppingCart size={18}/> Add to Cart
        </button>
      </div>

    </div>
  );
}

