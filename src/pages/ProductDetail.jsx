import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingBag, FiStar, FiPlus, FiMinus, FiHeart, FiShoppingCart } from 'react-icons/fi';
import burgerData from '../data/burgerData';
import pastaData from '../data/pastaData';
import saladData from '../data/saladData';
import drinksData from '../data/drinksData';
import dessertData from '../data/dessertData';
import pizzaData from '../data/pizzaData';
import ProductCard from '../components/ProductCard';

const dataMap = {
  burger: burgerData,
  pasta: pastaData,
  salad: saladData,
  drinks: drinksData,
  desserts: dessertData,
  pizza: pizzaData,
};

const placeholderDetails = {
  burger: {
    ingredients: 'Premium Wheat Bun, Fresh Lettuce, Sliced Tomatoes, Red Onions, Crisp Veggie Patty, Cheddar Cheese, House Special Sauce.',
    nutrition: { calories: '320 kcal', protein: '12g', fat: '14g', carbs: '38g' }
  },
  pasta: {
    ingredients: 'Durum Wheat Pasta, Fresh Garlic, Extra Virgin Olive Oil, Exotic Veggies, Creamy Sauces, Parmesan Cheese, Italian Herbs.',
    nutrition: { calories: '410 kcal', protein: '14g', fat: '16g', carbs: '52g' }
  },
  salad: {
    ingredients: 'Fresh Romaine Lettuce, Organic Cherry Tomatoes, Sliced Cucumbers, Kalamata Olives, Feta Cheese, Homemade Vinaigrette Dressing.',
    nutrition: { calories: '180 kcal', protein: '4g', fat: '12g', carbs: '15g' }
  },
  drinks: {
    ingredients: 'Fresh Whole Milk, Premium Flavor Blends, Natural Cane Sugar, Fresh Mint, Squeezed Lime, Ice Cream Creamer.',
    nutrition: { calories: '250 kcal', protein: '6g', fat: '8g', carbs: '38g' }
  },
  desserts: {
    ingredients: 'Dark Cocoa Cocoa Powder, Whipped Cream Cheese, Organic Cane Sugar, Butter, Vanilla Extract, Chocolate Chips.',
    nutrition: { calories: '380 kcal', protein: '5g', fat: '18g', carbs: '45g' }
  },
  pizza: {
    ingredients: 'Fresh Hand-Tossed Dough, San Marzano Tomato Sauce, Premium Mozzarella, Basil Leaves, Extra Virgin Olive Oil.',
    nutrition: { calories: '290 kcal (per slice)', protein: '10g', fat: '9g', carbs: '32g' }
  }
};

export default function ProductDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setQuantity(1);
  }, [category, id]);

  const productData = dataMap[category];
  
  const product = useMemo(() => {
    if (!productData) return null;
    return productData.find(item => item.id === parseInt(id, 10));
  }, [productData, id]);

  const relatedProducts = useMemo(() => {
    if (!productData || !product) return [];
    return productData.filter(item => item.id !== product.id).slice(0, 3);
  }, [productData, product]);

  if (!product) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', background: '#f8f5ed', minHeight: '100vh' }}>
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been moved.</p>
        <Link to="/" style={{ color: '#4e342e', fontWeight: 600, textDecoration: 'underline' }}>Back to Home</Link>
      </div>
    );
  }

  const details = placeholderDetails[category] || placeholderDetails.pizza;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <main className="pizza-page">
      <header className="pizza-nav">
        <Link to="/" className="pizza-brand">
          <span>CH</span>
          <i>Crave House</i>
        </Link>

        <button onClick={() => navigate(-1)} className="pizza-back" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <FiArrowLeft /> Go Back
        </button>

        <button className="pizza-cart" aria-label="Shopping cart">
          <FiShoppingBag /> Cart <b>2</b>
        </button>
      </header>

      {/* Details Container */}
      <div className="product-details-container">
        <div className="product-details-content">
          
          {/* Left Column: Image with glassmorphism wrapper */}
          <motion.div 
            className="product-details-media"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="details-image-wrapper">
              <img src={product.image} alt={product.name} />
              <span className="veg-badge-large">● 100% VEG</span>
              <button 
                className={`details-fav-btn ${isFavorite ? 'fav-active' : ''}`}
                onClick={() => setIsFavorite(prev => !prev)}
                aria-label="Add to favorites"
              >
                <FiHeart style={{ fill: isFavorite ? '#d4a373' : 'none' }} />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Information & Actions */}
          <motion.div 
            className="product-details-info"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="info-category-tag">{category.toUpperCase()}</span>
            <h1>{product.name}</h1>
            
            <div className="info-meta">
              <span className="info-price">{product.price}</span>
              <span className="info-rating">
                <FiStar className="star-icon" /> {product.rating} / 5.0
              </span>
            </div>

            <p className="info-description">{product.description}</p>

            <div className="info-divider" />

            {/* Ingredients */}
            <div className="info-section">
              <h3>Ingredients</h3>
              <p>{details.ingredients}</p>
            </div>

            {/* Nutrition facts table */}
            <div className="info-section">
              <h3>Nutrition (Per Serving)</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-val">{details.nutrition.calories}</span>
                  <span className="nutrition-lbl">Energy</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-val">{details.nutrition.protein}</span>
                  <span className="nutrition-lbl">Protein</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-val">{details.nutrition.fat}</span>
                  <span className="nutrition-lbl">Fat</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-val">{details.nutrition.carbs}</span>
                  <span className="nutrition-lbl">Carbs</span>
                </div>
              </div>
            </div>

            <div className="info-divider" />

            {/* Add to Cart Controls */}
            <div className="details-actions">
              <div className="qty-selector">
                <button onClick={handleDecrement} aria-label="Decrease quantity"><FiMinus /></button>
                <span>{quantity}</span>
                <button onClick={handleIncrement} aria-label="Increase quantity"><FiPlus /></button>
              </div>

              <button className="details-add-btn">
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
            
            <button 
              className="details-back-link"
              onClick={() => navigate(`/menu/${category}`)}
            >
              <FiArrowLeft /> Back to {category} collection
            </button>
          </motion.div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pizza-menu related-section" style={{ background: '#f5efe4', borderTop: '1px solid #e8decb' }}>
          <div className="pizza-menu-heading">
            <div>
              <p className="eyebrow">Pair it with something nice</p>
              <h2>Related {category}s</h2>
            </div>
            <span>MORE TO CRAVE</span>
          </div>

          <div className="pizza-grid">
            {relatedProducts.map((item, idx) => (
              <ProductCard key={item.id} product={item} index={idx} category={category} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
