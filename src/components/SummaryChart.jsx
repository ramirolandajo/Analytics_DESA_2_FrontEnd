import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { getSummary } from '../api.js';
import { getBaseChartOptions, getPalette } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

export default function SummaryChart() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getSummary('2024-01-01T00:00:00', '2024-06-01T23:59:59')
      .then(setData)
      .catch(() => setError('No se pudo cargar el resumen'));
  }, []);

  if (error) {
    return <div className="card">{error}</div>;
  }

  if (!data) return <div className="card">Cargando resumen...</div>;

  const labels = ['Facturación', 'Ventas', 'Productos'];
  const values = [data.facturacionTotalEnMiles, data.totalVentas, data.productosVendidos];
  const colors = getPalette(values.length);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Resumen',
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Resumen de ventas</h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="summary" />
      </div>
      <div className="h-80">
        <Bar ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
