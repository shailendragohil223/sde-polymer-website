import React from 'react';
import { MessageSquare, Phone, Mail } from 'lucide-react';

export default function CtaBand({ siteInfo, onOpenQuote }) {
  const settings = siteInfo?.settings || {};

  return (
    <section className="cta-band">
      <div className="inner">
        <h2>Need an O-Ring, PTFE Component, PU Wheel, or Custom Rubber Part?</h2>
        <p>
          Get a Quotation Within 24 Hours — share your drawing, sample or spec and our engineers will get back to you.
        </p>
        <div className="cta-actions">
          <a 
            href={`https://wa.me/${settings.whatsapp_number || '919924314732'}`} 
            className="btn btn-orange"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <MessageSquare size={16} /> WhatsApp
          </a>
          <a href={`tel:${settings.primary_phone || '+919924314732'}`} className="btn btn-teal">
            <Phone size={16} /> Call Us
          </a>
          <button 
            type="button" 
            onClick={() => onOpenQuote()} 
            className="btn btn-ghost"
          >
            <Mail size={16} /> Request RFQ
          </button>
        </div>
      </div>
    </section>
  );
}
