import React from 'react';

export default function ProcessSection({ processSteps }) {
  const steps = processSteps && processSteps.length > 0 ? processSteps : [
    { step_number: '01', title: 'Share Drawing / Sample', description: 'Send spec, drawing or worn part.' },
    { step_number: '02', title: 'Technical Review', description: 'Our engineers assess tolerance & application.' },
    { step_number: '03', title: 'Material Selection', description: 'Right polymer grade for your environment.' },
    { step_number: '04', title: 'Sample Development', description: 'First-off sample for your approval.' },
    { step_number: '05', title: 'Production', description: 'In-house manufacturing at scale.' },
    { step_number: '06', title: 'Dispatch', description: 'Quality-checked, packed & shipped.' }
  ];

  return (
    <section id="process">
      <div className="wrap">
        <div className="eyebrow">Our Process</div>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', marginBottom: '36px', maxWidth: '560px' }}>
          From drawing to dispatch.
        </h2>
      </div>

      <div className="wrap" style={{ padding: '0 24px' }}>
        <div className="process-row">
          {steps.map((step, idx) => (
            <div className="process-step" key={idx}>
              <div className="idx">{step.step_number}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
