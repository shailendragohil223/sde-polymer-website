// Company email addresses shown in the contact section and footer.
// Each can be overridden from site settings (admin) by its setting key.
const CONTACT_EMAILS = [
  { label: 'Info', key: 'info_email', fallback: 'info@shreedipeshwariengg.com' },
  { label: 'Contact', key: 'contact_email', fallback: 'contact@shreedipeshwariengg.com' },
  { label: 'Sales', key: 'sales_email', fallback: 'sales@shreedipeshwariengg.com' }
];

export function getContactEmails(settings = {}) {
  return CONTACT_EMAILS.map(({ label, key, fallback }) => ({
    label,
    address: settings[key] || fallback
  }));
}
