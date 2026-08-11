import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiHeart, FiStar } from 'react-icons/fi';
import { menuItems } from '../data/menuData';
import { useCart } from '../context/CartContext';

const revealAnimation = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.55 },
};

export default function MenuSection() {
  const { addToCart } = useCart();
  return (
    <section id="menu" className="section menu">
      <motion.div {...revealAnimation} className="center-head">
        <p className="eyebrow">Our signature selection</p>
        <h2>Popular on the table.</h2>
        <p>Little moments of joy, plated fresh for you.</p>
      </motion.div>

      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <motion.article
            key={item.id}
            {...revealAnimation}
            transition={{ delay: (index % 4) * 0.06 }}
            className="food-card"
          >
            <div className={`food-img ${item.category}`}>
              <img loading="lazy" src={item.image} alt={item.name} />
              {item.isVeg && <span>VEG</span>}
              <button aria-label={`Add ${item.name} to wishlist`}>
                <FiHeart />
              </button>
            </div>

            <div className="food-info">
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>

              <div className="price-row">
                <b>{item.price}</b>
                <small>
                  <FiStar /> {item.rating}
                </small>
              </div>

              <button 
                className="add"
                onClick={() => addToCart(item, 1, item.category)}
              >
                Add to cart <FiArrowUpRight />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <a className="outline" href="#contact">
        Explore all specialties <FiArrowUpRight />
      </a>
    </section>
  );
}
