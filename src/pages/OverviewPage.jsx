import React from 'react';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  CheckCircle2,
  Users,
  PackageCheck,
  ReceiptText
} from 'lucide-react';
import {
  getDailySales,
  getLowStock,
  getSalesSummary,
  getSalesTrend
} from '../services/analyticsService.js';
import { usePeriod } from '../contexts/PeriodContext.jsx';
import KPIcard from '../components/KPIcard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { evaluateLowStockAlert, evaluateRevenueAlert } from '../services/utils/alertLogic.js';
import { formatCurrency, formatDate } from '../services/utils/formatters.js';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line
} from 'recharts';

const kpiIcons = [DollarSign, CheckCircle2, Users, PackageCheck, ReceiptText];

/**
 * Executive overview page aggregating KPIs, sales trends and alerts.
 */
const OverviewPage = () => {
  const { params } = usePeriod();

  const summaryQuery = useQuery({ queryKey: ['sales-summary', params.startDate, params.endDate], queryFn: () => getSalesSummary(params).then((res) => res.data) });
  const trendQuery = useQuery({ queryKey: ['sales-trend', params.startDate, params.endDate], queryFn: () => getSalesTrend(params).then((res) => res.data) });
  const dailyQuery = useQuery({ queryKey: ['daily-sales', params.startDate, params.endDate], queryFn: () => getDailySales(params).then((res) => res.data) });
  const lowStockQuery = useQuery({ queryKey: ['low-stock'], queryFn: () => getLowStock().then((res) => res.data) });

  const revenueAlert = useMemo(() => {
    if (!summaryQuery.data) return null;
    return evaluateRevenueAlert({
      currentRevenue: summaryQuery.data?.currentRevenue,
      previousRevenue: summaryQuery.data?.previousRevenue
    });
  }, [summaryQuery.data]);

  const lowStockAlert = useMemo(() => evaluateLowStockAlert(lowStockQuery.data), [lowStockQuery.data]);

  const alerts = [revenueAlert, lowStockAlert].filter(Boolean);

  const summaryMetrics = useMemo(() => {
    const summary = summaryQuery.data || {};
    const currentRevenue = summary.facturacionTotal ?? 0;
    const confirmedSales = summary.totalVentas ?? 0;
    const activeCustomers = summary.clientesActivos ?? 0;
    const unitsSold = summary.productosVendidos ?? 0;
    const averageTicket = summary.totalVentas > 0 ? summary.facturacionTotal / summary.totalVentas : 0;

    // Since backend doesn't provide deltas, set to null
    const computeDelta = () => null;

    return [
      {
        label: 'Ingresos del período',
        value: currentRevenue,
        delta: computeDelta(),
        deltaLabel: 'vs período anterior',
        type: 'currency',
        href: '/overview'
      },
      {
        label: 'Ventas confirmadas',
        value: confirmedSales,
        delta: computeDelta(),
        deltaLabel: 'Órdenes completadas',
        href: '/productos'
      },
      {
        label: 'Clientes activos',
        value: activeCustomers,
        delta: computeDelta(),
        deltaLabel: 'Base activa',
        href: '/clientes'
      },
      {
        label: 'Unidades vendidas',
        value: unitsSold,
        delta: computeDelta(),
        deltaLabel: 'vs período anterior',
        href: '/productos'
      },
      {
        label: 'Ticket promedio',
        value: averageTicket,
        delta: computeDelta(),
        deltaLabel: 'Promedio por orden',
        type: 'currency',
        href: '/overview'
      }
    ];
  }, [summaryQuery.data]);

  const trendData = useMemo(() => {
    if (!trendQuery.data?.current) return [];
    return trendQuery.data.current.map(item => ({
      period: item.date,
      revenue: item.facturacion
    }));
  }, [trendQuery.data]);

  const dailyData = useMemo(() => {
    if (!dailyQuery.data?.data) return [];
    return dailyQuery.data.data.map(item => ({
      date: item.date,
      revenue: item.facturacion,
      averageTicket: item.facturacion / item.ventas
    }));
  }, [dailyQuery.data]);

  if ([summaryQuery, trendQuery, dailyQuery].some((query) => query.isLoading)) {
    return <Loader />;
  }

  if ([summaryQuery, trendQuery, dailyQuery].some((query) => query.isError)) {
    return <ErrorMessage onRetry={() => { summaryQuery.refetch(); trendQuery.refetch(); dailyQuery.refetch(); }} />;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-brand-soft">Resumen Ejecutivo</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Indicadores clave del desempeño comercial del período actual.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {summaryMetrics.map((metric, index) => (
            <KPIcard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              delta={metric.delta}
              deltaLabel={metric.deltaLabel}
              icon={kpiIcons[index] || kpiIcons[0]}
              isCurrency={metric.type === 'currency'}
              href={metric.href}
            />
          ))}
        </div>
      </section>

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertBanner key={alert.title} {...alert} />
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Tendencia de facturación"
          description="Desempeño de ingresos en el período seleccionado."
          action={<Link to="/productos">Ver detalle de productos</Link>}
        >
          <div className="h-72 min-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={Array.isArray(trendData) ? trendData : []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} width={120} stroke="#94a3b8" />
                <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(label) => `Período: ${label}`} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Pulso diario"
          description="Ingresos y tickets promedio por día."
          action={<Link to="/overview">Actualizar filtros</Link>}
        >
          <div className="h-72 min-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.isArray(dailyData) ? dailyData : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} stroke="#94a3b8" />
                <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value)} stroke="#3b82f6" width={110} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}` } stroke="#1e293b" width={80} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Ingresos' : 'Tickets promedio'
                  ]}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={false} yAxisId="left" />
                <Line type="monotone" dataKey="averageTicket" stroke="#1e293b" strokeWidth={2} dot={false} yAxisId="right" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default OverviewPage;
