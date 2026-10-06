import React from 'react';

export default function AboutSection({ siteInfo }) {
  const settings = siteInfo?.settings || {};

  const capabilities = [
    { code: '01 / CAPABILITY', title: 'Custom Manufacturing to Drawing' },
    { code: '02 / MATERIAL', title: 'High-Quality Engineering Polymers' },
    { code: '03 / SPEED', title: 'Fast Turnaround & Rapid Delivery' },
    { code: '04 / VALUE', title: 'Competitive Direct Factory Pricing' },
    { code: '05 / REACH', title: 'Serving Industries Pan-India & Global' },
    { code: '06 / TRUST', title: 'Trusted 2 Decades in Bellows & Seals' }
  ];

  return (
    <section id="about">
      <div className="wrap about-grid">
        <div>
          <div className="eyebrow">{settings.about_eyebrow || 'About SDE'}</div>
          <h2>
            {settings.about_title || 'Two decades of polymer engineering, built on custom manufacturing.'}
          </h2>
          <p>
            {settings.about_text || 'Shree Dipeshwari Engineering manufactures and supplies high-performance polyurethane, rubber, PTFE, nylon and silicone components for industrial applications across India and international markets. From 25A to 95A shore hardness, from vacuum bellows to 1400°C fireproof high-temperature bellows — every part is engineered to your size, shape, colour and specification.'}
          </p>
        </div>

        <div className="feature-list">
          {capabilities.map((cap, idx) => (
            <div className="item" key={idx}>
              <div className="ic">{cap.code}</div>
              <h4>{cap.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
