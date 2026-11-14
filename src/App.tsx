import { useState } from 'react'
import { Site } from './types'
import { useSites } from './store'
import HomeScreen from './components/HomeScreen'
import AddSiteScreen from './components/AddSiteScreen'
import SiteDetailScreen from './components/SiteDetailScreen'

type Screen = 'home' | 'add' | 'detail'

export default function App() {
  const { sites, addSite, updateSite, deleteSite, visitSite } = useSites()
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)

  return (
    <div className="h-screen max-w-md mx-auto overflow-hidden relative bg-[#0f0f13]">
      {screen === 'home' && (
        <HomeScreen
          sites={sites}
          onAdd={() => setScreen('add')}
          onSelect={site => { setSelectedSite(site); setScreen('detail') }}
          onVisit={visitSite}
        />
      )}
      {screen === 'add' && (
        <AddSiteScreen
          onSave={addSite}
          onClose={() => setScreen('home')}
        />
      )}
      {screen === 'detail' && selectedSite && (
        <SiteDetailScreen
          site={selectedSite}
          onUpdate={(id, updates) => {
            updateSite(id, updates)
            setSelectedSite(prev => prev ? { ...prev, ...updates } : prev)
          }}
          onDelete={deleteSite}
          onVisit={visitSite}
          onClose={() => setScreen('home')}
        />
      )}
    </div>
  )
}
