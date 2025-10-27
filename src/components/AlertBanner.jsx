import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../services/utils/formatters.js';

/**
 * Alert banner used to draw attention to operational risks.
 */
const AlertBanner = ({ title, description, type = 'info', action }) => {
  const isCritical = type === 'critical';

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'card-shadow flex w-full flex-col gap-3 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between',
        isCritical
          ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-200'
          : 'border-brand-accent/20 bg-brand-accent/10 text-brand-primary dark:border-brand-accent/30 dark:bg-slate-900 dark:text-brand-soft'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 rounded-full bg-white/50 p-2 dark:bg-slate-800">
          {isCritical ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <Info className="h-5 w-5" />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">{title}</p>
          {description ? <p className="mt-1 text-sm">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="text-sm font-medium">{action}</div> : null}
    </motion.div>
  );
};

AlertBanner.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.oneOf(['info', 'critical']),
  action: PropTypes.node
};

export default AlertBanner;
