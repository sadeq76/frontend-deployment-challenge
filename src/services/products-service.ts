import type { Product } from '~/types/product'

/** Centralized product API boundary. Add all product endpoint calls here. */
export const productsService = {
  list: () => $fetch<Product[]>('/api/products'),
  getById: (id: string) => $fetch<Product>(`/api/products/${id}`)
}
