import { useEffect, useState } from 'react';
import { getSummary } from '../api.js';

export default function SummaryCards() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSummary('2024-01-01T00:00:00', '2024-06-01T23:59:59')
      .then(setData)
      .catch(() => setError('No se pudo cargar el resumen'));
  }, []);

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card col-span-1 md:col-span-3">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card animate-pulse col-span-1 md:col-span-3">Cargando...</div>
      </div>
    );
  }

  const cards = [
    { label: 'Facturación (miles)', value: data.facturacionTotalEnMiles.toLocaleString('es-AR') },
    { label: 'Ventas totales', value: data.totalVentas },
    { label: 'Productos vendidos', value: data.productosVendidos },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="card">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{card.label}</div>
          <div className="mt-2 text-2xl font-semibold">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
