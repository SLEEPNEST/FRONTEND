import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Play, Shield, Truck, Award, Leaf, Smile, Wrench, ShieldCheck, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import NewArrivalsSection from '../components/NewArrivalsSection';
import { testimonials, categories } from '../data/products';
import { useApp, useCatalog } from '../context/AppContext';
import { api } from '../services/api';
import iciciLogo from '../assets/ICICI Bank Logo - India.jpg';
import axisLogo from '../assets/Axis Bank Logo.jpg';
import sbiLogo from '../assets/State Bank of India (SBI).jpg';
import hdfcLogo from '../assets/HDFC Bank.jpg';
import chennaiImg from '../assets/chennai.png';
import delhiImg from '../assets/delhi.png';
import kolkataImg from '../assets/kolkata.png';
import mumbaiImg from '../assets/mumbai.png';
import bannerWoodBedImg from '../assets/banner_wood_bed.jpg';
import bannerPillowImg from '../assets/banner_pillow.jpg';
import bannerBedsheetImg from '../assets/banner_bedsheet.jpg';
import './HomePage.css';

import DetailedProductCard from '../components/DetailedProductCard';
import CategoryProductCard from '../components/CategoryProductCard';

const heroSlides = [
  {
    id: 1,
    headline: 'Luxury That Welcomes You Home',
    subhead: 'Premium Wooden Beds Crafted for Comfort & Style',
    highlights: ['Solid & Elegant Designs', 'Premium Wood Finish', 'Built for Long-Lasting Comfort'],
    offer: 'UP TO 25% OFF',
    cta: 'SHOP WOODEN BEDS →',
    ctaPath: '/beds',
    smallText: 'Transform your bedroom into a space you\'ll love.',
    image: bannerWoodBedImg,
  },
  {
    id: 2,
    headline: 'Wake Up Better. Sleep Deeper.',
    subhead: 'Discover Premium Mattresses Designed for Restful Sleep',
    highlights: ['Superior Comfort', 'Body Support', 'Breathable Materials', 'Long-Lasting Quality'],
    offer: 'SLEEP BETTER • SAVE MORE',
    cta: 'EXPLORE MATTRESSES →',
    ctaPath: '/mattress',
    smallText: 'Your perfect night\'s sleep starts here.',
    image: bannerPillowImg,
  },
  {
    id: 3,
    headline: 'Create Your Perfect Sleep Space',
    subhead: 'Everything You Need for a Beautiful & Comfortable Bedroom',
    categories: ['Beds', 'Mattresses', 'Bedsheets', 'Pillows', 'Comforters'],
    offer: 'UP TO 30% OFF',
    cta: 'SHOP THE COLLECTION →',
    ctaPath: '/furniture',
    smallText: 'Premium comfort. Timeless style. Everyday happiness.',
    image: bannerBedsheetImg,
    badge: 'NEW ARRIVALS\nJUST FOR YOU!',
  },
];

// ─── Category Banners ─────────────────────────────────────────────────────────
const categoryBanners = [
  {
    title: 'Mattress',
    path: '/mattress',
    image: '/images/generated/sleepnest_mattress_card.jpg',
  },
  {
    title: 'Bedsheet',
    path: '/bedsheet',
    image: '/images/generated/sleepnest_bedsheet.jpg',
  },
  {
    title: 'Protector',
    path: '/protector',
    image: '/images/generated/sleepnest_mattress_protector.jpg',
  },
  {
    title: 'Comforter',
    path: '/comforter',
    image: '/images/generated/sleepnest_comforter.jpg',
  },
  {
    title: 'Pillow',
    path: '/pillow',
    image: '/images/generated/sleepnest_pillow.jpg',
  },
];

// ─── Store Locations Data & SVG Monument Renderer ───────────────────────────
const storeLocations = [
  { city: 'Bangalore', count: '18 STORES', icon: 'karnataka' },
  { city: 'Chennai', count: '12 STORES', image: chennaiImg },
  { city: 'Delhi', count: '15 STORES', image: delhiImg },
  { city: 'Hyderabad', count: '10 STORES', icon: 'charminar' },
  { city: 'Kolkata', count: '6 STORES', image: kolkataImg },
  { city: 'Mumbai', count: '14 STORES', image: mumbaiImg },
];

