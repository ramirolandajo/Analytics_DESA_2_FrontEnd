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
import { getCategoryGrowth, getAllProductsData } from '../api.js';
import { getBaseChartOptions } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CategoryGrowthChart() {
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [growth, setGrowth] = useState({});
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getAllProductsData().then((data) => {
      setCategories(data.categories || []);
      if (data.categories?.length) {
        setCategoryId(data.categories[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (categoryId) {
      getCategoryGrowth(categoryId).then((res) =>
        setGrowth(res.categoryGrowth || {}),
      );
    }
  }, [categoryId]);

  const labels = Object.keys(growth);
  const values = Object.values(growth);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Ventas',
        data: values,
        borderColor: '#ec4899',
        fill: false,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="card-title mb-0">Crecimiento por categoría</h2>
        <ChartActions chartRef={chartRef} data={chartData} fileName="category-growth" />
      </div>
      <div className="mb-3 max-w-xs">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="input"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="h-80">
        <Line ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
