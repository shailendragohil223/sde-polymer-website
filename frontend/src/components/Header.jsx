import React, { useState } from 'react';
import { Phone, FileText, Menu, X } from 'lucide-react';

export default function Header({ siteInfo, onOpenQuote }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = siteInfo?.settings || {};

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header>
      <div className="nav-inner">
        <a href="#home" className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#14b3ae" d="M50 6l6 10 11-4 3 12 12-1 -1 12 12 3-4 11 10 6-10 6 4 11-12 3 1 12-12-1-3 12-11-4-6 10-6-10-11 4-3-12-12 1 1-12-12-3 4-11-10-6 10-6-4-11 12-3-1-12 12 1 3-12 11 4z"/>
              <circle cx="50" cy="50" r="20" fill="#071a30"/>
            </svg>
          </span>
          <span className="brand-text">
            <span className="name">{settings.site_name || 'Shree Dipeshwari Engineering'}</span>
            <span className="tag">{settings.tagline || 'Complete Polymer Solution'}</span>
          </span>
        </a>

        <nav className={`links ${mobileOpen ? 'open' : ''}`} id="navLinks">
          <a href="#about" onClick={handleNavClick}>About</a>
          <a href="#products" onClick={handleNavClick}>Products</a>
          <a href="#industries" onClick={handleNavClick}>Industries</a>
          <a href="#process" onClick={handleNavClick}>Process</a>
          <a href="#applications" onClick={handleNavClick}>Applications</a>
          <a href="#contact" onClick={handleNavClick}>Contact</a>
        </nav>

        <div className="header-cta">
          <a href={`tel:${settings.primary_phone || '+919924314732'}`} className="btn btn-ghost btn-sm">
            <Phone size={14} /> Call Now
          </a>
          <button 
            type="button" 
            onClick={() => onOpenQuote()} 
            className="btn btn-orange btn-sm"
          >
            <FileText size={14} /> Request Quote
          </button>
          <button 
            className="menu-toggle" 
            onClick={() => setMobileOpen(!mobileOpen)} 
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
