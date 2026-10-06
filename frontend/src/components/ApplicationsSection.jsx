import React from 'react';

export default function ApplicationsSection({ applications }) {
  const apps = applications && applications.length > 0 ? applications : [
    { title: 'Hydraulic Systems', description: 'Cylinders, seal kits, wear rings', category_tag: 'Fluid Power' },
    { title: 'Pneumatic Systems', description: 'Piston & wiper seals', category_tag: 'Pneumatics' },
    { title: 'Pumps & Valves', description: 'Gaskets, O-rings, diaphragms', category_tag: 'Process' },
    { title: 'Compressors', description: 'High-temperature seals', category_tag: 'Heavy Machinery' },
    { title: 'Conveyors', description: 'PU wheels, rollers, sleeves', category_tag: 'Material Handling' },
    { title: 'Gearboxes', description: 'Oil seals, bush & stoppers', category_tag: 'Transmission' },
    { title: 'Process Plants', description: 'Expansion joints, bellows', category_tag: 'Plants & Piping' },
    { title: 'Furnaces', description: 'PTFE & high-temp bellows', category_tag: 'Thermal' }
  ];

  return (
    <section className="app-band" id="applications">
      <div className="wrap">
        <div className="eyebrow">Where Our Parts Work</div>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', marginBottom: '36px', maxWidth: '560px' }}>
          Applications &amp; equipment.
        </h2>

        <div className="app-grid">
          {apps.map((app, idx) => (
            <div className="app-cell" key={idx}>
              {app.category_tag && <span className="tag">{app.category_tag}</span>}
              <h4>{app.title}</h4>
              <p>{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
