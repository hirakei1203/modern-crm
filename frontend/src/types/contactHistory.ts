export type ContactHistoryCreator = {
  id: number
  name: string
  avatar_url: string | null
}

export type ContactHistory = {
  id: number
  customer_id: number
  content: string
  created_by: number | null
  creator: ContactHistoryCreator | null
  created_at: string
}
