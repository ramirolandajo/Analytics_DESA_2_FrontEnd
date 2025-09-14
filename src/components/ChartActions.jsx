import React from 'react';

export default function ChartActions({ chartRef, data, fileName = 'grafico' }) {
  const downloadPNG = () => {
    const chart = chartRef?.current;
    if (!chart) return;
    const url = chart.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.png`;
    a.click();
  };

  const downloadCSV = () => {
    if (!data) return;
    const rows = [];
    const labels = data.labels || [];
    const datasets = data.datasets || [];
    rows.push(['label', ...datasets.map((d) => d.label || 'serie')].join(','));
    labels.forEach((label, i) => {
      const vals = datasets.map((d) => d.data?.[i] ?? '');
      rows.push([`"${String(label).replace(/"/g, '""')}"`, ...vals].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-1">
      <button type="button" className="btn-icon" onClick={downloadPNG} title="Descargar PNG" aria-label="Descargar PNG">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17h16v2H4z"/></svg>
      </button>
      <button type="button" className="btn-icon" onClick={downloadCSV} title="Descargar CSV" aria-label="Descargar CSV">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8 3h8a2 2 0 0 1 2 2v6h-2V5H8v14h8v-6h2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm6.5 7.5v2H14v3h-2v-3h-1.5v-2H12v-1h2v1h.5z"/></svg>
      </button>
    </div>
  );
}

