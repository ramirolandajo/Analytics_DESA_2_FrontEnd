/**
 * Evaluates alerts based on summary data and stock information.
 */
export const evaluateRevenueAlert = ({ currentRevenue, previousRevenue }) => {
  if (!currentRevenue || !previousRevenue) return null;
  const delta = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  if (delta <= -20) {
    return {
      type: 'critical',
      title: 'Caída de ingresos detectada',
      description: `Los ingresos del período disminuyeron ${Math.abs(delta).toFixed(
        1
      )}% respecto al período anterior. Revise promociones y campañas en curso.`
    };
  }
  return null;
};

export const evaluateLowStockAlert = (lowStockItems = []) => {
  if (!Array.isArray(lowStockItems) || lowStockItems.length === 0) return null;
  const criticalItems = lowStockItems.filter((item) => Number(item.currentStock) < 5);
  if (criticalItems.length === 0) return null;

  return {
    type: 'critical',
    title: 'Productos con stock crítico',
    description: `${criticalItems.length} productos tienen menos de 5 unidades disponibles. Priorice reposición inmediata.`
  };
};

export const evaluateAtRiskCustomersAlert = (atRiskCustomers = []) => {
  if (!Array.isArray(atRiskCustomers) || atRiskCustomers.length === 0) return null;

  const totalCustomers = atRiskCustomers.reduce((acc, item) => acc + (item.totalCustomers || 0), 0);
  const atRisk = atRiskCustomers.reduce((acc, item) => acc + (item.atRiskCustomers || 0), 0);

  if (totalCustomers > 0 && atRisk / totalCustomers >= 0.1) {
    return {
      type: 'critical',
      title: 'Clientes en riesgo',
      description: 'Más del 10% de la base está en riesgo de abandono. Inicie acciones de fidelización.'
    };
  }
  return null;
};