const MonumentIcon = ({ type }) => {
  const baseCircle = (
    <>
      {/* Soft lavender background disk matching attached image */}
      <circle cx="30" cy="30" r="26" fill="#EDE9FE" />
      {/* Floating confetti dots matching attached screenshot */}
      <circle cx="51" cy="9" r="3.5" fill="#FFCA28" />
      <circle cx="46" cy="4" r="1.5" fill="#FFCA28" />
      <circle cx="7" cy="16" r="2.5" fill="#FF3366" />
      <circle cx="9" cy="48" r="3.5" fill="#FFCA28" />
      <circle cx="13" cy="52" r="1.8" fill="#FF3366" />
      <circle cx="50" cy="46" r="2.5" fill="#FFCA28" />
      <circle cx="14" cy="40" r="2.5" fill="#FFFFFF" />
    </>
  );

  if (type === 'charminar') {
    // Telangana / Hyderabad: Charminar
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        {baseCircle}
        <rect x="16" y="14" width="5" height="28" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <rect x="39" y="14" width="5" height="28" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <path d="M16 14L18.5 9L21 14H16Z" fill="#4A3728" />
        <path d="M39 14L41.5 9L44 14H39Z" fill="#4A3728" />
        <rect x="21" y="22" width="18" height="20" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <path d="M25 42V33C25 31.3 26.3 30 28 30H32C33.7 30 35 31.3 35 33V42H25Z" fill="#4A3728" />
        <line x1="21" y1="26" x2="39" y2="26" stroke="#4A3728" strokeWidth="1" />
      </svg>
    );
  }

  if (type === 'gopuram') {
    // Tamil Nadu / Chennai / Ahmedabad: Gopuram / Temple Tower
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        {baseCircle}
        <path d="M21 42H39L37 33H23L21 42Z" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <path d="M23 33H37L25 25H25L23 33Z" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <path d="M25 25H35L33 17H27L25 25Z" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <path d="M27 17H33L30 11L27 17Z" fill="#4A3728" />
        <circle cx="30" cy="9" r="1.5" fill="#FFCA28" />
        <path d="M27 42V37C27 35.3 28.3 34 30 34C31.7 34 33 35.3 33 37V42H27Z" fill="#4A3728" />
      </svg>
    );
  }

  if (type === 'karnataka') {
    // Karnataka / Bangalore: Vidhana Soudha Palace (Matches user attached image 100%)
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        {baseCircle}
        <rect x="14" y="27" width="32" height="15" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <line x1="14" y1="42" x2="46" y2="42" stroke="#4A3728" strokeWidth="1.5" />
        <line x1="19" y1="29" x2="19" y2="39" stroke="#4A3728" strokeWidth="1" />
        <line x1="24" y1="29" x2="24" y2="39" stroke="#4A3728" strokeWidth="1" />
        <line x1="36" y1="29" x2="36" y2="39" stroke="#4A3728" strokeWidth="1" />
        <line x1="41" y1="29" x2="41" y2="39" stroke="#4A3728" strokeWidth="1" />
        <path d="M27 42V32C27 30.3 28.3 29 30 29C31.7 29 33 30.3 33 32V42H27Z" fill="#4A3728" />
        <path d="M23 27C23 23.1 26.1 20 30 20C33.9 20 37 23.1 37 27H23Z" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <line x1="24" y1="24" x2="36" y2="24" stroke="#4A3728" strokeWidth="0.8" />
        <line x1="30" y1="20" x2="30" y2="16" stroke="#4A3728" strokeWidth="1.3" />
        <rect x="15" y="20" width="4" height="7" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.2" />
        <path d="M15 20C15 18 17 17 17 17C17 17 19 18 19 20H15Z" fill="#4A3728" />
        <rect x="41" y="20" width="4" height="7" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.2" />
        <path d="M41 20C41 18 43 17 43 17C43 17 45 18 45 20H41Z" fill="#4A3728" />
      </svg>
    );
  }

  if (type === 'indiagate') {
    // Delhi: India Gate Arch
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        {baseCircle}
        <rect x="18" y="17" width="24" height="25" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <rect x="16" y="14" width="28" height="4" fill="#4A3728" />
        <path d="M24 42V31C24 27.7 26.7 25 30 25C33.3 25 36 27.7 36 31V42H24Z" fill="#4A3728" />
        <line x1="20" y1="21" x2="40" y2="21" stroke="#4A3728" strokeWidth="1" />
      </svg>
    );
  }

  if (type === 'gateway') {
    // Maharashtra / Mumbai: Gateway of India
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        {baseCircle}
        <rect x="15" y="21" width="30" height="21" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <rect x="15" y="15" width="5" height="27" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <rect x="40" y="15" width="5" height="27" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <path d="M15 15L17.5 11L20 15H15Z" fill="#4A3728" />
        <path d="M40 15L42.5 11L45 15H40Z" fill="#4A3728" />
        <path d="M23 42V29C23 25.1 26.1 22 30 22C33.9 22 37 25.1 37 29V42H23Z" fill="#4A3728" />
      </svg>
    );
  }

  if (type === 'tajmahal') {
    // UP / Agra: Taj Mahal
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        {baseCircle}
        <rect x="13" y="18" width="3" height="24" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1" />
        <rect x="44" y="18" width="3" height="24" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1" />
        <path d="M13 18L14.5 14L16 18H13Z" fill="#4A3728" />
        <path d="M44 18L45.5 14L47 18H44Z" fill="#4A3728" />
        <rect x="18" y="26" width="24" height="16" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <path d="M23 26C23 20 27 16 30 16C33 16 37 20 37 26H23Z" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
        <line x1="30" y1="16" x2="30" y2="12" stroke="#4A3728" strokeWidth="1.3" />
        <path d="M26 42V35C26 32.8 27.8 31 30 31C32.2 31 34 32.8 34 35V42H26Z" fill="#4A3728" />
      </svg>
    );
  }

  // Fallback: Default Palace / Fort
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      {baseCircle}
      <rect x="18" y="24" width="24" height="18" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
      <path d="M18 24L30 16L42 24H18Z" fill="#F5F7FA" stroke="#4A3728" strokeWidth="1.3" />
      <circle cx="30" cy="20" r="2.5" fill="#4A3728" />
      <path d="M26 42V33C26 31.3 27.8 30 30 30C32.2 30 34 31.3 34 33V42H26Z" fill="#4A3728" />
    </svg>
  );
};

