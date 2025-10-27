import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import {
  getTopBrands,
  getTopCategories,
  getTopProducts
} from '../services/analyticsService.js';
import { usePeriod } from '../contexts/PeriodContext.jsx';
import ChartCard from '../components/ChartCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatCurrency, formatNumber } from '../services/utils/formatters.js';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList
} from 'recharts';

const palette = ['#1e293b', '#3b82f6', '#0ea5e9', '#6366f1', '#22d3ee', '#14b8a6'];

/**
 * Product analytics page with ranking and performance indicators.
 */
const ProductosPage = () => {
  const { params } = usePeriod();
  const topProductsQuery = useQuery({ queryKey: ['top-products', params.startDate, params.endDate], queryFn: () => getTopProducts(params) });
  const topCategoriesQuery = useQuery({ queryKey: ['top-categories', params.startDate, params.endDate], queryFn: () => getTopCategories(params) });
  const topBrandsQuery = useQuery({ queryKey: ['top-brands', params.startDate, params.endDate], queryFn: () => getTopBrands(params) });

  const topProducts = Array.isArray(topProductsQuery.data) ? topProductsQuery.data : [];
  const topCategories = Array.isArray(topCategoriesQuery.data) ? topCategoriesQuery.data : [];
  const topBrands = Array.isArray(topBrandsQuery.data) ? topBrandsQuery.data : [];


  // Map topProducts to expected format
  const mappedTopProducts = topProducts.map(p => ({
    productCode: p.productCode,
    revenue: p.cantidadVendida,
    productName: p.title,
    name: (p.title || p.productId.toString()).length > 15 ? (p.title || p.productId.toString()).substring(0, 15) + '...' : (p.title || p.productId.toString())
  }));

  if ([topProductsQuery, topCategoriesQuery, topBrandsQuery].some((query) => query.isLoading)) {
    return <Loader />;
  }

  if ([topProductsQuery, topCategoriesQuery, topBrandsQuery].some((query) => query.isError)) {
    return (
      <ErrorMessage
        onRetry={() => {
          topProductsQuery.refetch();
          topCategoriesQuery.refetch();
          topBrandsQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-brand-soft">Desempeño de productos</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Identifique oportunidades de crecimiento y riesgos en el catálogo.
        </p>
      </header>

      <div className="space-y-6">
        <ChartCard
          title="Top productos por cantidad vendida"
          description="Ranking de productos con mayor cantidad vendida."
        >
          <div className="h-80 min-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mappedTopProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="category"
                  dataKey="name"
                />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip
                  formatter={(value, _, payload) => [`Cantidad vendida: ${formatNumber(value)}`, `Producto: ${payload.payload.productName || payload.payload.productCode}`]}
                  contentStyle={{ borderRadius: 12 }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {mappedTopProducts.map((entry, index) => (
                    <Cell key={entry.productCode} fill={palette[index % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {mappedTopProducts.map((product) => (
              <li key={product.productCode} className="flex items-center justify-between">
                <span>
                  {product.productName || product.productCode}
                  <span className="ml-2 text-xs text-slate-500">{formatNumber(product.revenue)}</span>
                </span>
                <a
                  href={`/productos/${product.productCode}`}
                  className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-primary"
                >
                  Ver ficha
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Top categorías" description="Participación por cantidad vendida por línea de producto.">
          <div className="h-80 min-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topCategories} dataKey="cantidadVendida" nameKey="category" outerRadius={120}>
                  {topCategories.map((entry, index) => (
                    <Cell key={entry.category} fill={palette[index % palette.length]} />
                  ))}
                  <LabelList dataKey="cantidadVendida" position="inside" formatter={(value) => formatNumber(value)} />
                </Pie>
                <Tooltip formatter={(value, name) => [`Cantidad vendida: ${formatNumber(value)}`, `Categoría: ${name}`]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Top marcas" description="Contribución por cantidad vendida por marca.">
          <div className="h-72 min-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBrands}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="brand" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => formatNumber(value)} width={100} />
                <Tooltip formatter={(value, name) => [`Cantidad vendida: ${formatNumber(value)}`, `Marca: ${name}`]} />
                <Bar dataKey="cantidadVendida" fill="#1e293b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default ProductosPage;
