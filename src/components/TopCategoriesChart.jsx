import { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getTopCategories } from '../api.js';
import { getBaseChartOptions } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TopCategoriesChart() {
  const [categories, setCategories] = useState([]);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getTopCategories().then((res) => setCategories(res.data || []));
  }, []);

  const chartData = {
    labels: categories.map((c) => c.category),
    datasets: [
      {
        label: 'Productos vendidos',
        data: categories.map((c) => c.cantidadVendida),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
          '#14b8a6',
          '#f97316',
          '#4b5563',
          '#22c55e',
        ],
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Categorías más populares</h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="top-categories" />
      </div>
      <div className="h-80">
        <Pie ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
