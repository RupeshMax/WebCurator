import { useState, useEffect } from 'react'
import type { Site } from './types'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { useSites } from './store'
import AuthScreen from './components/AuthScreen'
import HomeScreen from './components/HomeScreen'
import AddSiteScreen from './components/AddSiteScreen'
import SiteDetailScreen from './components/SiteDetailScreen'

type Screen = 'home' | 'add' | 'detail'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (authLoading) return (
    <div className="flex items-center justify-center h-screen bg-[#0f0f13]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return (
    <div className="h-screen max-w-md mx-auto">
      <AuthScreen />
    </div>
  )

  return <MainApp userId={user.id} onSignOut={() => supabase.auth.signOut()} />
}

function MainApp({ userId, onSignOut }: { userId: string; onSignOut: () => void }) {
  const { sites, loading, addSite, updateSite, deleteSite, visitSite } = useSites(userId)
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#0f0f13]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="h-screen max-w-md mx-auto overflow-hidden relative bg-[#0f0f13]">
      {screen === 'home' && (
        <HomeScreen
          sites={sites}
          onAdd={() => setScreen('add')}
          onSelect={site => { setSelectedSite(site); setScreen('detail') }}
          onVisit={visitSite}
          onSignOut={onSignOut}
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
