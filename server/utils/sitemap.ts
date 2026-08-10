import { productPath } from '../../src/lib/route-registry'

interface SitemapProduct {
  id: string | number
}

export function buildSitemapXml(baseUrl: string, products: readonly SitemapProduct[]): string {
  const base = baseUrl.replace(/\/$/, '')
  const urls = [`${base}/`, ...products.map((product) => `${base}${productPath(product.id)}`)]
  const entries = urls.map((url) => `<url><loc>${url}</loc></url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`
}
