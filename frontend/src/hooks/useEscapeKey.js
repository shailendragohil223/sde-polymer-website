import { useEffect } from 'react';

// Calls onEscape when the Escape key is pressed while `active` is true
export default function useEscapeKey(active, onEscape) {
  useEffect(() => {
    if (!active) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, onEscape]);
}
