import React from 'react';
import { Phone, Mail, FileDown } from 'lucide-react';

export default function Hero({ siteInfo, onOpenQuote }) {
  const settings = siteInfo?.settings || {};
  const stats = siteInfo?.heroStats || [
    { num: '25A–95A', lbl: 'Shore Hardness Range' },
    { num: '1400°C', lbl: 'High-Temp Bellows Rated' },
    { num: '10+', lbl: 'Polymer Product Lines' },
    { num: '2 Decades', lbl: 'Trusted Manufacturing' }
  ];

  return (
    <section className="hero" id="home">
      <div className="wrap hero-inner">
        <div>
          <div className="eyebrow">
            {settings.hero_eyebrow || 'Vadodara, Gujarat · Manufacturer'}
          </div>
          <h1>
            Precision Industrial Sealing &amp; <span>Engineering Polymer</span> Solutions
          </h1>
          <p className="lead">
            {settings.hero_lead || 'Manufacturer of Rubber Moulded Parts, O-Rings, Oil Seals, PTFE, PU, Nylon & Silicone components — engineered to your drawing, in any shore hardness, for mining, cement, pharma, chemical and heavy engineering industries.'}
          </p>
          <div className="hero-actions">
            <a href={`tel:${settings.primary_phone || '+919924314732'}`} className="btn btn-orange">
              <Phone size={16} /> Call Now
            </a>
            <button 
              type="button" 
              onClick={() => onOpenQuote()} 
              className="btn btn-teal"
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

        <div className="gear-cluster" aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <g className="gear-big">
              <path 
                fill="none" 
                stroke="#14b3ae" 
                strokeWidth="1.6" 
                opacity="0.65"
                d="M200 60 l14 22 25-9 7 27 27-2 -2 27 27 7-9 25 22 14-22 14 9 25-27 7 2 27-27-2-7 27-25-9-14 22-14-22-25 9-7-27-27 2 2-27-27-7 9-25-22-14 22-14-9-25 27-7-2-27 27 2 7-27 25 9z"
              />
              <circle cx="200" cy="200" r="52" fill="none" stroke="#14b3ae" strokeWidth="1.6" opacity="0.65" />
            </g>
            <g className="gear-small" transform="translate(268,120) scale(0.42)">
              <path 
                fill="#e8622c" 
                opacity="0.9"
                d="M200 60 l14 22 25-9 7 27 27-2 -2 27 27 7-9 25 22 14-22 14 9 25-27 7 2 27-27-2-7 27-25-9-14 22-14-22-25 9-7-27-27 2 2-27-27-7 9-25-22-14 22-14-9-25 27-7-2-27 27 2 7-27 25 9z"
              />
              <circle cx="200" cy="200" r="52" fill="#071a30" />
            </g>
            <circle cx="200" cy="200" r="4" fill="#f3f5f7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
