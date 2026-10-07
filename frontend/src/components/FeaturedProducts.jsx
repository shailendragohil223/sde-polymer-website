import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';

export default function FeaturedProducts({ products, onSelectProduct, onOpenQuote }) {
  const featured = products && products.length > 0 ? products.filter(p => p.is_featured) : [];
  const displayList = featured.length > 0 ? featured : products.slice(0, 6);

  return (
    <section style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <div className="eyebrow">Featured Products</div>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', marginBottom: '40px', maxWidth: '560px' }}>
          Reach for these first.
        </h2>

        <div className="prod-grid">
          {displayList.map(prod => (
            <div className="prod-card" key={prod.id}>
              <div>
                {prod.image_url ? (
                  <img className="prod-img" src={prod.image_url} alt={prod.name} loading="lazy" />
                ) : (
                  <div className="prod-img prod-img-placeholder" aria-hidden="true">
                    <img src="/logo/sde-logo.svg" alt="" />
                  </div>
                )}
                <span className="tag">{prod.category_name || prod.category_code || 'Polymer'}</span>
                <h4>{prod.name}</h4>
                <p>{prod.short_desc}</p>
                <div className="meta">
                  {prod.shore_hardness && <span>{prod.shore_hardness}</span>}
                  {prod.temp_rating && <span>{prod.temp_rating}</span>}
                </div>
              </div>

              <div className="prod-card-actions">
                <button 
                  type="button" 
                  className="btn btn-outline-navy btn-sm"
                  onClick={() => onSelectProduct(prod)}
                >
                  Tech Specs <ArrowRight size={13} />
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenQuote(prod)}
                >
                  <FileText size={13} /> Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
