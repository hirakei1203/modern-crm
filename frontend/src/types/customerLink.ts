export type CustomerLinkIconType = 'notion' | 'gmail' | 'other'

export type CustomerLink = {
  id: number
  customer_id: number
  label: string
  url: string
  icon_type: CustomerLinkIconType
  created_at: string
  updated_at: string
}
