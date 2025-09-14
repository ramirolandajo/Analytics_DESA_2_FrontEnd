import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Init from localStorage or system preference
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const enableDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', enableDark);
    setIsDark(enableDark);
    // Notificar a los gráficos
    window.dispatchEvent(new Event('themechange'));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-ghost"
      aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
      aria-pressed={isDark}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
    >
      <span className="inline-block w-4 h-4">
        {isDark ? (
          // Sun icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12m0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1m-7-7a1 1 0 0 1-1-1H3a1 1 0 1 1 0-2h1a1 1 0 1 1 2 0H5a1 1 0 0 1-1 1m15 0a1 1 0 0 1-1-1h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 2 0h-1a1 1 0 0 1-1 1m-3.95 6.364a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414m-8.486 0a1 1 0 0 1 0-1.414l.707-.707A1 1 0 0 1 7.03 17.9l-.707.707a1 1 0 0 1-1.414 0m10.607-12.021a1 1 0 0 1 0 1.414l-.707.707A1 1 0 1 1 13.03 7.95l.707-.707a1 1 0 0 1 1.414 0M5.444 5.444a1 1 0 0 1 1.414 0l.707.707A1 1 0 1 1 6.15 7.565l-.707-.707a1 1 0 0 1 0-1.414"/></svg>
        ) : (
          // Moon icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Claro' : 'Oscuro'}</span>
    </button>
  );
}
