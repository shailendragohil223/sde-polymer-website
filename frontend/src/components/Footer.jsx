import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer({ siteInfo, onOpenAdmin }) {
  const settings = siteInfo?.settings || {};

  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <div className="brand">
            <span className="brand-mark">
              <img src="/logo/sde-logo-white.svg" alt="SDE logo" />
            </span>
            <span className="brand-text">
              <span className="name">{settings.site_name || 'Shree Dipeshwari Engineering'}</span>
              <span className="tag">{settings.tagline || 'Complete Polymer Solution'}</span>
            </span>
          </div>
          <p style={{ maxWidth: '340px' }}>
            Manufacturer of rubber moulded parts, O-rings, oil seals, PTFE, PU, nylon &amp; silicone engineering components — Polymers · Hydraulics &amp; Pneumatics · Earth Moving.
          </p>
        </div>

        <div>
          <h4>Contact Information</h4>
          <ul>
            <li style={{ display: 'flex', gap: '8px' }}>
              <MapPin size={16} style={{ flexShrink: 0, marginTop: '4px', color: 'var(--teal-bright)' }} />
              <span>{settings.company_address || 'Kalali Village Road, Vadodara – 390012, Gujarat'}</span>
            </li>
            <li>
              📞 <a href={`tel:${settings.primary_phone || '+919924314732'}`}>
                {settings.primary_phone_display || '+91 9924 314732'}
              </a>
            </li>
            <li>
              📞 <a href={`tel:${settings.secondary_phone || '+919313860251'}`}>
                {settings.secondary_phone_display || '+91 93138 60251'}
              </a>
            </li>
            <li>
              📧 <a href={`mailto:${settings.contact_email || 'shreedipeshwariengg@gmail.com'}`}>
                {settings.contact_email || 'shreedipeshwariengg@gmail.com'}
              </a>
            </li>
            <li>
              🕐 {settings.working_hours || 'Mon–Sat, 9:30 AM – 7:00 PM'}
            </li>
          </ul>
        </div>

        <div>
          <h4>Location &amp; Works</h4>
          <iframe 
            className="map-embed" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Kalali%20Village%20Road%2C%20Vadodara%20390012&t=&z=14&ie=UTF8&iwloc=&output=embed"
            title="SDE Map"
          ></iframe>
        </div>
      </div>

      <div className="wrap foot-bottom">
        <span>&copy; {new Date().getFullYear()} Shree Dipeshwari Engineering. All rights reserved.</span>
        <span>Polymers &middot; Hydraulics &amp; Pneumatics &middot; Earth Moving</span>
      </div>
    </footer>
  );
}
