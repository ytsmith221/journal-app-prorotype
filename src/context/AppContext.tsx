import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { JournalEntry, User } from '../lib/types'
import { currentUser, sampleEntries } from '../lib/data'

interface AppContextValue {
  user: User
  entries: JournalEntry[]
  addEntry: (entry: JournalEntry) => void
  updateEntry: (id: string, body: string) => void
  getEntryForPrompt: (promptId: string) => JournalEntry | undefined
  notifications: number
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const stored = localStorage.getItem('journal_entries')
    return stored ? JSON.parse(stored) : sampleEntries
  })
  const [notifications] = useState(3)

  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries))
  }, [entries])

  function addEntry(entry: JournalEntry) {
    setEntries(prev => [entry, ...prev])
  }

  function updateEntry(id: string, body: string) {
    setEntries(prev =>
      prev.map(e => e.id === id ? { ...e, body, updatedAt: new Date().toISOString() } : e)
    )
  }

  function getEntryForPrompt(promptId: string) {
    return entries.find(e => e.promptId === promptId)
  }

  return (
    <AppContext.Provider value={{ user: currentUser, entries, addEntry, updateEntry, getEntryForPrompt, notifications }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
