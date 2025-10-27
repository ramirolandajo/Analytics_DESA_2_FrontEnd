import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Wrapper for charts, ensuring consistent styling and executive-friendly layout.
 */
const ChartCard = ({ title, description, action, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.45 }}
    className="card-shadow rounded-2xl bg-white p-6 dark:bg-slate-900"
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-brand-primary dark:text-brand-soft">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        ) : null}
      </div>
      {action ? <div className="text-sm text-brand-accent">{action}</div> : null}
    </div>
    <div className="mt-6 overflow-x-auto">{children}</div>
  </motion.section>
);

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node.isRequired
};

export default ChartCard;
