import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getProductByCode } from '../services/analyticsService.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatCurrency } from '../services/utils/formatters.js';

/**
 * Product detail page showing information about a specific product.
 */
const ProductDetailPage = () => {
  const { productCode } = useParams();
  const productQuery = useQuery({ queryKey: ['product', productCode], queryFn: () => getProductByCode(productCode) });

  if (productQuery.isLoading) {
    return <Loader />;
  }

  if (productQuery.isError) {
    return (
      <ErrorMessage
        onRetry={() => productQuery.refetch()}
      />
    );
  }

  const product = productQuery.data;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-brand-soft">Ficha del producto</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Detalles del producto {product.title || product.id}
        </p>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {product.mediaSrc && product.mediaSrc.length > 0 && (
            <div className="flex-shrink-0">
              <img
                src={product.mediaSrc[0]}
                alt={product.title}
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-4">{product.title}</h3>
            {product.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{product.description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">ID del producto</p>
                <p className="font-medium">{product.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Código del producto</p>
                <p className="font-medium">{product.productCode}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Precio</p>
                <p className="font-medium">{formatCurrency(product.price)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Precio unitario</p>
                <p className="font-medium">{formatCurrency(product.priceUnit)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Stock</p>
                <p className="font-medium">{product.stock || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Descuento</p>
                <p className="font-medium">{product.discount ? `${(product.discount * 100).toFixed(0)}%` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Categorías</p>
                <p className="font-medium">{product.categories?.map(c => c.name).join(', ') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Marca</p>
                <p className="font-medium">{product.brand?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Nuevo</p>
                <p className="font-medium">{product.isNew ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Más vendido</p>
                <p className="font-medium">{product.isBestseller ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Destacado</p>
                <p className="font-medium">{product.isFeatured ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Hero</p>
                <p className="font-medium">{product.hero ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Calificación</p>
                <p className="font-medium">{product.calification || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Activo</p>
                <p className="font-medium">{product.active ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
