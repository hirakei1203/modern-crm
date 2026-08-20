export type CustomerAssignee = {
  id: number
  name: string
  avatar_url: string | null
}

export type Customer = {
  id: number
  name: string
  company: string | null
  email: string | null
  phone: string | null
  memo: string | null
  assigned_to: number | null
  assignee: CustomerAssignee | null
  created_at: string
  updated_at: string
}

export type CustomerFilters = {
  search?: string
  assigned_to?: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
