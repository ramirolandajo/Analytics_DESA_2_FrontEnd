import React, { createContext, useContext, useState } from 'react';

const PeriodContext = createContext(null);

const formatYMD = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const toLocalDateTimeStart = (ymd) => (ymd ? `${ymd}T00:00:00` : null);
const toLocalDateTimeEnd = (ymd) => (ymd ? `${ymd}T23:59:59` : null);

export const PeriodProvider = ({ children }) => {
  // store as YMD (YYYY-MM-DD) for easier binding to <input type="date" />
  const today = new Date();
  const defaultEnd = formatYMD(today);
  const defaultStart = formatYMD(new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)); // default 30 días

  const [startYMD, setStartYMD] = useState(defaultStart);
  const [endYMD, setEndYMD] = useState(defaultEnd);

  const setPresetLastDays = (days) => {
    const now = new Date();
    const end = formatYMD(now);
    const start = formatYMD(new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000));
    setStartYMD(start);
    setEndYMD(end);
  };

  const setCustomRange = (start, end) => {
    setStartYMD(start);
    setEndYMD(end);
  };

  const params = {
    startDate: toLocalDateTimeStart(startYMD),
    endDate: toLocalDateTimeEnd(endYMD)
  };

  return (
    <PeriodContext.Provider value={{ startYMD, endYMD, setStartYMD, setEndYMD, setPresetLastDays, setCustomRange, params }}>
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = () => {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error('usePeriod must be used within PeriodProvider');
  return ctx;
};

export default PeriodContext;

