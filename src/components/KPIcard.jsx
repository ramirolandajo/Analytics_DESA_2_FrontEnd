import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { cn, formatCurrency, formatNumber } from '../services/utils/formatters.js';

/**
 * Executive-friendly KPI card with smooth animation and delta indicator.
 */
const KPIcard = ({ label, value, delta, deltaLabel, icon: Icon, isCurrency, href }) => {
  const isNegative = typeof delta === 'number' && delta < 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-shadow rounded-2xl bg-white p-6 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-brand-primary dark:text-brand-soft">
            {isCurrency ? formatCurrency(value) : formatNumber(value)}
          </p>
        </div>
        {Icon ? (
          <div className="rounded-full bg-brand-accent/10 p-3 text-brand-accent">
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
      </div>
      {typeof delta === 'number' ? (
        <div
          className={cn(
            'mt-4 flex items-center text-sm font-medium',
            isNegative ? 'text-red-500' : 'text-emerald-500'
          )}
        >
          {isNegative ? (
            <ArrowDownRight className="mr-1 h-4 w-4" />
          ) : (
            <ArrowUpRight className="mr-1 h-4 w-4" />
          )}
          <span>{Math.abs(delta).toFixed(1)}%</span>
          {deltaLabel ? <span className="ml-2 text-slate-500 dark:text-slate-400">{deltaLabel}</span> : null}
        </div>
      ) : null}
      {href ? (
        <a
          href={href}
          className="mt-6 inline-flex items-center text-sm font-semibold text-brand-accent hover:text-brand-primary"
        >
          Ver más
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </a>
      ) : null}
    </motion.article>
  );
};

KPIcard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  delta: PropTypes.number,
  deltaLabel: PropTypes.string,
  icon: PropTypes.elementType,
  isCurrency: PropTypes.bool,
  href: PropTypes.string
};

export default KPIcard;
