import { fetchProducts } from '../utils/fake-store'

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const products = await fetchProducts()
  const urls = [`${base}/`, ...products.map((product) => `${base}/products/${product.id}`)]
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`
})
