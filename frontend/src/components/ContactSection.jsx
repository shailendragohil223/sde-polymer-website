import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { submitContactInquiry } from '../services/api';

export default function ContactSection({ siteInfo, onToast }) {
  const settings = siteInfo?.settings || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      if (onToast) onToast('Please fill in required fields (Name, Email, Message).', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await submitContactInquiry(formData);
      if (res.success) {
        setSubmitted(true);
        if (onToast) onToast('Your message has been sent successfully!', 'success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        if (onToast) onToast(res.message || 'Failed to send message.', 'error');
      }
    } catch (err) {
      console.error(err);
      if (onToast) onToast('Error sending inquiry. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section-wrapper" id="contact">
      <div className="wrap">
        <div className="eyebrow">Get In Touch</div>
        <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', marginBottom: '40px', maxWidth: '640px' }}>
          Consult with our polymer engineering specialists.
        </h2>

        <div className="contact-layout-grid">
          {/* Interactive Form */}
          <div className="form-card">
            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--navy-deep)' }}>
              Send Direct Inquiry
            </h3>
            <p style={{ color: 'var(--steel)', fontSize: '14px', marginBottom: '24px' }}>
              Have an urgent requirement or drawing to consult? Leave your details below.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} color="#28a745" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '18px', marginBottom: '6px' }}>Message Received!</h4>
                <p style={{ color: 'var(--steel)', fontSize: '14px', marginBottom: '18px' }}>
                  Our technical sales desk will reach out shortly.
                </p>
                <button 
                  type="button" 
                  className="btn btn-outline-navy btn-sm"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-input" 
                      placeholder="e.g. Ramesh Shah" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-input" 
                      placeholder="ramesh@company.in" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      className="form-input" 
                      placeholder="+91 99000 00000" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject / Product Line</label>
                    <input 
                      type="text" 
                      name="subject" 
                      className="form-input" 
                      placeholder="e.g. PU Roller Recoating / PTFE Gasket" 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Message / Requirement Details *</label>
                  <textarea 
                    name="message" 
                    rows="4" 
                    className="form-textarea" 
                    placeholder="Tell us about the working pressure, temperature, chemical medium, and quantity..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-orange"
                  disabled={loading}
                >
                  <Send size={15} /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Plant Location & Contact Cards */}
          <div className="contact-info-card">
            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--white)' }}>
              Works &amp; Sales Office
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px' }}>
              {settings.site_name || 'Shree Dipeshwari Engineering'}
            </p>

            <ul className="contact-info-list">
              <li>
                <MapPin size={20} />
                <span>
                  {settings.company_address || 'FF-13, Divine Galaxy, Nr. Lotus Court, Opp. C.M. Patel Farm, Kalali Village Road, Vadodara – 390012, Gujarat'}
                </span>
              </li>
              <li>
                <Phone size={18} />
                <div>
                  <a href={`tel:${settings.primary_phone || '+919924314732'}`} style={{ color: 'var(--white)', display: 'block' }}>
                    {settings.primary_phone_display || '+91 9924 314732'}
                  </a>
                  <a href={`tel:${settings.secondary_phone || '+919313860251'}`} style={{ color: 'rgba(255,255,255,0.85)', display: 'block' }}>
                    {settings.secondary_phone_display || '+91 93138 60251'}
                  </a>
                </div>
              </li>
              <li>
                <Mail size={18} />
                <a href={`mailto:${settings.contact_email || 'shreedipeshwariengg@gmail.com'}`} style={{ color: 'var(--teal-bright)' }}>
                  {settings.contact_email || 'shreedipeshwariengg@gmail.com'}
                </a>
              </li>
              <li>
                <Clock size={18} />
                <span>{settings.working_hours || 'Mon–Sat, 9:30 AM – 7:00 PM'}</span>
              </li>
            </ul>

            <iframe 
              className="map-embed" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Kalali%20Village%20Road%2C%20Vadodara%20390012&t=&z=14&ie=UTF8&iwloc=&output=embed"
              title="SDE Vadodara Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
