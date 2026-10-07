import React from 'react';
import { FileText } from 'lucide-react';

export default function FloatingActions({ siteInfo, onOpenQuote }) {
  const settings = siteInfo?.settings || {};
  const waNumber = settings.whatsapp_number || '919924314732';

  return (
    <>
      <a 
        href={`https://wa.me/${waNumber}`} 
        className="float-wa" 
        aria-label="Chat on WhatsApp" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.92C21.96 6.45 17.5 2 12.04 2zm5.83 14.1c-.25.7-1.44 1.34-1.98 1.42-.5.08-1.13.11-1.83-.12-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.25.6.85 2.08.92 2.23.07.15.12.33.02.53-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.24.66-.15.27.1 1.71.81 2 .96.29.15.48.22.55.35.07.13.07.75-.18 1.45z"/>
        </svg>
      </a>

      <div className="sticky-quote">
        <button 
          type="button" 
          onClick={() => onOpenQuote()} 
          className="btn btn-primary"
        >
          <FileText size={16} /> Request a Quote
        </button>
      </div>
    </>
  );
}
