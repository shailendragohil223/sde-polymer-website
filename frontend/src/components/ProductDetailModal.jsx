import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldAlert, Cpu, FileText, Phone } from 'lucide-react';

// gallery_images arrives as a JSON string from MySQL, or an array in in-memory mode
const parseGallery = (gallery) => {
  if (!gallery) return [];
  if (Array.isArray(gallery)) return gallery;
  try {
    const parsed = JSON.parse(gallery);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function ProductDetailModal({ product, onClose, onOpenQuote }) {
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    setActiveImage(product?.image_url || null);
  }, [product]);

  if (!product) return null;

  const images = [product.image_url, ...parseGallery(product.gallery_images)].filter(Boolean);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow" style={{ marginBottom: '4px', fontSize: '11px' }}>
              {product.category_code || 'POLYMER SPECIFICATION'}
            </span>
            <h2 style={{ fontSize: '24px', color: 'var(--navy-deep)' }}>{product.name}</h2>
            {product.subtitle && (
              <p style={{ color: 'var(--steel)', fontSize: '14px', marginTop: '2px' }}>
                {product.subtitle}
              </p>
            )}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {activeImage && (
          <div style={{ marginBottom: '20px' }}>
            <img
              src={activeImage}
              alt={product.name}
              style={{ width: '100%', maxHeight: '340px', objectFit: 'contain', background: 'var(--paper)', border: '1px solid var(--line-dark)', borderRadius: '4px', display: 'block' }}
            />
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {images.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(src)}
                    aria-label="Show image"
                    style={{ padding: 0, border: src === activeImage ? '2px solid var(--accent)' : '1px solid var(--line-dark)', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                  >
                    <img src={src} alt="" style={{ width: '64px', height: '48px', objectFit: 'cover', display: 'block', borderRadius: '3px' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '15px', color: 'var(--navy)', lineHeight: 1.6, marginBottom: '20px' }}>
            {product.full_desc || product.short_desc}
          </p>

          {/* Technical Specs Table */}
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line-dark)', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--navy-deep)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} color="var(--accent)" /> Technical Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13.5px' }}>
              {product.shore_hardness && (
                <div>
                  <strong style={{ color: 'var(--steel)' }}>Shore Hardness: </strong>
                  <span style={{ color: 'var(--navy-deep)', fontWeight: 600 }}>{product.shore_hardness}</span>
                </div>
              )}
              {product.temp_rating && (
                <div>
                  <strong style={{ color: 'var(--steel)' }}>Temperature Rating: </strong>
                  <span style={{ color: 'var(--navy-deep)', fontWeight: 600 }}>{product.temp_rating}</span>
                </div>
              )}
              {product.material_grades && (
                <div style={{ gridColumn: 'span 2' }}>
                  <strong style={{ color: 'var(--steel)' }}>Material Grades: </strong>
                  <span style={{ color: 'var(--navy-deep)' }}>{product.material_grades}</span>
                </div>
              )}
              {product.applications && (
                <div style={{ gridColumn: 'span 2' }}>
                  <strong style={{ color: 'var(--steel)' }}>Target Applications: </strong>
                  <span style={{ color: 'var(--navy-deep)' }}>{product.applications}</span>
                </div>
              )}
              {product.features && (
                <div style={{ gridColumn: 'span 2' }}>
                  <strong style={{ color: 'var(--steel)' }}>Key Highlights: </strong>
                  <span style={{ color: 'var(--navy-deep)' }}>{product.features}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <a href="tel:+919924314732" className="btn btn-outline-navy btn-sm">
            <Phone size={14} /> Call Technical Team
          </a>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => {
              onClose();
              onOpenQuote(product);
            }}
          >
            <FileText size={14} /> Request Quote For This Item
          </button>
        </div>
      </div>
    </div>
  );
}
