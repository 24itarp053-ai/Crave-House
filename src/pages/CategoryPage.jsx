import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiSearch, FiSliders } from 'react-icons/fi';
import burgerData from '../data/burgerData';
import pastaData from '../data/pastaData';
import saladData from '../data/saladData';
import drinksData from '../data/drinksData';
import dessertData from '../data/dessertData';
import ProductCard from '../components/ProductCard';

// Import images for hero banners
import burgerHeroImg from '../assets/images/burger.png';
import pastaHeroImg from '../assets/images/pasta.png';
import saladHeroImg from '../assets/images/salad.png';
import drinksHeroImg from '../assets/images/drinks.png';
import dessertHeroImg from '../assets/images/desserts.png';

const categoryConfigs = {
  burger: {
    title: 'Delicious Veg Burgers',
    subtitle: 'Freshly grilled vegetarian burgers made with premium ingredients.',
    eyebrow: 'Handcrafted Stacks',
    data: burgerData,
    image: burgerHeroImg,
  },
  pasta: {
    title: 'Authentic Italian Pasta',
    subtitle: 'Creamy and cheesy Italian pasta made with authentic herbs and fresh ingredients.',
    eyebrow: 'Italian Classics',
    data: pastaData,
    image: pastaHeroImg,
  },
  salad: {
    title: 'Healthy Fresh Salads',
    subtitle: 'Healthy, colorful salads made with fresh vegetables and homemade dressings.',
    eyebrow: 'Fresh & Green',
    data: saladData,
    image: saladHeroImg,
  },
  drinks: {
    title: 'Refreshing Drinks & Shakes',
    subtitle: 'Refreshing shakes, mojitos, lemonades and signature beverages.',
    eyebrow: 'Cool Refreshments',
    data: drinksData,
    image: drinksHeroImg,
  },
  desserts: {
    title: 'Sweet Desserts',
    subtitle: 'Delicious cakes, brownies, cheesecakes and sweet treats for every craving.',
    eyebrow: 'Sweet Endings',
    data: dessertData,
    image: dessertHeroImg,
  },
};

export default function CategoryPage({ category }) {
  const config = categoryConfigs[category];
  
  if (!config) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Category not found.</div>;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Filter & Sort Logic
  const processedProducts = useMemo(() => {
    let items = [...config.data];

    // Search query filter
    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tag filter
    if (selectedFilter === 'Under ₹200') {
      items = items.filter(item => {
        const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10);
        return numericPrice < 200;
      });
    } else if (selectedFilter === 'Top Rated') {
      items = items.filter(item => item.rating >= 4.7);
    }

    // Sort sorting
    if (sortBy === 'price-low') {
      items.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10);
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      items.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10);
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [config.data, searchQuery, selectedFilter, sortBy]);

  return (
    <main className="pizza-page">
      <header className="pizza-nav">
        <Link to="/" className="pizza-brand">
          <span>CH</span>
          <i>Crave House</i>
        </Link>

        <Link to="/" className="pizza-back">
          <FiArrowLeft /> Back to home
        </Link>

        <button className="pizza-cart" aria-label="Shopping cart">
          <FiShoppingBag /> Cart <b>2</b>
        </button>
      </header>

      {/* Hero Banner Component */}
      <section 
        className="pizza-hero"
        style={{ 
          background: `linear-gradient(90deg, rgba(38, 21, 15, 0.96) 5%, rgba(62, 39, 35, 0.78)), url(${config.image}) center/cover`
        }}
      >
        <p className="eyebrow">{config.eyebrow}</p>
        <h1>
          {config.title.split(' ').slice(0, -1).join(' ')}
          <br />
          <em>{config.title.split(' ').slice(-1)}</em>
        </h1>
        <p>{config.subtitle}</p>
      </section>

      {/* Breadcrumb Component */}
      <div className="category-breadcrumb-container">
        <div className="category-breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span className="active">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
        </div>
      </div>

      <section className="pizza-menu" style={{ paddingTop: '20px' }}>
        {/* Controls: Search, Filters, Sort */}
        <div className="menu-controls">
          <div className="search-bar-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={`Search for your favorite ${category}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-sort-wrapper">
            <div className="filter-tabs">
              {['All', 'Under ₹200', 'Top Rated'].map((tag) => (
                <button 
                  key={tag} 
                  className={`filter-tab-btn ${selectedFilter === tag ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="sort-select-wrapper">
              <FiSliders className="sort-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown-select"
              >
                <option value="default">Default Sort</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Popularity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pizza-menu-heading" style={{ marginTop: '30px' }}>
          <div>
            <p className="eyebrow">Our {category} collection</p>
            <h2>Freshly Prepared Just For You.</h2>
          </div>
          <span>{processedProducts.length.toString().padStart(2, '0')} ITEMS</span>
        </div>

        {processedProducts.length > 0 ? (
          <div className="pizza-grid">
            {processedProducts.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} category={category} />
            ))}
          </div>
        ) : (
          <div className="no-products-found">
            <h3>No items match your criteria.</h3>
            <p>Try refining your search or filters.</p>
          </div>
        )}
      </section>
    </main>
  );
}
