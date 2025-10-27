import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loader component with subtle animation to indicate background activity.
 */
const Loader = () => (
  <div className="flex w-full justify-center py-12">
    <motion.div
      className="h-12 w-12 rounded-full border-4 border-brand-accent/40 border-t-brand-accent"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      aria-label="Cargando información"
    />
  </div>
);

export default Loader;
