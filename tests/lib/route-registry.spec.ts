import { describe, expect, it } from 'vitest'
import { findRouteSuggestion, productPath, resolveRouteRedirect, routeRegistry } from '../../src/lib/route-registry'

describe('route registry', () => {
  it('defines the product listing as the canonical public route', () => {
    expect(routeRegistry).toContainEqual(expect.objectContaining({ path: '/product', labelKey: 'nav.products' }))
    expect(productPath(42)).toBe('/product/42')
  })

  it('suggests the canonical product route for close typos', () => {
    expect(findRouteSuggestion('/products')).toMatchObject({ path: '/product', labelKey: 'nav.products' })
    expect(resolveRouteRedirect('/products')).toBe('/product')
  })

  it('redirects legacy product detail URLs without affecting unrelated paths', () => {
    expect(resolveRouteRedirect('/products/42')).toBe('/product/42')
    expect(resolveRouteRedirect('/notes')).toBeNull()
  })
})
