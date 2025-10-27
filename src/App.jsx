import React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import StockPage from './pages/StockPage.jsx';
import ProductosPage from './pages/ProductosPage.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import EventosPage from './pages/EventosPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AIChatPage from './pages/AIChatPage.jsx';
import { PeriodProvider } from './contexts/PeriodContext.jsx';
import { cn } from './services/utils/formatters.js';

/**
 * Root application shell. Provides layout with sidebar navigation, dark mode toggle
 * and page routing for the analytics module.
 */
const AppLayout = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <PeriodProvider>
      <div className={cn('min-h-screen flex bg-brand-soft text-slate-900 transition-colors', isDark && 'dark:bg-slate-950 dark:text-slate-100')}>
        <Sidebar isDark={isDark} onToggleDark={() => setIsDark((prev) => !prev)} />
        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">
          <Routes>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/productos/:productCode" element={<ProductDetailPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>
    </PeriodProvider>
  );
};

export default function App() {
  return <AppLayout />;
}