// ─── Bank Offers Data ────────────────────────────────────────────────────────
const bankOfferTabs = ['Cards', 'EMI', 'UPI', 'Cashback'];

const bankOffersList = [
  { id: 1, bank: 'HDFC Bank', discount: '11% Off', logo: hdfcLogo, tag: 'Cards' },
  { id: 2, bank: 'Axis Bank', discount: '7% Off', logo: axisLogo, tag: 'Cards' },
  { id: 3, bank: 'ICICI Bank', discount: '7% Off', logo: iciciLogo, tag: 'Cards' },
  { id: 4, bank: 'Axis Bank', discount: '1% Off', logo: axisLogo, tag: 'Cards' },
  { id: 5, bank: 'ICICI Bank', discount: '1% Off', logo: iciciLogo, tag: 'Cards' },
  { id: 7, bank: 'State Bank of India', discount: '1% Off', logo: sbiLogo, tag: 'Cards' },
];

// ─── Trust Strip ──────────────────────────────────────────────────────────────
const trustItems = [
  { Icon: Shield, title: '100-Night Trial', sub: 'Sleep on it. Love it or return.' },
  { Icon: Award, title: '10 Year Warranty', sub: 'Quality guaranteed long-term.' },
  { Icon: Truck, title: 'Free Delivery', sub: 'Free all-India shipping.' },
  { Icon: Leaf, title: 'Eco-Friendly', sub: 'Sustainable certified materials.' },
];

