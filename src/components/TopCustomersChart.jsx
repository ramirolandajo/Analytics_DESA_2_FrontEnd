import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getTopCustomers } from '../api.js';
import { getBaseChartOptions, getPalette } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TopCustomersChart() {
  const [customers, setCustomers] = useState([]);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getTopCustomers().then((res) => setCustomers(res.data || []));
  }, []);

  const colors = getPalette(customers.length);
  const chartData = {
    labels: customers.map((c) => c.name),
    datasets: [
      {
        label: 'Gasto total',
        data: customers.map((c) => c.gastoTotal),
        backgroundColor: colors,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Clientes con mayor gasto</h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="top-customers" />
      </div>
      <div className="h-80">
        <Bar ref={chartRef} key={themeV} data={chartData} options={{ ...getBaseChartOptions(), indexAxis: 'y' }} />
      </div>
    </div>
  );
}
