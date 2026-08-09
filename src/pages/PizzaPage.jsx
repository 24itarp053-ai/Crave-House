import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import pizzaData from '../data/pizzaData';
import PizzaCard from '../components/PizzaCard';
import '../pizza-page.css';

export default function PizzaPage() {
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

      <section className="pizza-hero">
        <p className="eyebrow">Hand-tossed with love</p>
        <h1>
          Pizza, the way it
          <br />
          <em>should be.</em>
        </h1>
        <p>Fresh dough, premium cheese and a little Crave House magic in every slice.</p>
      </section>

      <section className="pizza-menu">
        <div className="pizza-menu-heading">
          <div>
            <p className="eyebrow">Our pizza collection</p>
            <h2>Find your favourite slice.</h2>
          </div>
          <span>06 PIZZAS</span>
        </div>

        <div className="pizza-grid">
          {pizzaData.map((pizza, index) => (
            <PizzaCard key={pizza.id} pizza={pizza} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
