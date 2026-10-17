import React, { useState, useEffect } from 'react';
import { Phone, Mail, FileDown } from 'lucide-react';

// Product lines shown in the hero photo slideshow and the small list beside it
const PRODUCT_LINES = [
  { name: 'Rubber Moulded Parts', image: '/uploads/products/custom-moulded-rubber-parts.jpg' },
  { name: 'PTFE Products', image: '/uploads/products/ptfe-machined-components.jpg' },
  { name: 'PU Products', image: '/uploads/products/pu-wheels-assortment.jpg' },
  { name: 'Nylon Products', image: '/uploads/products/nylon-engineering-plastics.jpg' },
  { name: 'Hydraulic & Pneumatic Cylinder Seals', image: '/uploads/products/hydraulic-seal-kit.jpg' },
  { name: 'Rubber Bristles Wiping Rubber Pad', image: '/uploads/products/rubber-pin-pad.jpg' },
  { name: 'Custom Engineering Polymer Products', image: '/uploads/products/rubber-moulded-parts-assortment.jpg' }
];

const SLIDE_INTERVAL_MS = 3000;

export default function Hero({ siteInfo, onOpenQuote }) {
  const settings = siteInfo?.settings || {};

  const [activeSlide, setActiveSlide] = useState(0);
  const [held, setHeld] = useState(false);

  // Hovering or focusing a product name shows its photo and holds it there
  const showLine = (idx) => {
    setActiveSlide(idx);
    setHeld(true);
  };
  const release = () => setHeld(false);

  // Restarts on every slide change, so a manual pick stays up for a full interval
  useEffect(() => {
    if (held) return undefined;
    const timer = setTimeout(() => {
      setActiveSlide(i => (i + 1) % PRODUCT_LINES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [held, activeSlide]);

  return (
    <section className="hero" id="home">
      <div className="hero-stage" aria-roledescription="carousel" aria-label="Our products">
        {PRODUCT_LINES.map((line, idx) => (
          <div
            key={line.name}
            className={`hero-slide ${idx === activeSlide ? 'active' : ''}`}
            aria-hidden={idx !== activeSlide}
          >
            <img className="hero-slide-bg" src={line.image} alt="" decoding="async" />
            <img className="hero-slide-img" src={line.image} alt={line.name} decoding="async" />
          </div>
        ))}

        <div className="hero-slide-caption">
          <span aria-live="polite">{PRODUCT_LINES[activeSlide].name}</span>
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

      <div className="wrap hero-content">
        <div className="hero-panel">
          <h1>
            Precision Industrial Sealing &amp; <span>Engineering Polymer</span> Solutions
          </h1>

          <ul className="hero-products" onMouseLeave={release}>
            {PRODUCT_LINES.map((line, idx) => (
              <li key={line.name}>
                <button
                  type="button"
                  className={idx === activeSlide ? 'active' : ''}
                  onMouseEnter={() => showLine(idx)}
                  onFocus={() => showLine(idx)}
                  onBlur={release}
                  onClick={() => setActiveSlide(idx)}
                  aria-pressed={idx === activeSlide}
                >
                  {line.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="hero-actions">
            <a href={`tel:${settings.primary_phone || '+919924314732'}`} className="btn btn-primary btn-sm">
              <Phone size={14} /> Call Now
            </a>
            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="btn btn-secondary btn-sm"
            >
              <Mail size={14} /> Request a Quote
            </button>
            <a href="#products" className="btn btn-ghost btn-sm">
              <FileDown size={14} /> Explore Catalog
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
