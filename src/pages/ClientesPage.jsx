import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getTopCustomers
} from '../services/analyticsService.js';
import ChartCard from '../components/ChartCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatCurrency, formatNumber } from '../services/utils/formatters.js';

/**
 * Customer analytics page highlighting loyalty and risk signals.
 */
const ClientesPage = () => {
  const topCustomersQuery = useQuery({ queryKey: ['top-customers'], queryFn: () => getTopCustomers() });

  const topCustomers = Array.isArray(topCustomersQuery.data) ? topCustomersQuery.data : [];

  if ([topCustomersQuery].some((query) => query.isLoading)) {
    return <Loader />;
  }

  if ([topCustomersQuery].some((query) => query.isError)) {
    return (
      <ErrorMessage
        onRetry={() => {
          topCustomersQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-brand-soft">Analítica de clientes</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Fidelización, valor y señales de riesgo para acciones proactivas.
        </p>
      </header>

      <ChartCard
        title="Clientes más valiosos"
        description="Top clientes por facturación acumulada."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-brand-soft/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Ingresos</th>
                <th className="px-6 py-3">Órdenes</th>
                <th className="px-6 py-3">Ticket promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {topCustomers.map((customer) => (
                <tr key={customer.customerId}>
                  <td className="px-6 py-4 font-semibold">{customer.customerName || customer.customerId}</td>
                  <td className="px-6 py-4">{formatCurrency(customer.revenue)}</td>
                  <td className="px-6 py-4">{formatNumber(customer.orders)}</td>
                  <td className="px-6 py-4">{formatCurrency(customer.averageTicket)}</td>
                </tr>
              ))}
              {topCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                    No hay clientes destacados registrados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default ClientesPage;
