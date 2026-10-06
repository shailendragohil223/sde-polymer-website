import React from 'react';

export default function SpecTicker({ specs }) {
  const items = specs && specs.length > 0 ? specs : [
    { material: 'NBR · SBR · SILICONE · EPDM', details: 'RUBBER MOULDED COMPONENTS' },
    { material: 'PTFE', details: 'VIRGIN / GLASS FILLED / CARBON FILLED / BRONZE FILLED / PEEK FILLED' },
    { material: 'PU', details: '25A TO 95A SHORE HARDNESS HIGH-REBOUND' },
    { material: 'SEALS', details: 'U-CUP / WIPER / V-PACKING / PISTON / GUIDE RINGS' },
    { material: 'NYLON', details: 'PP / HDPE / PVC / POM / PE MACHINED COMPONENTS' },
    { material: 'BELLOWS', details: 'FIREPROOF RATED 1200°C TO 1400°C' }
  ];

  // Duplicate for seamless infinite loop
  const displayItems = [...items, ...items];

  return (
    <div className="spec-ticker" aria-hidden="true">
      <div className="track">
        {displayItems.map((item, idx) => (
          <span key={idx}>
            <b>{item.material}</b> — {item.details}
          </span>
        ))}
      </div>
    </div>
  );
}
