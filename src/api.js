const BASE_URL = 'http://localhost:8081/analytics';
const PRODUCTS_URL = 'http://localhost:8081/products';

export async function getSummary() {
  const res = await fetch(`${BASE_URL}/sales/summary`);
  return res.json();
}

export async function getTopProducts() {
  const res = await fetch(`${BASE_URL}/sales/top-products`);
  return res.json();
}

export async function getTopCategories() {
  const res = await fetch(`${BASE_URL}/sales/top-categories`);
  return res.json();
}

export async function getTopBrands() {
  const res = await fetch(`${BASE_URL}/sales/top-brands`);
  return res.json();
}

export async function getDailySales() {
  const res = await fetch(`${BASE_URL}/sales/daily-sales`);
  return res.json();
}

export async function getStockHistory(productId) {
  const res = await fetch(`${BASE_URL}/sales/stock-history?productId=${productId}`);
  return res.json();
}

export async function getLowStock() {
  const res = await fetch(`${BASE_URL}/sales/low-stock`);
  return res.json();
}


export async function getStockHistoryByProduct(productCode) {
  const res = await fetch(
    `${BASE_URL}/sales/stock-history-by-product-code?productCode=${productCode}`,
  );
  return res.json();
}

export async function getTopCustomers() {
  const res = await fetch(`${BASE_URL}/sales/top-customers`);
  return res.json();
}

export async function getHistogram() {
  const res = await fetch(`${BASE_URL}/sales/histogram`);
  return res.json();
}

export async function getCorrelation() {
  const res = await fetch(`${BASE_URL}/sales/correlation`);
  return res.json();
}

export async function getCategoryGrowth(categoryId) {
  const res = await fetch(`${BASE_URL}/sales/category-growth?categoryId=${categoryId}`);
  return res.json();
}

export async function getProductEvents({ productId, startDate, endDate, topN } = {}) {
  const params = new URLSearchParams();
  if (productId) params.append('productId', productId);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (topN) params.append('topN', topN);
  const res = await fetch(
    `${BASE_URL}/sales/product-events-timeline?${params.toString()}`,
  );
  if (!res.ok) throw new Error('Error fetching product events');
  return res.json();
}

export async function getAllProductsData() {
  const res = await fetch(`${PRODUCTS_URL}/all-data`);
  return res.json();
}
