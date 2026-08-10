import { fetchProducts } from '../../utils/fake-store'
export default defineEventHandler(() => fetchProducts())
