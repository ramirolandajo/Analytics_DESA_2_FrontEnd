import { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { getProductEvents } from '../api.js';
import { getBaseChartOptions } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

export default function ProductEventsTimelineChart() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProductEvents();
      setEvents(res.events || []);
    } catch {
      setError('No se pudieron cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const processed = events.reduce(
    (acc, e) => {
      const date = e.date.substring(0, 10);
      acc.labels.add(date);
      if (!acc.data[e.productTitle]) {
        acc.data[e.productTitle] = {};
      }
      acc.data[e.productTitle][date] = e.newStock;
      return acc;
    },
    { labels: new Set(), data: {} },
  );

  const labels = Array.from(processed.labels).sort();
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

  const datasets = Object.entries(processed.data).map(([product, values], idx) => ({
    label: product,
    data: labels.map((l) => values[l] ?? null),
    borderColor: colors[idx % colors.length],
    fill: false,
  }));

  const chartData = { labels, datasets };

  const chartOptions = {
    ...getBaseChartOptions(),
    scales: {
      x: { title: { display: true, text: 'Fecha' } },
      y: { title: { display: true, text: 'Stock' } },
    },
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">
          Timeline de eventos de productos (cambios de stock)
        </h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="product-events" />
      </div>
      {loading && (
        <div className="flex justify-center p-4">
          <div className="h-8 w-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-700 dark:border-t-gray-200 rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="p-4 text-red-500 animate-pulse">{error}</div>
      )}
      {!loading && !error && (
        <div className="h-96">
          <Line ref={chartRef} key={themeV} data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
