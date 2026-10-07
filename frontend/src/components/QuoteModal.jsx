import React, { useState, useEffect } from 'react';
import { X, Send, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { submitQuoteRequest } from '../services/api';
import useEscapeKey from '../hooks/useEscapeKey';

export default function QuoteModal({ isOpen, onClose, selectedProduct, onToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    material: 'Cast Polyurethane (PU)',
    shore_hardness: '85A',
    quantity: '100',
    application_details: '',
    drawing_notes: '',
    estimated_cost: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        material: selectedProduct.material_grades || prev.material,
        shore_hardness: selectedProduct.shore_hardness?.split(' ')[0] || prev.shore_hardness,
        drawing_notes: `Inquiry regarding: ${selectedProduct.name}`
      }));
    }
  }, [selectedProduct]);

  useEscapeKey(isOpen, () => {
    setSubmitted(false);
    onClose();
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      if (onToast) onToast('Please fill in your name, email, and phone number.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await submitQuoteRequest(formData);
      if (res.success) {
        setSubmitted(true);
        if (onToast) onToast('Quote request submitted successfully!', 'success');
      } else {
        if (onToast) onToast(res.message || 'Failed to submit quote.', 'error');
      }
    } catch (err) {
      console.error(err);
      if (onToast) onToast('Failed to submit quote request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-label="Request engineering quotation" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow" style={{ marginBottom: '4px', fontSize: '11px' }}>
              ONLINE RFQ CALCULATOR
            </span>
            <h2 style={{ fontSize: '24px', color: 'var(--navy-deep)' }}>
              Request Engineering Quotation
            </h2>
          </div>
          <button className="modal-close" onClick={resetAndClose} aria-label="Close quote modal">
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle size={56} color="#28a745" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Quotation Request Received!</h3>
            <p style={{ color: 'var(--steel)', fontSize: '15px', maxWidth: '440px', margin: '0 auto 24px' }}>
              Thank you, <strong>{formData.name}</strong>. Our senior polymer engineers will review your drawings &amp; technical specs and revert with a detailed commercial quote within 24 hours.
            </p>
            <button type="button" className="btn btn-primary" onClick={resetAndClose}>
              Back to Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quote-name">Full Name *</label>
                <input 
                  id="quote-name"
                  type="text" 
                  name="name" 
                  className="form-input" 
                  placeholder="e.g. Rajesh Patel" 
                  value={formData.name} 
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="quote-email">Email Address *</label>
                <input 
                  id="quote-email"
                  type="email" 
                  name="email" 
                  className="form-input" 
                  placeholder="name@company.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quote-phone">Phone / WhatsApp Number *</label>
                <input 
                  id="quote-phone"
                  type="tel" 
                  name="phone" 
                  className="form-input" 
                  placeholder="+91 98765 43210" 
                  value={formData.phone} 
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="quote-company">Company / Plant Name</label>
                <input 
                  id="quote-company"
                  type="text" 
                  name="company" 
                  className="form-input" 
                  placeholder="e.g. ABC Petrochem Ltd." 
                  value={formData.company} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quote-material">Polymer / Elastomer Material</label>
                <select 
                  id="quote-material"
                  name="material" 
                  className="form-select" 
                  value={formData.material} 
                  onChange={handleChange}
                >
                  <option value="Cast Polyurethane (PU)">Cast Polyurethane (PU)</option>
                  <option value="Virgin PTFE / Glass Filled PTFE">Virgin PTFE / Glass Filled PTFE</option>
                  <option value="NBR / Nitrile Rubber">NBR / Nitrile Rubber (Oil Proof)</option>
                  <option value="EPDM Rubber">EPDM Rubber (Weather / Steam)</option>
                  <option value="Silicone (Food / FDA / Pharma)">Silicone (Food / FDA / Pharma)</option>
                  <option value="Viton / FKM (High Temperature Chemical)">Viton / FKM (High Temp Chemical)</option>
                  <option value="FFKM (Perfluoroelastomer)">FFKM (Perfluoroelastomer Ultra-Grade)</option>
                  <option value="Nylon 6 / POM Delrin">Nylon 6 / POM Delrin (Machined)</option>
                  <option value="High Temp Fireproof Fabric (1400°C)">High Temp Fireproof Fabric (1400°C)</option>
                  <option value="Custom Compound (To Drawing/Sample)">Custom Compound (To Drawing/Sample)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quote-shore-hardness">Shore Hardness / Durometer</label>
                <select 
                  id="quote-shore-hardness"
                  name="shore_hardness" 
                  className="form-select" 
                  value={formData.shore_hardness} 
                  onChange={handleChange}
                >
                  <option value="25A–40A">25A–40A (Super Soft Elastomer)</option>
                  <option value="50A–65A">50A–65A (Medium Soft)</option>
                  <option value="70A–80A">70A–80A (Standard Industrial Rubber)</option>
                  <option value="85A–95A">85A–95A (Heavy Load PU / Polyurethane)</option>
                  <option value="55D–65D">55D–65D (Rigid PTFE / Semi-Hard Polymer)</option>
                  <option value="80D–90D">80D–90D (Hard Engineering Plastic / POM)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quote-quantity">Estimated Quantity (Nos / Meters / Sets)</label>
                <input 
                  id="quote-quantity"
                  type="text" 
                  name="quantity" 
                  className="form-input" 
                  placeholder="e.g. 50 pcs / 100 sets / 500 pcs" 
                  value={formData.quantity} 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="quote-application-details">Target Working Temperature &amp; Medium</label>
                <input 
                  id="quote-application-details"
                  type="text" 
                  name="application_details" 
                  className="form-input" 
                  placeholder="e.g. Hydraulic oil, 120°C, 350 bar" 
                  value={formData.application_details} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quote-drawing-notes">Drawing Details / Custom Spec Notes</label>
              <textarea 
                id="quote-drawing-notes"
                name="drawing_notes" 
                rows="3" 
                className="form-textarea" 
                placeholder="Mention dimensions (OD, ID, Thickness), sample availability, or reverse engineering notes..."
                value={formData.drawing_notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <span className="mono" style={{ fontSize: '12px', color: 'var(--steel)' }}>
                ⚡ Fast turnaround: 24h quote SLA
              </span>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                <Send size={15} /> {loading ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
