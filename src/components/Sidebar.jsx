import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { BarChart3, Boxes, Users, ShoppingBag, Activity, MoonStar, Sun, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import PeriodSelector from './PeriodSelector.jsx';

const navItems = [
  { to: '/overview', label: 'Resumen Ejecutivo', icon: BarChart3 },
  { to: '/stock', label: 'Stock', icon: Boxes },
  { to: '/productos', label: 'Productos', icon: ShoppingBag },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/eventos', label: 'Eventos', icon: Activity },
  { to: '/ai-chat', label: 'Chat IA', icon: Bot },
];

const Sidebar = ({ isDark, onToggleDark }) => (
  <aside className="hidden min-h-screen w-72 flex-col bg-white/80 px-6 py-10 shadow-xl dark:bg-slate-950/60 lg:flex">
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">E-commerce</p>
          <h1 className="mt-2 text-2xl font-bold text-brand-primary dark:text-brand-soft">Analítica Ejecutiva</h1>
        </div>
        <button
          type="button"
          onClick={onToggleDark}
          className="rounded-full bg-brand-accent/10 p-2 text-brand-accent transition hover:bg-brand-accent/20"
          aria-label="Alternar modo oscuro"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </button>
      </div>
      {/* Period selector rendered here so it applies globally */}
      <PeriodSelector />
      <nav className="mt-12 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/30'
                  : 'text-slate-500 hover:bg-brand-accent/10 hover:text-brand-primary dark:text-slate-400'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  </aside>
);

Sidebar.propTypes = {
  isDark: PropTypes.bool.isRequired,
  onToggleDark: PropTypes.func.isRequired
};

export default Sidebar;
