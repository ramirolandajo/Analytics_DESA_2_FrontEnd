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
import { getStockHistory, getAllProductsData } from '../api.js';
import { getBaseChartOptions } from '../chartTheme.js';
import useThemeVersion from '../useThemeVersion.js';
import ChartActions from './ChartActions.jsx';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StockHistoryChart() {
  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const themeV = useThemeVersion();
  const chartRef = useRef(null);

  useEffect(() => {
    getAllProductsData().then((data) => {
      setProducts(data.products || []);
      if (data.products?.length) {
        setProductId(data.products[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (productId) {
      getStockHistory(productId).then((res) => setHistory(res.data || []));
    }
  }, [productId]);

  const chartData = {
    labels: history.map((h) => h.date),
    datasets: [
      {
        label: 'Stock',
        data: history.map((h) => h.newStock),
        borderColor: '#f59e0b',
        fill: false,
      },
    ],
  };

  return (
    <div className="card">
      <h2 className="card-title">Histórico de stock</h2>
      <div className="mb-3 max-w-xs">
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="input"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-end mb-2">
        <ChartActions chartRef={chartRef} data={chartData} fileName="stock-history" />
      </div>
      <div className="h-80">
        <Line ref={chartRef} key={themeV} data={chartData} options={getBaseChartOptions()} />
      </div>
    </div>
  );
}
