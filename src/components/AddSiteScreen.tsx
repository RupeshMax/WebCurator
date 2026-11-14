import { useState } from 'react'
import { Site } from '../types'

interface Props {
  onSave: (site: Omit<Site, 'id' | 'createdAt' | 'visitCount'>) => void
  onClose: () => void
}

export default function AddSiteScreen({ onSave, onClose }: Props) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t])
    }
    setTagInput('')
  }

  const handleSave = () => {
    if (!url.trim()) return
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`
    onSave({
      url: cleanUrl,
      title: title.trim() || cleanUrl,
      favicon: '',
      tags,
      notes,
      collection: 'default',
    })
    onClose()
  }

  return (
    <div className="flex flex-col h-full bg-[#0f0f13]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={onClose} className="p-2 rounded-xl bg-[#1a1a24] text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-white">Add Site</h2>
        <button
          onClick={handleSave}
          disabled={!url.trim()}
          className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium disabled:opacity-40 active:scale-95 transition-transform"
        >
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4">
        {/* URL */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">URL *</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] text-white placeholder-gray-600 border border-[#2a2a3a] focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">Title</label>
          <input
            type="text"
            placeholder="Give it a name..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] text-white placeholder-gray-600 border border-[#2a2a3a] focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag() } }}
              className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a24] text-white placeholder-gray-600 border border-[#2a2a3a] focus:outline-none focus:border-indigo-500 text-sm"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-3 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-indigo-400 text-sm"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs"
                >
                  {tag}
                  <button onClick={() => setTags(prev => prev.filter(t => t !== tag))}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">Notes</label>
          <textarea
            placeholder="Why do you like this site? Notes..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a24] text-white placeholder-gray-600 border border-[#2a2a3a] focus:outline-none focus:border-indigo-500 text-sm resize-none"
          />
        </div>
      </div>
    </div>
  )
}
