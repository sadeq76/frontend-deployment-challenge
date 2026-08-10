import { describe, expect, it } from 'vitest'
import { findSimilarRoute } from '../../src/lib/fuzzy-route'

describe('fuzzy route matching', () => {
  it('scores a plural typo as a close product route', () => {
    expect(findSimilarRoute('/products', ['/product'])).toMatchObject({ path: '/product', score: 0.8888888888888888 })
  })

  it('does not make unrelated paths look similar', () => {
    expect(findSimilarRoute('/notes', ['/product'])?.score).toBeLessThan(0.45)
  })
})
