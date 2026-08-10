import type { Product, Rating } from '~/types/product'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function isRating(value: unknown): value is Rating {
  if (!isRecord(value)) return false

  const { count, rate } = value
  return isNonNegativeNumber(rate) && isNonNegativeInteger(count)
}

/**
 * Narrows untrusted product API data at the server boundary before it reaches
 * the application. A nullable return lets the caller turn a bad upstream
 * response into an appropriate 502 instead of exposing malformed data.
 */
export function parseProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null

  const { category, description, id, image, price, rating, title } = value

  if (
    !isPositiveInteger(id) ||
    !isNonEmptyString(title) ||
    !isNonNegativeNumber(price) ||
    !isNonEmptyString(description) ||
    !isNonEmptyString(category) ||
    !isNonEmptyString(image) ||
    !isRating(rating)
  )
    return null

  return {
    id,
    title,
    price,
    description,
    category,
    image,
    rating
  }
}

export function parseProducts(value: unknown): Product[] | null {
  if (!Array.isArray(value)) return null

  const products = value.map(parseProduct)
  return products.every((product): product is Product => product !== null) ? products : null
}
