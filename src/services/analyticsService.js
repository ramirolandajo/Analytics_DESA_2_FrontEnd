import apiClient from './apiClient.js';

/**
 * Wrapper to centralize all analytics-related requests.
 * Each function corresponds to an existing backend endpoint.
 */
export const getSalesSummary = (params) => apiClient.get('/analytics/sales/summary', { params });
export const getSalesTrend = (params) => apiClient.get('/analytics/sales/trend', { params });
export const getDailySales = (params) => apiClient.get('/analytics/sales/daily-sales', { params });
export const getLowStock = (threshold = 5) => apiClient.get('/products/low-stock', { params: { threshold } });
export const getStockHistory = (params) => apiClient.get('/analytics/sales/stock-history', { params });
export const getStockHistoryByProduct = (productCode, params) => apiClient.get('/analytics/sales/stock-history-by-product-code', { params: { productCode: productCode, ...params } });
export const getTopProducts = (params) => apiClient.get('/analytics/sales/top-products', { params }).then((res) => res.data.data);
export const getTopCategories = (params) => apiClient.get('/analytics/sales/top-categories', { params }).then((res) => res.data.data);
export const getTopBrands = (params) => apiClient.get('/analytics/sales/top-brands', { params }).then((res) => res.data.data);
export const getSlowMovers = (params) => apiClient.get('/analytics/sales/slow-movers', { params });
export const getFastMovers = (params) => apiClient.get('/analytics/sales/fast-movers', { params });
export const getTopCustomers = async () => {
  try {
    const res = await apiClient.get('/analytics/sales/top-customers');
    const data = res.data?.data || [];
    return data.map(c => ({
      customerId: c.userId,
      customerName: c.name,
      revenue: c.totalSpent,
      orders: c.ventas,
      averageTicket: c.totalSpent / c.ventas
    }));
  } catch {
    return [];
  }
};
export const getAtRiskCustomers = (params) => apiClient.get('/analytics/sales/at-risk-customers', { params });
export const getSalesCorrelation = async () => {
  try {
    const res = await apiClient.get('/analytics/sales/correlation');
    return res.data?.data || [];
  } catch {
    return [];
  }
};
export const getProductEventsTimeline = () =>
  apiClient.get('/analytics/sales/product-events-timeline').then((res) => res.data.data);
export const getProducts = () => apiClient.get('/products');
export const getProduct = (id) => apiClient.get(`/products/${id}`).then((res) => res.data);
export const getProductByCode = (productCode) => apiClient.get(`/products/by-code/${productCode}`).then((res) => res.data);

// Optional aggregated endpoints that could simplify the frontend.
// TODO: Implement endpoint /analytics/sales/overview-summary to aggregate KPIs and deltas in una sola llamada.
// TODO: Implement endpoint /analytics/sales/alerts to centralize alert evaluations on el backend.
