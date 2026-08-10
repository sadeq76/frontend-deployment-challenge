import { describe, expect, it } from 'vitest'
import { buildSitemapXml } from '../../server/utils/sitemap'

describe('sitemap XML', () => {
  it('uses canonical singular product detail URLs', () => {
    const sitemap = buildSitemapXml('https://example.test/', [{ id: 1 }, { id: 42 }])

    expect(sitemap).toContain('<loc>https://example.test/product/1</loc>')
    expect(sitemap).toContain('<loc>https://example.test/product/42</loc>')
    expect(sitemap).not.toContain('/products/')
  })
})
