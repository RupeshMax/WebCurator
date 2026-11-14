import { useState, useEffect } from 'react'
import type { Site } from './types'
import { supabase } from './supabase'

export function useSites(userId: string) {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [userId])

  const fetchSites = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setSites(data.map(dbToSite))
    setLoading(false)
  }

  const addSite = async (site: Omit<Site, 'id' | 'createdAt' | 'visitCount'>) => {
    const { data, error } = await supabase.from('sites').insert({
      user_id: userId,
      url: site.url,
      title: site.title,
      favicon: site.favicon,
      tags: site.tags,
      notes: site.notes,
      collection: site.collection,
    }).select().single()
    if (!error && data) setSites(prev => [dbToSite(data), ...prev])
  }

  const updateSite = async (id: string, updates: Partial<Site>) => {
    const dbUpdates: Record<string, unknown> = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags
    if (updates.visitCount !== undefined) dbUpdates.visit_count = updates.visitCount

    await supabase.from('sites').update(dbUpdates).eq('id', id)
    setSites(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSite = async (id: string) => {
    await supabase.from('sites').delete().eq('id', id)
    setSites(prev => prev.filter(s => s.id !== id))
  }

  const visitSite = (id: string) => {
    const site = sites.find(s => s.id === id)
    if (site) updateSite(id, { visitCount: site.visitCount + 1 })
  }

  return { sites, loading, addSite, updateSite, deleteSite, visitSite }
}

function dbToSite(row: Record<string, unknown>): Site {
  return {
    id: row.id as string,
    url: row.url as string,
    title: row.title as string,
    favicon: row.favicon as string,
    tags: (row.tags as string[]) || [],
    notes: row.notes as string,
    collection: row.collection as string,
    createdAt: new Date(row.created_at as string).getTime(),
    visitCount: (row.visit_count as number) || 0,
  }
}
