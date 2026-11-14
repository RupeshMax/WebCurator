import { useState } from 'react'
import type { Site } from '../types'

interface Props {
  sites: Site[]
  onAdd: () => void
  onSelect: (site: Site) => void
  onVisit: (id: string) => void
  onSignOut: () => void
}

export default function HomeScreen({ sites, onAdd, onSelect, onVisit, onSignOut }: Props) {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = sites.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.url.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-12 pb-3 bg-[#0f0f13] sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-white">WebCurator</h1>
          <div className="flex gap-2">
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl bg-[#1a1a24] text-gray-400"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button
              onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-xl bg-[#1a1a24] text-gray-400"
            >
              {view === 'grid' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search sites, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1a1a24] text-white placeholder-gray-500 text-sm border border-[#2a2a3a] focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p className="text-sm">{search ? 'No results found' : 'No sites saved yet'}</p>
            {!search && <p className="text-xs mt-1 opacity-60">Tap + to add your first site</p>}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {filtered.map(site => (
              <GridCard key={site.id} site={site} onSelect={onSelect} onVisit={onVisit} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            {filtered.map(site => (
              <ListCard key={site.id} site={site} onSelect={onSelect} onVisit={onVisit} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onAdd}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center active:scale-95 transition-transform"
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}

function getFavicon(url: string) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ''
  }
}

function GridCard({ site, onSelect, onVisit }: { site: Site; onSelect: (s: Site) => void; onVisit: (id: string) => void }) {
  return (
    <div
      onClick={() => onSelect(site)}
      className="bg-[#1a1a24] rounded-2xl p-3 border border-[#2a2a3a] active:scale-95 transition-transform cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <img
          src={getFavicon(site.url)}
          alt=""
          className="w-8 h-8 rounded-lg"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <button
          onClick={e => { e.stopPropagation(); onVisit(site.id); window.open(site.url, '_blank') }}
          className="p-1.5 rounded-lg bg-[#2a2a3a] text-gray-400"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
      <p className="text-sm font-medium text-white leading-tight line-clamp-2">{site.title || site.url}</p>
      {site.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {site.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function ListCard({ site, onSelect, onVisit }: { site: Site; onSelect: (s: Site) => void; onVisit: (id: string) => void }) {
  return (
    <div
      onClick={() => onSelect(site)}
      className="bg-[#1a1a24] rounded-2xl p-3 border border-[#2a2a3a] flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <img
        src={getFavicon(site.url)}
        alt=""
        className="w-10 h-10 rounded-xl flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{site.title || site.url}</p>
        <p className="text-xs text-gray-500 truncate">{site.url}</p>
        {site.tags.length > 0 && (
          <div className="flex gap-1 mt-1">
            {site.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={e => { e.stopPropagation(); onVisit(site.id); window.open(site.url, '_blank') }}
        className="p-2 rounded-xl bg-[#2a2a3a] text-gray-400 flex-shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>
    </div>
  )
}
