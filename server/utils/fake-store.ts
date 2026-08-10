import { createHttpClient, HttpClientError } from '~/lib/http-client'
import { parseProduct, parseProducts } from '~/lib/product-validation'

function client() {
  return createHttpClient({ baseUrl: useRuntimeConfig().fakeStoreBaseUrl, timeoutMs: 8000 })
}

class UpstreamDataError extends Error {}

function upstreamError(error: unknown) {
  if (error instanceof HttpClientError && error.kind === 'http' && error.response?.status === 404)
    return createError({ statusCode: 404, statusMessage: 'Product not found' })
  if (error instanceof UpstreamDataError)
    return createError({ statusCode: 502, statusMessage: 'Product service returned invalid data' })
  return createError({ statusCode: 502, statusMessage: 'Product service is unavailable' })
}

export async function fetchProducts() {
  try {
    const products = parseProducts((await client().get<unknown>('products')).data)
    if (!products) throw new UpstreamDataError()
    return products
  } catch (error) {
    throw upstreamError(error)
  }
}

export async function fetchProduct(id: string) {
  try {
    const product = parseProduct((await client().get<unknown>(`products/${id}`)).data)
    if (!product) throw new UpstreamDataError()
    return product
  } catch (error) {
    throw upstreamError(error)
  }
}