export default function HomePage() {
  const { showToast } = useApp();
  const { mattresses, protectors } = useCatalog();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribing(true);
    try {
      const res = await api.newsletter.subscribe(email);
      showToast(res.message, 'success');
      setNewsletterEmail('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubscribing(false);
    }
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [activeBankTab, setActiveBankTab] = useState('Cards');
  const intervalRef = useRef(null);
  const storesScrollRef = useRef(null);
  const mattressesScrollRef = useRef(null);

  const scrollStoresRight = () => {
    if (storesScrollRef.current) {
      storesScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const scrollMattressesLeft = () => {
    if (mattressesScrollRef.current) {
      mattressesScrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollMattressesRight = () => {
    if (mattressesScrollRef.current) {
      mattressesScrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // Live Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ days: 6, hrs: 11, mins: 58, secs: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hrs > 0) return { ...prev, hrs: prev.hrs - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hrs: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero Autoplay
  useEffect(() => {
    if (isAutoplay) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((p) => (p + 1) % heroSlides.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoplay, currentSlide]);

  const prevSlide = () => {
    setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoplay(false);
  };
  const nextSlide = () => {
    setCurrentSlide((p) => (p + 1) % heroSlides.length);
    setIsAutoplay(false);
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="home-page">

      {/* ── HERO CAROUSEL ───────────────────────────────────────── */}
      <section className="hero-carousel-section">
        <div className="carousel-track-container">
          <div 
            className="carousel-track" 
            style={{ 
              transform: `translateX(calc(-${currentSlide} * 100%))`
            }}
          >
            {heroSlides.map((s, idx) => (
              <div 
                key={s.id} 
                className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => { setCurrentSlide(idx); setIsAutoplay(false); }}
              >
                <img src={s.image} alt={s.headline} loading={idx === 0 ? "eager" : "lazy"} className="carousel-banner-img" />
                <div className="carousel-overlay">
                  <div className="carousel-content">
                    <h2 className="carousel-headline">{s.headline}</h2>
                    <p className="carousel-subhead">{s.subhead}</p>
                    
                    {s.highlights && (
                      <ul className="carousel-highlights">
                        {s.highlights.map(h => <li key={h}>✓ {h}</li>)}
                      </ul>
                    )}
                    {s.categories && (
                      <div className="carousel-categories">
                        <strong>{s.categories.join(' • ')}</strong>
                      </div>
                    )}
                    
                    <div className="carousel-offer">{s.offer}</div>
                    
                    <Link to={s.ctaPath} className="btn btn-gold carousel-cta">{s.cta}</Link>
                    
                    <p className="carousel-small-text">*{s.smallText}</p>
                  </div>
                  {s.badge && (
                    <div className="carousel-badge">
                      {s.badge.split('\n').map((line, i) => <span key={i}>{line}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <button className="hero-arrow hero-prev" onClick={prevSlide} aria-label="Previous">
          <ChevronLeft size={24} />
        </button>
        <button className="hero-arrow hero-next" onClick={nextSlide} aria-label="Next">
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => { setCurrentSlide(i); setIsAutoplay(false); }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>


      {/* ── SHOP BY CATEGORIES SECTION ──────────────────────────── */}
      <section className="shop-categories-section">
        <div className="container">
          <div className="shop-categories-header">
            <h2 className="shop-categories-title">Shop By Categories</h2>
            <div className="purple-accent-bar" />
          </div>
          <div className="shop-categories-grid">
            {categoryBanners.map((cat) => (
              <Link key={cat.title} to={cat.path} className="cat-card-item">
                <div className="cat-card-img-box">
                  <img src={cat.image} alt={cat.title} loading="lazy" />
                </div>
                <h3 className="cat-card-label">{cat.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SLEEPNEST STORES (LOCATION CATEGORY) ──────────────── */}
      <section className="stores-section">
        <div className="container">
          <div className="stores-header-flex">
            <div className="stores-title-group">
              <h2 className="stores-title">SleepNest Stores</h2>
              <div className="purple-accent-bar" />
            </div>
          </div>

          <div className="stores-carousel-container">
            <div className="stores-scroll-row" ref={storesScrollRef}>
              {storeLocations.map((loc, idx) => (
                <div key={idx} className="store-city-card">
                  <div className="store-card-icon">
                    {loc.image ? (
                      <img src={loc.image} alt={loc.city} className="store-city-img" />
                    ) : (
                      <MonumentIcon type={loc.icon} />
                    )}
                  </div>
                  <h3 className="store-card-name">{loc.city}</h3>
                  <span className="store-card-count">{loc.count}</span>
                </div>
              ))}
            </div>
            <button className="stores-arrow-next" onClick={scrollStoresRight} aria-label="Next stores">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
      {/* ── NEW ARRIVALS SECTION ────────────────────────────── */}
      <NewArrivalsSection />
      {/* ── BESTSELLING MATTRESSES ──────────────────────────────── */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title">Bestselling Mattresses</h2>
              <div className="divider" />
              <p className="section-subtitle">Loved by 5 lakh+ happy customers</p>
            </div>
            <Link to="/mattress" className="btn btn-outline">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="dpc-carousel-wrapper">
            <button className="dpc-nav-btn left" onClick={scrollMattressesLeft} aria-label="Previous">
              <ChevronLeft size={24} />
            </button>
            <div className="dpc-carousel" ref={mattressesScrollRef}>
              {mattresses.map((p) => (
                <DetailedProductCard key={p.id} product={p} />
              ))}
            </div>
            <button className="dpc-nav-btn right" onClick={scrollMattressesRight} aria-label="Next">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ────────────────────────────────────────── */}
      <section className="promo-banner-section">
        <div className="container">
          <div className="promo-banner-grid">
            <div className="promo-banner promo-banner-main">
              <div className="promo-content">
                <span className="promo-tag">Limited Time Offer</span>
                <h2 className="promo-title">Sleep Trial Sale</h2>
                <p className="promo-sub">Up to 55% off on premium mattresses. Try for 100 nights, return if not satisfied.</p>
                <div className="promo-highlight">
                  <div className="promo-stat">
                    <span className="promo-stat-num">55%</span>
                    <span className="promo-stat-label">Max Discount</span>
                  </div>
                  <div className="promo-stat">
                    <span className="promo-stat-num">100</span>
                    <span className="promo-stat-label">Night Trial</span>
                  </div>
                  <div className="promo-stat">
                    <span className="promo-stat-num">10yr</span>
                    <span className="promo-stat-label">Warranty</span>
                  </div>
                </div>
                <Link to="/mattress" className="btn btn-gold btn-lg">Shop the Sale</Link>
              </div>
              <div className="promo-image">
                <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80" alt="Sleep Trial Sale" loading="lazy" />
              </div>
            </div>
            <div className="promo-banners-side">
              <Link to="/bed" className="promo-banner-mini" style={{ background: 'linear-gradient(135deg, #2d2d44, #1a1a2e)' }}>
                <div className="mini-content">
                  <p className="mini-tag">Bedroom</p>
                  <p className="mini-title">Premium Beds</p>
                  <p className="mini-sub">Starting ₹12,999</p>
                  <span className="mini-cta">Explore <ArrowRight size={12} /></span>
                </div>
                <img src="https://images.unsplash.com/photo-1505693314120-0d443867891c?w=300&q=75" alt="Beds" loading="lazy" className="mini-img" />
              </Link>
              <Link to="/sofa" className="promo-banner-mini" style={{ background: 'linear-gradient(135deg, #1a2d1a, #0d1f0d)' }}>
                <div className="mini-content">
                  <p className="mini-tag">Living Room</p>
                  <p className="mini-title">Luxe Sofas</p>
                  <p className="mini-sub">Starting ₹18,999</p>
                  <span className="mini-cta">Explore <ArrowRight size={12} /></span>
                </div>
                <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&q=75" alt="Sofas" loading="lazy" className="mini-img" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ── PROTECTORS ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title">Mattress Protectors</h2>
              <div className="divider" />
              <p className="section-subtitle">100% Waterproof & Anti-Allergen Shields</p>
            </div>
            <Link to="/protectors" className="btn btn-outline">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="product-grid-4">
            {protectors.map((p) => (
              <CategoryProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>



      {/* ── INSPIRATION STRIP ────────────────────────────────────── */}
      <section className="inspiration-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', color: 'var(--white)' }}>Sleep Science by SleepNest</h2>
          <div className="divider" style={{ margin: '16px auto' }} />
          <div className="inspiration-grid">
            {[
              { emoji: '🧠', title: 'Memory Foam Technology', desc: 'Viscoelastic foam that adapts to your body contours for personalized support.' },
              { emoji: '🌿', title: 'EcoLatex Natural Rubber', desc: 'Sustainably harvested latex providing natural bounce and durability.' },
              { emoji: '⚙️', title: 'Pocket Spring System', desc: 'Individually wrapped springs for targeted support and motion isolation.' },
              { emoji: '❄️', title: 'Cool Gel Infusion', desc: 'Temperature-regulating gel keeps you cool throughout the night.' },
            ].map((item) => (
              <div key={item.title} className="inspiration-card">
                <span className="inspiration-emoji">{item.emoji}</span>
                <h3 className="inspiration-title">{item.title}</h3>
                <p className="inspiration-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="divider" style={{ margin: '16px auto' }} />
            <p className="section-subtitle">Verified reviews from real SleepNest customers</p>
            <div className="reviews-aggregate">
              <div className="reviews-stars">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={24} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <strong>4.8 out of 5</strong>
              <span>Based on 50,000+ reviews</span>
            </div>
          </div>
          <div className="testimonials-grid">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-avatar-wrap">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                </div>
                <div className="testimonial-content">
                  <p className="testimonial-text">
                    "{t.text}"
                  </p>
                  <p className="testimonial-author">
                    {t.name}, {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────── */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <h2>Get Exclusive Sleep Deals</h2>
              <p>Subscribe for 10% off your first order + sleep tips from our experts.</p>
            </div>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-gold" disabled={subscribing}>
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── BRANDS / CERTIFICATIONS ──────────────────────────────── */}
      <section className="section">
        <div className="container">
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '32px' }}>
            Certified & Trusted by Leading Organizations
          </p>
          <div className="cert-strip">
            {['CertiPUR-US', 'OEKO-TEX', 'ISO 9001', 'FSSAI', 'BIS Certified', 'Green Label'].map((cert) => (
              <div key={cert} className="cert-badge">
                <span>✓ {cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
