import React, { useState, useEffect } from 'react';
import { Phone, Mail, FileDown, CheckCircle2 } from 'lucide-react';

// Product lines shown in the hero list and photo slideshow
const PRODUCT_LINES = [
  { name: 'Rubber Moulded Parts', image: '/uploads/products/custom-moulded-rubber-parts.jpg' },
  { name: 'PTFE Products', image: '/uploads/products/ptfe-machined-components.jpg' },
  { name: 'PU Products', image: '/uploads/products/pu-wheels-assortment.jpg' },
  { name: 'Nylon Products', image: '/uploads/products/nylon-engineering-plastics.jpg' },
  { name: 'Hydraulic & Pneumatic Cylinder Seals', image: '/uploads/products/hydraulic-seal-kit.jpg' },
  { name: 'Custom Engineering Polymer Products', image: '/uploads/products/rubber-moulded-parts-assortment.jpg' }
];

const SLIDE_INTERVAL_MS = 3500;

export default function Hero({ siteInfo, onOpenQuote }) {
  const settings = siteInfo?.settings || {};
  const stats = siteInfo?.heroStats || [
    { num: '25A–95A', lbl: 'Shore Hardness Range' },
    { num: '1400°C', lbl: 'High-Temp Bellows Rated' },
    { num: '10+', lbl: 'Polymer Product Lines' },
    { num: '2 Decades', lbl: 'Trusted Manufacturing' }
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // Restarts on every slide change, so a manual pick stays up for a full interval
  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => {
      setActiveSlide(i => (i + 1) % PRODUCT_LINES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [paused, activeSlide]);

  return (
    <section className="hero" id="home">
      <div className="wrap hero-inner">
        <h1 className="hero-title">
          Precision Industrial Sealing &amp; <span>Engineering Polymer</span> Solutions
        </h1>

        <ul className="hero-products">
          {PRODUCT_LINES.map((line, idx) => (
            <li key={line.name}>
              <button
                type="button"
                className={idx === activeSlide ? 'active' : ''}
                onClick={() => setActiveSlide(idx)}
                aria-pressed={idx === activeSlide}
              >
                <CheckCircle2 size={16} /> {line.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="hero-cta-block">
          <div className="hero-actions">
            <a href={`tel:${settings.primary_phone || '+919924314732'}`} className="btn btn-primary">
              <Phone size={16} /> Call Now
            </a>
            <button 
              type="button" 
              onClick={() => onOpenQuote()} 
              className="btn btn-secondary"
            >
              <Mail size={16} /> Request a Quote
            </button>
            <a href="#products" className="btn btn-ghost">
              <FileDown size={16} /> Explore Catalog
            </a>
          </div>

          <div className="hero-strip">
            {stats.map((stat, idx) => (
              <div className="stat" key={idx}>
                <div className="num">{stat.num}</div>
                <div className="lbl">{stat.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="hero-slideshow"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Our products"
        >
          {PRODUCT_LINES.map((line, idx) => (
            <figure
              key={line.name}
              className={`hero-slide ${idx === activeSlide ? 'active' : ''}`}
              aria-hidden={idx !== activeSlide}
            >
              <img src={line.image} alt={line.name} decoding="async" />
              <figcaption>{line.name}</figcaption>
            </figure>
          ))}
          <img className="hero-slideshow-logo" src="/logo/sde-logo.svg" alt="" aria-hidden="true" />
          <div className="hero-slide-dots">
            {PRODUCT_LINES.map((line, idx) => (
              <button
                key={line.name}
                type="button"
                className={idx === activeSlide ? 'active' : ''}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Show ${line.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
