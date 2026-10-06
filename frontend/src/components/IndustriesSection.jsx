import React from 'react';
import { 
  FlaskConical, Pill, Utensils, Building2, Hammer, 
  FileText, Box, Layers, Scissors, Zap, Cpu, Cog 
} from 'lucide-react';

const iconMap = {
  FlaskConical,
  Pill,
  Utensils,
  Building2,
  Hammer,
  FileText,
  Box,
  Layers,
  Scissors,
  Zap,
  Cpu,
  Cog
};

export default function IndustriesSection({ industries }) {
  const list = industries && industries.length > 0 ? industries : [
    { name: 'Chemical', icon: 'FlaskConical' },
    { name: 'Pharma', icon: 'Pill' },
    { name: 'Food Processing', icon: 'Utensils' },
    { name: 'Cement', icon: 'Building2' },
    { name: 'Steel', icon: 'Hammer' },
    { name: 'Paper', icon: 'FileText' },
    { name: 'Packaging', icon: 'Box' },
    { name: 'Plastic', icon: 'Layers' },
    { name: 'Textile', icon: 'Scissors' },
    { name: 'Power', icon: 'Zap' },
    { name: 'OEM', icon: 'Cpu' },
    { name: 'Heavy Engineering', icon: 'Cog' }
  ];

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Layers;
    return <IconComponent size={24} />;
  };

  return (
    <section id="industries">
      <div className="wrap">
        <div className="eyebrow">Industries We Serve</div>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', marginBottom: '36px', maxWidth: '560px' }}>
          Built for mining, process plants &amp; heavy engineering.
        </h2>

        <div className="ind-grid">
          {list.map((ind, idx) => (
            <div className="ind-chip" key={idx} title={ind.description || ind.name}>
              {renderIcon(ind.icon)}
              <span>{ind.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
