import { describe, expect, it } from 'vitest'
import { parseProduct, parseProducts } from '../../src/lib/product-validation'

const product = {
  id: 1,
  title: 'Backpack',
  price: 59.99,
  description: 'A durable backpack.',
  category: 'accessories',
  image: 'https://example.com/backpack.jpg',
  rating: { rate: 4.7, count: 12 }
}

describe('product response validation', () => {
  it('accepts a complete upstream product', () => {
    expect(parseProduct(product)).toEqual(product)
    expect(parseProducts([product])).toEqual([product])
  })

  it('rejects incomplete products and malformed collections', () => {
    expect(parseProduct({ ...product, rating: { rate: 4.7 } })).toBeNull()
    expect(parseProduct({ ...product, price: -1 })).toBeNull()
    expect(parseProducts({ products: [product] })).toBeNull()
    expect(parseProducts([product, { ...product, id: '2' }])).toBeNull()
  })
})
