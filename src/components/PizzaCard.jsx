import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiHeart, FiStar } from 'react-icons/fi';

export default function PizzaCard({ pizza, index }) {
  return (
    <motion.article
      className="pizza-card"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
    >
      <div className="pizza-image">
        <img src={pizza.image} alt={pizza.name} loading="lazy" />
        <span className="veg-badge">● VEG</span>
        <button aria-label={`Save ${pizza.name}`}>
          <FiHeart />
        </button>
      </div>

      <div className="pizza-info">
        <div>
          <h2>{pizza.name}</h2>
          <p>{pizza.description}</p>
        </div>

        <div className="pizza-price">
          <strong>{pizza.price}</strong>
          <span>
            <FiStar /> {pizza.rating}
          </span>
        </div>

        <div className="pizza-actions">
          <button className="pizza-add">
            Add to cart <FiArrowUpRight />
          </button>
          <button className="pizza-details">View details</button>
        </div>
      </div>
    </motion.article>
  );
}
