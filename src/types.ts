export interface Site {
  id: string
  url: string
  title: string
  favicon: string
  tags: string[]
  notes: string
  collection: string
  createdAt: number
  visitCount: number
}

export interface Collection {
  id: string
  name: string
  color: string
}
