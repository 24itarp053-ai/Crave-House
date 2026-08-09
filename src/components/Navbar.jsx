import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';

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
        <button className="cart" aria-label="Shopping cart">
          <FiShoppingBag />
          <b>2</b>
        </button>
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
