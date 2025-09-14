export function getBaseChartOptions() {
  const isDark = document.documentElement.classList.contains('dark');
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(148,163,184,0.2)' : 'rgba(100,116,139,0.2)';
  const nf = new Intl.NumberFormat('es-AR');

  return {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: axisColor },
      },
      tooltip: {
        callbacks: {
          label(ctx) {
            const dsLabel = ctx.dataset?.label ? `${ctx.dataset.label}: ` : '';
            const v = (ctx.parsed?.y ?? ctx.parsed) ?? ctx.raw;
            return dsLabel + (typeof v === 'number' ? nf.format(v) : v);
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: axisColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: {
          color: axisColor,
          callback: (value) => (typeof value === 'number' ? nf.format(value) : value),
        },
        grid: { color: gridColor },
      },
    },
  };
}

// Paleta de colores agradable para dashboards (12 tonos variados)
const BASE_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#22c55e', // green-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#eab308', // yellow-500
];

export function getPalette(n) {
  // Devuelve un array de n colores, ciclando si hace falta
  if (!n || n <= 0) return [];
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = BASE_COLORS[i % BASE_COLORS.length];
  return out;
}
