import React from 'react';

export default function TrustSection({ trustPoints }) {
  const points = trustPoints && trustPoints.length > 0 ? trustPoints : [
    { title: 'Manufacturing Capability', description: 'In-house tooling across 10 product lines.' },
    { title: 'Quality Inspection', description: 'Hardness, tensile & tolerance checked.' },
    { title: 'Customization', description: 'Any size, shape, colour, hardness.' },
    { title: 'Technical Support', description: 'Grade & material guidance included.' },
    { title: 'Fast Response', description: 'Quotation within 24 hours.' }
  ];

  return (
    <section>
      <div className="wrap">
        <div className="eyebrow">Why Customers Trust Us</div>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', marginBottom: '8px', maxWidth: '560px' }}>
          Capability backed by response time.
        </h2>
      </div>

      <div className="wrap" style={{ padding: '0 24px', marginTop: '28px' }}>
        <div className="trust-grid">
          {points.map((tp, idx) => (
            <div className="trust-item" key={idx}>
              <h4>{tp.title}</h4>
              <p>{tp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
