import React from 'react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import {
  getLowStock,
  getStockHistoryByProduct,
  getProducts
} from '../services/analyticsService.js';
import { usePeriod } from '../contexts/PeriodContext.jsx';
import ChartCard from '../components/ChartCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatDate, formatNumber } from '../services/utils/formatters.js';
import { evaluateLowStockAlert } from '../services/utils/alertLogic.js';
import AlertBanner from '../components/AlertBanner.jsx';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

/**
 * Stock monitoring page for the operations team.
 */
const StockPage = () => {
  const { params } = usePeriod();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const lowStockQuery = useQuery({ queryKey: ['low-stock'], queryFn: () => getLowStock().then((res) => res.data) });
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: () => getProducts().then((res) => res.data) });
  const stockHistoryByProductQuery = useQuery({
    queryKey: ['stock-history-product', selectedProduct, params.startDate, params.endDate],
    queryFn: () =>
      selectedProduct
        ? getStockHistoryByProduct(selectedProduct, params).then((res) => res.data)
        : Promise.resolve([]),
    enabled: Boolean(selectedProduct)
  });

  const lowStockAlert = useMemo(() => evaluateLowStockAlert(lowStockQuery.data), [lowStockQuery.data]);

  if (lowStockQuery.isLoading || productsQuery.isLoading || stockHistoryByProductQuery.isLoading) {
    return <Loader />;
  }

  if (lowStockQuery.isError || productsQuery.isError || stockHistoryByProductQuery.isError) {
    return <ErrorMessage onRetry={() => { lowStockQuery.refetch(); productsQuery.refetch(); stockHistoryByProductQuery.refetch(); }} />;
  }

  const lowStockList = Array.isArray(lowStockQuery.data) ? lowStockQuery.data : [];
  const productsList = Array.isArray(productsQuery.data) ? productsQuery.data : [];
  const selectedHistory = Array.isArray(stockHistoryByProductQuery.data?.data)
    ? stockHistoryByProductQuery.data.data
    : [];


  const selectedProductName = productsList.find(p => p.productCode === selectedProduct)?.title || selectedProduct;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-brand-soft">Salud de Inventario</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Seguimiento de productos críticos y evolución histórica de stock.
        </p>
      </header>

      {lowStockAlert ? <AlertBanner {...lowStockAlert} /> : null}

      <section className="card-shadow overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-brand-primary dark:text-brand-soft">Productos con bajo stock</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Los productos con 5 unidades o menos requieren reposición prioritaria.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-brand-soft/80 text-left text-sm font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Stock actual</th>
                <th className="px-6 py-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {lowStockList.map((item) => {
                const isCritical = Number(item.stock) < 3;
                return (
                  <tr
                    key={item.productCode}
                    className={isCritical ? 'bg-red-50/60 text-red-700 dark:bg-red-950/30 dark:text-red-200' : ''}
                  >
                    <td className="px-6 py-4 text-sm font-semibold">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(item.productCode)}
                        className="text-left text-brand-accent hover:underline"
                      >
                        {item.title || item.productCode}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {isCritical ? <AlertTriangle className="h-4 w-4" /> : null}
                        {formatNumber(item.stock)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={`/productos/${item.productCode}`}
                        className="text-brand-accent hover:text-brand-primary"
                      >
                        Ver ficha
                      </a>
                    </td>
                  </tr>
                );
              })}
              {lowStockList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-sm text-slate-500">
                    No hay productos con stock crítico en este momento.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>


      <section className="card-shadow rounded-2xl bg-white p-6 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-brand-primary dark:text-brand-soft mb-4">Seleccionar producto para historial</h3>
        <div className="mb-4">
          <label htmlFor="product-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Producto</label>
          <select
            id="product-select"
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(e.target.value || null)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="">Seleccione un producto</option>
            {productsList.map((product) => (
              <option key={product.productCode} value={product.productCode}>{product.title || product.code}</option>
            ))}
          </select>
        </div>
      </section>

      <ChartCard
        title={selectedProduct ? `Tendencia de stock • ${selectedProductName}` : 'Seleccione un producto'}
        description="Seleccione un producto para visualizar su evolución específica."
      >
        <div className="h-72 min-w-[320px]">
          {selectedProduct ? (
            stockHistoryByProductQuery.isLoading ? (
              <Loader />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} stroke="#94a3b8" />
                  <YAxis tickFormatter={(value) => formatNumber(value)} stroke="#94a3b8" width={80} />
                  <Tooltip
                    formatter={(value) => [formatNumber(value), 'Unidades disponibles']}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Line type="monotone" dataKey="newStock" stroke="#1e293b" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Seleccione un producto para consultar su historial.
            </div>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Productos con bajo stock"
        description="Visualización de los niveles de stock actuales de productos críticos."
      >
        <div className="h-80 min-w-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lowStockList.map(item => ({
              name: (item.title || item.productCode).length > 15 ? (item.title || item.productCode).substring(0, 15) + '...' : (item.title || item.productCode),
              stock: item.stock,
              productCode: item.productCode
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="category" dataKey="name" />
              <YAxis tickFormatter={(value) => formatNumber(value)} />
              <Tooltip
                formatter={(value) => [`Stock: ${formatNumber(value)}`, 'Unidades']}
                labelFormatter={(label) => `Producto: ${label}`}
              />
              <Bar dataKey="stock" fill="#ef4444" radius={[8, 8, 0, 0]}>
                {lowStockList.map((entry, index) => (
                  <Cell key={entry.productCode} fill={Number(entry.stock) < 3 ? '#dc2626' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default StockPage;
