import { useEffect, useState } from 'react';

export default function useThemeVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const handler = () => setV((x) => x + 1);
    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  }, []);
  return v;
}

