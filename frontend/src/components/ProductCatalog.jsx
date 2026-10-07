import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, FileText } from 'lucide-react';

const PAGE_SIZE = 9;

export default function ProductCatalog({ categories, products, onSelectProduct, onOpenQuote, onSelectCategory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatCode, setSelectedCatCode] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Start from the first page whenever the filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedCatCode]);

  const filteredCategories = categories.filter(cat => {
    if (searchTerm) {
      return cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             cat.code.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const filteredProducts = products.filter(prod => {
    const matchesCat = selectedCatCode === 'ALL' || prod.category_code === selectedCatCode;
    const matchesSearch = !searchTerm || 
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.short_desc && prod.short_desc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prod.material_grades && prod.material_grades.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section className="section-alt" id="products">
      <div className="wrap">
        <div className="cat-head">
          <div>
            <div className="eyebrow">Product Range</div>
            <h2>Everything you need, one polymer partner.</h2>
          </div>
          <p>
            From standard O-rings to fireproof bellows rated to 1400°C — manufactured in-house across eleven product families.
          </p>
        </div>

        {/* Toolbar with Search & Category Filter */}
        <div className="catalog-toolbar">
          <div className="catalog-search">
            <Search size={16} />
            <input 
              type="search"
              aria-label="Search products" 
              placeholder="Search products, materials (PTFE, NBR, PU), or shore hardness..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filter-chips">
            <button 
              className={`filter-chip ${selectedCatCode === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCatCode('ALL')}
            >
              All Categories ({categories.length})
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`filter-chip ${selectedCatCode === cat.code ? 'active' : ''}`}
                onClick={() => setSelectedCatCode(selectedCatCode === cat.code ? 'ALL' : cat.code)}
              >
                {cat.code}: {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="cat-grid">
          {filteredCategories.map((cat) => (
            <button 
              type="button"
              className="cat-card" 
              key={cat.id}
              onClick={() => {
                setSelectedCatCode(cat.code);
                document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <div className="num">{cat.code}</div>
              <h4>{cat.name}</h4>
              <p>{cat.description}</p>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-bright)', fontSize: '12px', fontWeight: 600 }}>
                <span>View Products</span> <ArrowRight size={13} />
              </div>
            </button>
          ))}
          {!searchTerm && (
            <a href="#contact" className="cat-card cat-card-cta">
              <div className="num">Custom</div>
              <h4>Need a custom part?</h4>
              <p>Send your drawing or sample and get a quotation within 24 hours.</p>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--white)', fontSize: '12px', fontWeight: 600 }}>
                <span>Contact Engineering</span> <ArrowRight size={13} />
              </div>
            </a>
          )}
        </div>

        {/* Products List */}
        <div id="product-list" style={{ marginTop: '56px', scrollMarginTop: '90px' }}>
          <h3 style={{ fontSize: '22px', color: 'var(--white)', marginBottom: '24px' }}>
            {selectedCatCode === 'ALL'
              ? 'All Products'
              : categories.find(c => c.code === selectedCatCode)?.name || 'Products'}{' '}
            <span style={{ color: 'var(--steel-light)', fontWeight: 400 }}>({filteredProducts.length})</span>
          </h3>

          {filteredProducts.length === 0 ? (
            <p style={{ color: 'var(--steel-light)' }}>No products match your search.</p>
          ) : (
            <>
              <div className="prod-grid">
                {filteredProducts.slice(0, visibleCount).map(prod => (
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
                      {onOpenQuote && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => onOpenQuote(prod)}
                        >
                          <FileText size={13} /> Quote
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {filteredProducts.length > visibleCount && (
                <div className="load-more">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
                  >
                    Show more products ({filteredProducts.length - visibleCount} more)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
