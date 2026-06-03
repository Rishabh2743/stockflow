export const QUERY_KEYS = {
  me:        ['me']          as const,
  dashboard: ['dashboard']   as const,
  products:  (filters = {}) => ['products', filters] as const,
  product:   (id: string)   => ['product', id]       as const,
  settings:  ['settings']   as const,
} as const;