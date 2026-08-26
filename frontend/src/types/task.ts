export type Task = {
  id: number
  customer_id: number
  title: string
  is_done: boolean
  due_date: string | null
  created_by: number | null
  created_at: string
  updated_at: string
}
