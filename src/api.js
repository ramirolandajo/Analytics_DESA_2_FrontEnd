const API_BASE =
  (import.meta.env.VITE_API_URL?.trim()) || "/api";

// Your Analytics controller base is '/analytics/sales'
const ANALYTICS_BASE = `${API_BASE}/analytics`;

// Products controller base (adjust if different in your BE)
const PRODUCTS_BASE  = `${API_BASE}/products`;

export async function getSummary() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/summary`);
  return res.json();
}

export async function getTopProducts() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/top-products`);
  return res.json();
}

export async function getTopCategories() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/top-categories`);
  return res.json();
}

export async function getTopBrands() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/top-brands`);
  return res.json();
}

export async function getDailySales() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/daily-sales`);
  return res.json();
}

export async function getStockHistory(productId) {
  const res = await fetch(`${ANALYTICS_BASE}/sales/stock-history?productId=${productId}`);
  return res.json();
}

export async function getLowStock() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/low-stock`);
  return res.json();
}


export async function getStockHistoryByProduct(productCode) {
  const res = await fetch(
    `${ANALYTICS_BASE}/sales/stock-history-by-product-code?productCode=${productCode}`,
  );
  return res.json();
}

export async function getTopCustomers() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/top-customers`);
  return res.json();
}

export async function getHistogram() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/histogram`);
  return res.json();
}

export async function getCorrelation() {
  const res = await fetch(`${ANALYTICS_BASE}/sales/correlation`);
  return res.json();
}

export async function getCategoryGrowth(categoryId) {
  const res = await fetch(`${ANALYTICS_BASE}/sales/category-growth?categoryId=${categoryId}`);
  return res.json();
}

export async function getProductEvents({ productId, startDate, endDate, topN } = {}) {
  const params = new URLSearchParams();
  if (productId) params.append('productId', productId);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (topN) params.append('topN', topN);
  const res = await fetch(
    `${ANALYTICS_BASE}/sales/product-events-timeline?${params.toString()}`,
  );
  if (!res.ok) throw new Error('Error fetching product events');
  return res.json();
}

export async function getAllProductsData() {
  const res = await fetch(`${PRODUCTS_BASE}/all-data`);
  return res.json();
}
