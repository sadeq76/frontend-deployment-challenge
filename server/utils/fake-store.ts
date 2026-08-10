import { createHttpClient, HttpClientError } from '~/lib/http-client'
import type { Product } from '~/types/product'

function client() { return createHttpClient({ baseUrl: useRuntimeConfig().fakeStoreBaseUrl, timeoutMs: 8000 }) }

function upstreamError(error: unknown) {
  if (error instanceof HttpClientError && error.kind === 'http' && error.response?.status === 404) return createError({ statusCode: 404, statusMessage: 'Product not found' })
  return createError({ statusCode: 502, statusMessage: 'Product service is unavailable' })
}

export async function fetchProducts() {
  try { return (await client().get<Product[]>('products')).data ?? [] } catch (error) { throw upstreamError(error) }
}

export async function fetchProduct(id: string) {
  try { return (await client().get<Product>(`products/${id}`)).data } catch (error) { throw upstreamError(error) }
}
