import { useState, useEffect } from 'react'
import { Site, Collection } from './types'

const SITES_KEY = 'webcurator_sites'
const COLLECTIONS_KEY = 'webcurator_collections'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useSites() {
  const [sites, setSites] = useState<Site[]>(() => load(SITES_KEY, []))

  useEffect(() => { save(SITES_KEY, sites) }, [sites])

  const addSite = (site: Omit<Site, 'id' | 'createdAt' | 'visitCount'>) => {
    setSites(prev => [{
      ...site,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      visitCount: 0,
    }, ...prev])
  }

  const updateSite = (id: string, updates: Partial<Site>) => {
    setSites(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteSite = (id: string) => {
    setSites(prev => prev.filter(s => s.id !== id))
  }

  const visitSite = (id: string) => {
    setSites(prev => prev.map(s => s.id === id ? { ...s, visitCount: s.visitCount + 1 } : s))
  }

  return { sites, addSite, updateSite, deleteSite, visitSite }
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(() =>
    load(COLLECTIONS_KEY, [
      { id: 'default', name: 'All', color: '#6366f1' },
    ])
  )

  useEffect(() => { save(COLLECTIONS_KEY, collections) }, [collections])

  const addCollection = (name: string, color: string) => {
    setCollections(prev => [...prev, { id: crypto.randomUUID(), name, color }])
  }

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id))
  }

  return { collections, addCollection, deleteCollection }
}
