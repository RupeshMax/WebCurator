import { useState } from 'react'
import { Site } from '../types'

interface Props {
  site: Site
  onUpdate: (id: string, updates: Partial<Site>) => void
  onDelete: (id: string) => void
  onVisit: (id: string) => void
  onClose: () => void
}

export default function SiteDetailScreen({ site, onUpdate, onDelete, onVisit, onClose }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(site.title)
  const [notes, setNotes] = useState(site.notes)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(site.tags)

  const handleSave = () => {
    onUpdate(site.id, { title, notes, tags })
    setEditing(false)
  }

  const handleDelete = () => {
    if (confirm('Delete this site?')) {
      onDelete(site.id)
      onClose()
    }
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  const getFavicon = (url: string) => {
    try {
      return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
    } catch { return '' }
  }

  return (
    <div className="flex flex-col h-full bg-[#0f0f13]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={onClose} className="p-2 rounded-xl bg-[#1a1a24] text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="p-2 rounded-xl bg-[#1a1a24] text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium">Save</button>
            </>
          ) : (
            <>
              <button onClick={handleDelete} className="p-2 rounded-xl bg-[#1a1a24] text-red-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={() => setEditing(true)} className="p-2 rounded-xl bg-[#1a1a24] text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10">
        {/* Site hero */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-[#1a1a24] rounded-2xl border border-[#2a2a3a]">
          <img
            src={getFavicon(site.url)}
            alt=""
            className="w-14 h-14 rounded-2xl"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#2a2a3a] text-white px-3 py-1.5 rounded-lg text-sm border border-[#3a3a4a] focus:outline-none focus:border-indigo-500"
              />
            ) : (
              <p className="font-semibold text-white leading-tight">{site.title}</p>
            )}
            <p className="text-xs text-gray-500 truncate mt-0.5">{site.url}</p>
            <p className="text-xs text-gray-600 mt-0.5">{site.visitCount} visits · {new Date(site.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Open button */}
        <button
          onClick={() => { onVisit(site.id); window.open(site.url, '_blank') }}
          className="w-full py-3.5 rounded-2xl bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 mb-5 active:scale-95 transition-transform"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open Site
        </button>

        {/* Tags */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Tags</p>
          {editing ? (
            <>
              <div className="flex gap-2 mb-2">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#1a1a24] text-white placeholder-gray-600 border border-[#2a2a3a] focus:outline-none focus:border-indigo-500 text-sm"
                />
                <button onClick={addTag} className="px-3 py-2 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-indigo-400 text-sm">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs">
                    {tag}
                    <button onClick={() => setTags(prev => prev.filter(t => t !== tag))}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {site.tags.length > 0 ? site.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs">{tag}</span>
              )) : <p className="text-sm text-gray-600">No tags</p>}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Notes</p>
          {editing ? (
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] text-white placeholder-gray-600 border border-[#2a2a3a] focus:outline-none focus:border-indigo-500 text-sm resize-none"
            />
          ) : (
            <div className="p-4 bg-[#1a1a24] rounded-2xl border border-[#2a2a3a] min-h-[80px]">
              {site.notes ? (
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{site.notes}</p>
              ) : (
                <p className="text-sm text-gray-600">No notes yet. Tap edit to add.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
