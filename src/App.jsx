import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import TopProductsChart from './components/TopProductsChart.jsx';
import TopCategoriesChart from './components/TopCategoriesChart.jsx';
import TopBrandsChart from './components/TopBrandsChart.jsx';
import DailySalesChart from './components/DailySalesChart.jsx';
import StockHistoryChart from './components/StockHistoryChart.jsx';
import LowStockChart from './components/LowStockChart.jsx';
import StockHistoryByProductChart from './components/StockHistoryByProductChart.jsx';
import TopCustomersChart from './components/TopCustomersChart.jsx';
import PurchaseHistogram from './components/PurchaseHistogram.jsx';
import SalesCorrelationChart from './components/SalesCorrelationChart.jsx';
import CategoryGrowthChart from './components/CategoryGrowthChart.jsx';
import ProductEventsTimelineChart from './components/ProductEventsTimelineChart.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link-active' : ''}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-800/60 overflow-y-auto">
          <div className="px-4 py-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Analítica</div>
          <nav className="px-2 py-2 space-y-1">
            <div className="px-2 py-1 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Gráficos</div>
            <NavLink className={linkClass} to="/">Resumen</NavLink>
            <NavLink className={linkClass} to="/top-products">Top productos</NavLink>
            <NavLink className={linkClass} to="/top-categories">Top categorías</NavLink>
            <NavLink className={linkClass} to="/top-brands">Top marcas</NavLink>
            <NavLink className={linkClass} to="/daily-sales">Ventas diarias</NavLink>
            <NavLink className={linkClass} to="/stock-history">Historial de stock</NavLink>
            <NavLink className={linkClass} to="/low-stock">Stock bajo</NavLink>
            <NavLink className={linkClass} to="/stock-history-by-product">Stock por producto</NavLink>
            <NavLink className={linkClass} to="/top-customers">Top clientes</NavLink>
            <NavLink className={linkClass} to="/purchase-histogram">Histograma de compras</NavLink>
            <NavLink className={linkClass} to="/sales-correlation">Correlación de ventas</NavLink>
            <NavLink className={linkClass} to="/category-growth">Crecimiento por categoría</NavLink>
            <NavLink className={linkClass} to="/product-events">Eventos de producto</NavLink>
          </nav>
        </aside>

        {/* Drawer móvil */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden" aria-modal="true" role="dialog">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200/60 dark:border-gray-800/60 shadow-lg transform transition-transform duration-200 translate-x-0">
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analítica</div>
                <button className="btn-icon" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">✕</button>
              </div>
              <nav className="px-2 py-2 space-y-1" onClick={() => setMobileOpen(false)}>
                <div className="px-2 py-1 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Gráficos</div>
                <NavLink className={linkClass} to="/">Resumen</NavLink>
                <NavLink className={linkClass} to="/top-products">Top productos</NavLink>
                <NavLink className={linkClass} to="/top-categories">Top categorías</NavLink>
                <NavLink className={linkClass} to="/top-brands">Top marcas</NavLink>
                <NavLink className={linkClass} to="/daily-sales">Ventas diarias</NavLink>
                <NavLink className={linkClass} to="/stock-history">Historial de stock</NavLink>
                <NavLink className={linkClass} to="/low-stock">Stock bajo</NavLink>
                <NavLink className={linkClass} to="/stock-history-by-product">Stock por producto</NavLink>
                <NavLink className={linkClass} to="/top-customers">Top clientes</NavLink>
                <NavLink className={linkClass} to="/purchase-histogram">Histograma de compras</NavLink>
                <NavLink className={linkClass} to="/sales-correlation">Correlación de ventas</NavLink>
                <NavLink className={linkClass} to="/category-growth">Crecimiento por categoría</NavLink>
                <NavLink className={linkClass} to="/product-events">Eventos de producto</NavLink>
              </nav>
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 dark:supports-[backdrop-filter]:bg-gray-950/60 dark:bg-gray-950/90 border-b border-gray-200/60 dark:border-gray-800">
            <div className="flex items-center justify-between gap-3 px-4 md:px-6 h-14">
              <div className="flex items-center gap-2">
                <button className="btn-icon md:hidden" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Panel de Analíticas</h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 space-y-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/top-products" element={<TopProductsChart />} />
              <Route path="/top-categories" element={<TopCategoriesChart />} />
              <Route path="/top-brands" element={<TopBrandsChart />} />
              <Route path="/daily-sales" element={<DailySalesChart />} />
              <Route path="/stock-history" element={<StockHistoryChart />} />
              <Route path="/low-stock" element={<LowStockChart />} />
              <Route path="/stock-history-by-product" element={<StockHistoryByProductChart />} />
              <Route path="/top-customers" element={<TopCustomersChart />} />
              <Route path="/purchase-histogram" element={<PurchaseHistogram />} />
              <Route path="/sales-correlation" element={<SalesCorrelationChart />} />
              <Route path="/category-growth" element={<CategoryGrowthChart />} />
              <Route path="/product-events" element={<ProductEventsTimelineChart />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
