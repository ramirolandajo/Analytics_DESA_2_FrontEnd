import React from 'react';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, ArrowUpRight } from 'lucide-react';
import { getProductEventsTimeline } from '../services/analyticsService.js';
import { usePeriod } from '../contexts/PeriodContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ChartCard from '../components/ChartCard.jsx';
import { formatDate } from '../services/utils/formatters.js';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

/**
 * Timeline of product-related events for operational visibility.
 */
const EventosPage = () => {
  const { params } = usePeriod();
  const eventsQuery = useQuery({ queryKey: ['product-events-timeline'], queryFn: () => getProductEventsTimeline() });

  const events = Array.isArray(eventsQuery.data) ? eventsQuery.data : [];
  const mappedEvents = events.map(e => ({
    timestamp: e.processedAt,
    type: e.eventType,
    description: e.eventType,
    payload: null
  }));
  const latestEvent = useMemo(() => mappedEvents[0], [mappedEvents]);

  const eventCounts = {};
  mappedEvents.forEach(event => {
    const date = event.timestamp.split('T')[0];
    eventCounts[date] = (eventCounts[date] || 0) + 1;
  });
  const chartData = Object.entries(eventCounts).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));

  if (eventsQuery.isLoading) {
    return <Loader />;
  }

  if (eventsQuery.isError) {
    return <ErrorMessage onRetry={() => eventsQuery.refetch()} />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-brand-soft">Eventos de producto</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Línea de tiempo con lanzamientos, ajustes de precios y novedades operativas.
        </p>
      </header>

      <ChartCard title="Eventos por fecha" description="Cantidad de eventos registrados por día.">
        <div className="h-80 min-w-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Timeline de eventos" description="Secuencia cronológica de eventos registrados.">
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-brand-accent via-brand-accent/40 to-transparent" />
          <ul className="max-h-80 space-y-6 overflow-y-auto pl-12">
            {mappedEvents.map((event) => {
              const isConfirmed = event.type.includes('confirmada');
              const color = isConfirmed ? '#3b82f6' : '#1d4ed8';
              const backgroundColor = isConfirmed ? color : undefined;
              const textColor = isConfirmed ? 'white' : undefined;
              return (
                <li key={`${event.timestamp}-${event.type}`} className="relative rounded-xl border bg-white/70 p-5 shadow-sm dark:bg-slate-900" style={{ borderColor: color, borderWidth: 2, backgroundColor, color: textColor }}>
                  <span className="absolute -left-10 top-5 h-3 w-3 rounded-full shadow-lg" style={{ backgroundColor: color, boxShadow: `0 0 0 4px ${color}40` }} />
                  <p className="text-xs uppercase tracking-wide text-slate-500" style={{ color: textColor ? '#e2e8f0' : undefined }}>{formatDate(event.timestamp)}</p>
                  <h4 className="mt-1 text-lg font-semibold text-brand-primary dark:text-brand-soft" style={{ color: textColor ? 'white' : undefined }}>{event.type}</h4>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400" style={{ color: textColor ? '#e2e8f0' : undefined }}>{event.description}</p>
                  {event.relatedUrl ? (
                    <a
                      href={event.relatedUrl}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent hover:text-brand-primary"
                      style={{ color: textColor ? '#60a5fa' : undefined }}
                    >
                      Ver detalle
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  {event.payload ? (
                    <pre className="mt-3 overflow-auto rounded-lg bg-brand-soft/70 p-3 text-xs text-slate-600 dark:bg-slate-950/30 dark:text-slate-300" style={{ backgroundColor: textColor ? 'rgba(255,255,255,0.1)' : undefined, color: textColor ? '#e2e8f0' : undefined }}>
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  ) : null}
                </li>
              );
            })}
            {mappedEvents.length === 0 ? (
              <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No se han registrado eventos recientes.
              </li>
            ) : null}
          </ul>
        </div>
      </ChartCard>
    </div>
  );
};

export default EventosPage;
