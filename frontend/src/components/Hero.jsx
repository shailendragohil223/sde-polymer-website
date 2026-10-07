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

        <div className="gear-cluster" role="img" aria-label="SDE logo">
          <svg viewBox="0 0 400 400">
            <g className="gear-big">
              <path 
                fill="none" 
                stroke="#5aa9f5" 
                strokeWidth="1.6" 
                opacity="0.65"
                d="M332.0 200.0 L355.6 211.0 L353.9 225.6 L328.4 230.8 L322.0 250.5 L339.5 269.7 L332.4 282.6 L306.8 277.6 L293.3 293.3 L302.2 317.8 L290.7 326.9 L269.0 312.5 L250.5 322.0 L249.4 348.0 L235.2 352.0 L220.6 330.4 L200.0 332.0 L189.0 355.6 L174.4 353.9 L169.2 328.4 L149.5 322.0 L130.3 339.5 L117.4 332.4 L122.4 306.8 L106.7 293.3 L82.2 302.2 L73.1 290.7 L87.5 269.0 L78.0 250.5 L52.0 249.4 L48.0 235.2 L69.6 220.6 L68.0 200.0 L44.4 189.0 L46.1 174.4 L71.6 169.2 L78.0 149.5 L60.5 130.3 L67.6 117.4 L93.2 122.4 L106.7 106.7 L97.8 82.2 L109.3 73.1 L131.0 87.5 L149.5 78.0 L150.6 52.0 L164.8 48.0 L179.4 69.6 L200.0 68.0 L211.0 44.4 L225.6 46.1 L230.8 71.6 L250.5 78.0 L269.7 60.5 L282.6 67.6 L277.6 93.2 L293.3 106.7 L317.8 97.8 L326.9 109.3 L312.5 131.0 L322.0 149.5 L348.0 150.6 L352.0 164.8 L330.4 179.4Z"
              />
              <circle cx="200" cy="200" r="118" fill="none" stroke="#5aa9f5" strokeWidth="1.2" opacity="0.4" strokeDasharray="4 6" />
            </g>
            <circle className="hero-logo-disc" cx="200" cy="200" r="96" />
            <image
              href="/logo/sde-logo.svg"
              x="128" y="142" width="144" height="116"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
