import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export function Logo() {
  return (
    <a className="logo" href="#home">
      <span>CH</span>
      <i>Crave House</i>
    </a>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 45);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#categories' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={isScrolled ? 'nav solid' : 'nav'}>
      <Logo />

      <nav className={isMenuOpen ? 'open' : ''}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="navtools">
        <Link to="/cart" className="cart" aria-label="Shopping cart">
          <FiShoppingBag />
          <b>{cartCount}</b>
        </Link>
        <a className="login" href="#contact">
          Login
        </a>
        <button
          className="hamb"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation Menu"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
}
