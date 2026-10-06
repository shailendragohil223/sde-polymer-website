import React from 'react';

export default function WhyChooseSection({ whyChoose }) {
  const items = whyChoose && whyChoose.length > 0 ? whyChoose : [
    { title: 'Custom Design & Development', description: 'Engineered to your exact drawing or physical sample.' },
    { title: 'Reverse Engineering', description: 'Worn or obsolete part in hand — we rebuild the spec.' },
    { title: 'OEM Replacement Parts', description: 'Import substitutes matched to original tolerances.' },
    { title: 'Fast Manufacturing', description: 'In-house tooling keeps lead times short.' },
    { title: 'Quality Tested Products', description: 'Checked for hardness, tensile strength & tolerance.' },
    { title: 'Bulk Supply', description: 'Consistent quality across large production runs.' },
    { title: 'Emergency Deliveries', description: 'Plant down? We prioritise critical-spare dispatch.' },
    { title: 'Technical Support', description: 'Material & grade selection guidance before you order.' }
  ];

  return (
    <section style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <div className="eyebrow">Why Choose Us</div>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', marginBottom: '40px', maxWidth: '560px' }}>
          Reverse-engineered replacements, delivered fast.
        </h2>

        <div className="why-grid">
          {items.map((item, idx) => (
            <div className="why-card" key={idx}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
