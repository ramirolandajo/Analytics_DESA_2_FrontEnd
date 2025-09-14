import { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getDailySales } from '../api.js';
import { getBaseChartOptions } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DailySalesChart() {
  const [sales, setSales] = useState([]);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getDailySales().then((res) => setSales(res.data || []));
  }, []);

  const chartData = {
    labels: sales.map((s) => s.date),
    datasets: [
      {
        label: 'Ventas',
        data: sales.map((s) => s.cantidadVentas),
        borderColor: '#3b82f6',
        fill: false,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Ventas diarias</h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="daily-sales" />
      </div>
      <div className="h-80">
        <Line ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
