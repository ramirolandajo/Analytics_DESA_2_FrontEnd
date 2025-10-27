import React, { useMemo } from 'react';
import { usePeriod } from '../contexts/PeriodContext.jsx';

const PeriodSelector = () => {
  const { startYMD, endYMD, setStartYMD, setEndYMD, setPresetLastDays } = usePeriod();

  const isPreset = (days) => {
    if (!startYMD || !endYMD) return false;
    const s = new Date(startYMD);
    const e = new Date(endYMD);
    // inclusive days count
    const diffDays = Math.round((e - s) / (24 * 60 * 60 * 1000)) + 1;
    return diffDays === days;
  };

  const selected7 = useMemo(() => isPreset(7), [startYMD, endYMD]);
  const selected30 = useMemo(() => isPreset(30), [startYMD, endYMD]);
  const selected90 = useMemo(() => isPreset(90), [startYMD, endYMD]);

  const btnBase = 'cursor-pointer rounded-md px-3 py-1 text-xs font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-accent';

  return (
    <div className="mt-6 rounded-lg border border-slate-100 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900 overflow-hidden max-w-full">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Período</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 min-w-0">
        <input
          type="date"
          value={startYMD}
          onChange={(e) => setStartYMD(e.target.value)}
          className="flex-1 min-w-0 rounded-md border border-slate-300 px-2 py-1 text-sm bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-accent appearance-none box-border"
          aria-label="Fecha inicio"
        />
        <span className="hidden text-sm text-slate-400 sm:block">—</span>
        <input
          type="date"
          value={endYMD}
          onChange={(e) => setEndYMD(e.target.value)}
          className="flex-1 min-w-0 rounded-md border border-slate-300 px-2 py-1 text-sm bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-accent appearance-none box-border"
          aria-label="Fecha fin"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPresetLastDays(7)}
          className={`${btnBase} ${selected7 ? 'bg-brand-accent text-white border border-transparent' : 'bg-white border border-slate-200 text-slate-700 dark:bg-slate-700 dark:border-slate-700 dark:text-slate-300'} `}
          aria-pressed={selected7}
        >
          Últimos 7
        </button>
        <button
          type="button"
          onClick={() => setPresetLastDays(30)}
          className={`${btnBase} ${selected30 ? 'bg-brand-accent text-white border border-transparent' : 'bg-white border border-slate-200 text-slate-700 dark:bg-slate-700 dark:border-slate-700 dark:text-slate-300'} `}
          aria-pressed={selected30}
        >
          Últimos 30
        </button>
        <button
          type="button"
          onClick={() => setPresetLastDays(90)}
          className={`${btnBase} ${selected90 ? 'bg-brand-accent text-white border border-transparent' : 'bg-white border border-slate-200 text-slate-700 dark:bg-slate-700 dark:border-slate-700 dark:text-slate-300'} `}
          aria-pressed={selected90}
        >
          Últimos 90
        </button>
      </div>
    </div>
  );
};

export default PeriodSelector;
