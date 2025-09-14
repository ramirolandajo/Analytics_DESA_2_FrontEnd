import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getTopBrands } from '../api.js';
import { getBaseChartOptions, getPalette } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TopBrandsChart() {
  const [brands, setBrands] = useState([]);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getTopBrands().then((res) => setBrands(res.data || []));
  }, []);

  const colors = getPalette(brands.length);
  const chartData = {
    labels: brands.map((b) => b.brand),
    datasets: [
      {
        label: 'Ventas',
        data: brands.map((b) => b.cantidadVendida),
        backgroundColor: colors,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Marcas más vendidas</h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="top-brands" />
      </div>
      <div className="h-80">
        <Bar ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
