import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getHistogram } from '../api.js';
import { getBaseChartOptions, getPalette } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PurchaseHistogram() {
  const [histogram, setHistogram] = useState({});
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getHistogram().then((res) => setHistogram(res.histogram || {}));
  }, []);

  const labels = Object.keys(histogram);
  const values = Object.values(histogram);
  const colors = getPalette(values.length);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Frecuencia de compras',
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Distribución de frecuencia de compra</h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="purchase-histogram" />
      </div>
      <div className="h-80">
        <Bar ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
