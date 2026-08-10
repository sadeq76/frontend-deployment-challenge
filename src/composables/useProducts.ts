import type { Product, ProductSort } from '~/types/product'
import { productsService } from '~/services/products-service'

export function useProducts() {
  return useAsyncData<Product[]>('products', () => productsService.list(), { default: () => [] })
}

export function useProductFilters(products: Ref<Product[]>) {
  const route = useRoute()
  const router = useRouter()
  const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
  const selectedCategories = computed<string[]>(() => {
    const values = Array.isArray(route.query.category) ? route.query.category : [route.query.category]

    return [...new Set(values.filter((value): value is string => typeof value === 'string' && value.trim().length > 0))]
  })
  const sort = computed<ProductSort>(() => {
    const value = route.query.sort
    return value === 'price-asc' || value === 'price-desc' || value === 'rating-desc' || value === 'title-asc'
      ? value
      : 'default'
  })
  const categories = computed(() => [...new Set(products.value.map((product: Product) => product.category))].sort())
  const filteredProducts = computed(() => {
    const normalizedQuery = query.value.trim().toLocaleLowerCase()
    const list = products.value.filter(
      (product: Product) =>
        (!normalizedQuery || product.title.toLocaleLowerCase().includes(normalizedQuery)) &&
        (!selectedCategories.value.length || selectedCategories.value.includes(product.category))
    )
    if (sort.value === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sort.value === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    if (sort.value === 'rating-desc') return [...list].sort((a, b) => b.rating.rate - a.rating.rate)
    if (sort.value === 'title-asc') return [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  })
  const update = async (changes: Partial<{ q: string; category: string[]; sort: ProductSort }>) => {
    const next = { q: query.value, category: selectedCategories.value, sort: sort.value, ...changes }
    const nextQuery: Record<string, string | string[]> = {}

    if (next.q.trim()) nextQuery.q = next.q.trim()
    if (next.category.length) nextQuery.category = [...new Set(next.category.filter((value) => value.trim()))]
    if (next.sort !== 'default') nextQuery.sort = next.sort

    await router.push({
      query: nextQuery
    })
  }
  const clear = () => update({ q: '', category: [], sort: 'default' })
  return { query, selectedCategories, sort, categories, filteredProducts, update, clear }
}

export function useProductFormat() {
  const { locale } = useI18n()
  const price = (value: number) =>
    new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value)
  const number = (value: number) => new Intl.NumberFormat(locale.value).format(value)
  return { price, number }
}
