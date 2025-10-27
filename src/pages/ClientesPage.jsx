import React from 'react';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import {
  getAtRiskCustomers,
  getSalesCorrelation,
  getTopCustomers
} from '../services/analyticsService.js';
import { usePeriod } from '../contexts/PeriodContext.jsx';
import ChartCard from '../components/ChartCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import { evaluateAtRiskCustomersAlert } from '../services/utils/alertLogic.js';
import { formatCurrency, formatNumber } from '../services/utils/formatters.js';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/**
 * Customer analytics page highlighting loyalty and risk signals.
 */
const ClientesPage = () => {
  const { params } = usePeriod();

  const topCustomersQuery = useQuery({ queryKey: ['top-customers'], queryFn: () => getTopCustomers() });
  // const atRiskCustomersQuery = useQuery({ queryKey: ['at-risk-customers', params.startDate, params.endDate], queryFn: () => getAtRiskCustomers(params).then((res) => res.data) });
  const correlationQuery = useQuery({ queryKey: ['sales-correlation'], queryFn: () => getSalesCorrelation() });

  const topCustomers = Array.isArray(topCustomersQuery.data) ? topCustomersQuery.data : [];
  // const atRiskCustomers = Array.isArray(atRiskCustomersQuery.data) ? atRiskCustomersQuery.data : [];
  const correlationData = Array.isArray(correlationQuery.data) ? correlationQuery.data : [];

  // console.log('topCustomers:', topCustomers);
  // console.log('correlationData:', correlationData);

  // const alert = useMemo(() => evaluateAtRiskCustomersAlert(atRiskCustomers), [atRiskCustomers]);

  if ([topCustomersQuery, correlationQuery].some((query) => query.isLoading)) {
    return <Loader />;
  }

  if ([topCustomersQuery, correlationQuery].some((query) => query.isError)) {
    return (
      <ErrorMessage
        onRetry={() => {
          topCustomersQuery.refetch();
          correlationQuery.refetch();
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

      {/* {alert ? <AlertBanner {...alert} /> : null} */}

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

      {/* <ChartCard
        title="Clientes en riesgo"
        description="Segmentos que muestran señales de abandono."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-brand-soft/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Última compra</th>
                <th className="px-6 py-3">Ingresos</th>
                <th className="px-6 py-3">Prob. churn</th>
                <th className="px-6 py-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {atRiskCustomers.map((customer) => (
                <tr key={customer.customerId} className="text-red-600 dark:text-red-300">
                  <td className="px-6 py-4 font-semibold">{customer.customerName || customer.customerId}</td>
                  <td className="px-6 py-4">{customer.lastPurchaseDate}</td>
                  <td className="px-6 py-4">{formatCurrency(customer.revenue)}</td>
                  <td className="px-6 py-4">{customer.churnProbability ? `${(customer.churnProbability * 100).toFixed(1)}%` : '-'}</td>
                  <td className="px-6 py-4">
                    <a
                      href={customer.profileUrl || `#/clientes/${customer.customerId}`}
                      className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-primary"
                    >
                      Ver ficha
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
              {atRiskCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                    Sin clientes en riesgo según los criterios actuales.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </ChartCard> */}

      <ChartCard
        title="Productos más vendidos"
        description="Top productos por unidades vendidas."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-brand-soft/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3">Unidades vendidas</th>
                <th className="px-6 py-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {correlationData.map((product) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 font-semibold">{product.title}</td>
                  <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">{formatNumber(product.unitsSold)}</td>
                  <td className="px-6 py-4">
                    <a
                      href={`/productos/${product.productCode}`}
                      className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-primary"
                    >
                      Ver ficha
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
              {correlationData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                    No hay productos vendidos registrados.
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
