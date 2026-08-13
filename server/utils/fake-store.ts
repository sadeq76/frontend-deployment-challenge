import { parseProduct, parseProducts } from '~/lib/product-validation'

const REQUEST_TIMEOUT_MS = 8000

class UpstreamDataError extends Error {}

function upstreamStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined

  if ('statusCode' in error && typeof error.statusCode === 'number') return error.statusCode

  if (!('response' in error) || !error.response || typeof error.response !== 'object') return undefined

  return 'status' in error.response && typeof error.response.status === 'number' ? error.response.status : undefined
}

function upstreamError(error: unknown) {
  if (upstreamStatus(error) === 404) return createError({ statusCode: 404, statusMessage: 'Product not found' })

  if (error instanceof UpstreamDataError)
    return createError({ statusCode: 502, statusMessage: 'Product service returned invalid data' })

  return createError({ statusCode: 502, statusMessage: 'Product service is unavailable' })
}

async function fetchFromFakeStore(path: string): Promise<unknown> {
  return $fetch<unknown>(path, {
    baseURL: useRuntimeConfig().fakeStoreBaseUrl,
    timeout: REQUEST_TIMEOUT_MS,
    retry: 0
  })
}

export async function fetchProducts() {
  try {
    const products = parseProducts(await fetchFromFakeStore('products'))

    if (!products) throw new UpstreamDataError()

    return products
  } catch (error) {
    throw upstreamError(error)
  }
}

export async function fetchProduct(id: string) {
  try {
    const product = parseProduct(await fetchFromFakeStore(`products/${id}`))

    if (!product) throw new UpstreamDataError()

    return product
  } catch (error) {
    throw upstreamError(error)
  }
}
