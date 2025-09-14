import { useEffect, useState, useRef } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { getCorrelation } from '../api.js';
import { getBaseChartOptions } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function SalesCorrelationChart() {
  const [regression, setRegression] = useState(null);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getCorrelation().then((res) => setRegression(res.regression));
  }, []);

  if (!regression) return <div className="card">Cargando correlación...</div>;

  const points = Array.from({ length: 10 }, (_, i) => ({ x: i, y: regression.a * i + regression.b }));

  const chartData = {
    datasets: [
      {
        label: 'Tendencia',
        data: points,
        showLine: true,
        borderColor: '#3b82f6',
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Predicción de ventas por producto</h2>
        <ChartActions chartRef={chartRef} data={{ labels: points.map((p) => p.x), datasets: chartData.datasets }} fileName="sales-correlation" />
      </div>
      <div className="h-80">
        <Scatter ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
