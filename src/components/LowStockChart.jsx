import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getLowStock } from '../api.js';
import { getBaseChartOptions, getPalette } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LowStockChart() {
  const [items, setItems] = useState([]);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getLowStock().then((res) => setItems(res.data || []));
  }, []);

  const colors = getPalette(items.length);
  const chartData = {
    labels: items.map((i) => i.title),
    datasets: [
      {
        label: 'Stock',
        data: items.map((i) => i.stock),
        backgroundColor: colors,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Stock crítico</h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="low-stock" />
      </div>
      <div className="h-80">
        <Bar ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
