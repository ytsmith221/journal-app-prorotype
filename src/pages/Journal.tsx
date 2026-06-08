import { useNavigate } from 'react-router-dom'
import { PenLine, Search, Calendar, Feather } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { allPrompts } from '../lib/data'
import { timeAgo, wordCount } from '../lib/utils'
import { Button } from '../components/ui/Button'

export function Journal() {
  const navigate = useNavigate()
  const { entries, user } = useApp()
  const [search, setSearch] = useState('')

  const filtered = entries.filter(e =>
    !search || e.body.toLowerCase().includes(search.toLowerCase())
  )

  function getPromptTitle(promptId?: string) {
    if (!promptId) return 'Free write'
    return allPrompts.find(p => p.id === promptId)?.title ?? 'Untitled prompt'
  }

  const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0)

  return (
    <div className="px-4 py-5 space-y-5">

      {/* Stats bar */}
      <div className="flex gap-3 text-center">
        <div className="flex-1 bg-white rounded-xl border border-sage-100 py-3">
          <p className="text-lg font-bold text-sage-900">{entries.length}</p>
          <p className="text-xs text-sage-400">entries</p>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-sage-100 py-3">
          <p className="text-lg font-bold text-sage-900">{totalWords.toLocaleString()}</p>
          <p className="text-xs text-sage-400">words</p>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-sage-100 py-3">
          <p className="text-lg font-bold text-sage-900">{user.streak}</p>
          <p className="text-xs text-sage-400">day streak</p>
        </div>
      </div>

      {/* New entry */}
      <Button size="lg" className="w-full" onClick={() => navigate('/journal/new')}>
        <Feather size={16} /> New entry
      </Button>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
        <input
          type="text"
          placeholder="Search your entries…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-sage-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-sage-800 placeholder-sage-300 outline-none focus:border-sage-300"
        />
      </div>

      {/* Entries list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <PenLine size={20} className="text-sage-400" />
          </div>
          <p className="font-serif text-sage-700 text-lg">Nothing here yet.</p>
          <p className="text-sm text-sage-400 mt-1">Start by writing to this week's prompt.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => (
            <div
              key={entry.id}
              onClick={() => navigate(`/journal/${entry.id}`)}
              className="bg-white rounded-2xl border border-sage-100 p-4 cursor-pointer hover:border-sage-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-xs text-sage-500 font-medium line-clamp-1">
                  {getPromptTitle(entry.promptId)}
                </p>
                <span className="text-xs text-sage-400 whitespace-nowrap flex items-center gap-1">
                  <Calendar size={11} /> {timeAgo(entry.createdAt)}
                </span>
              </div>
              <p className="text-sm text-sage-700 line-clamp-3 leading-relaxed">{entry.body}</p>
              <p className="text-xs text-sage-400 mt-2">{entry.wordCount} words</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
