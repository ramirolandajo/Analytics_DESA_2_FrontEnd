import React from 'react';
import PropTypes from 'prop-types';
import { RefreshCw } from 'lucide-react';

/**
 * Error state encouraging the user to retry fetching information.
 */
const ErrorMessage = ({ onRetry, message = 'No pudimos recuperar la información.' }) => (
  <div className="card-shadow flex flex-col items-center justify-center rounded-2xl bg-white p-10 text-center dark:bg-slate-900">
    <p className="text-lg font-semibold text-red-500">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary"
      >
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </button>
    ) : null}
  </div>
);

ErrorMessage.propTypes = {
  onRetry: PropTypes.func,
  message: PropTypes.string
};

export default ErrorMessage;
