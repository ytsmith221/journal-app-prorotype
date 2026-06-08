import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Lock, Feather, CheckCircle2 } from 'lucide-react'
import { weeklyPrompts } from '../lib/data'
import { isPromptLive } from '../lib/utils'
import { Badge } from '../components/ui/Badge'
import { useApp } from '../context/AppContext'
import { cn } from '../lib/utils'

export function Prompts() {
  const navigate = useNavigate()
  const { getEntryForPrompt } = useApp()
  const [activeTab, setActiveTab] = useState<'weekly' | 'archive'>('weekly')

  const live = weeklyPrompts.filter(p => isPromptLive(p.publishAt))
  const upcoming = weeklyPrompts.filter(p => !isPromptLive(p.publishAt))

  return (
    <div className="px-4 py-5">
      <p className="text-sage-600 font-sans text-sm leading-relaxed mb-5">
        A new prompt drops each week. Write to it privately, share it with friends, or join the community conversation.
      </p>

      <div className="flex gap-2 mb-5 bg-sage-50 rounded-xl p-1">
        {(['weekly', 'archive'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === tab ? 'bg-white text-sage-800 shadow-sm' : 'text-sage-500'
            )}
          >
            {tab === 'weekly' ? 'This Season' : 'Archive'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {live.map(prompt => {
          const entry = getEntryForPrompt(prompt.id)
          return (
            <div
              key={prompt.id}
              onClick={() => navigate(`/prompts/${prompt.id}`)}
              className="bg-white rounded-2xl border border-sage-100 p-5 cursor-pointer hover:border-sage-300 transition-colors shadow-warm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="tag">Week {prompt.week}</Badge>
                {entry && (
                  <span className="flex items-center gap-1 text-xs text-sage-500">
                    <CheckCircle2 size={13} className="text-sage-500" /> Written
                  </span>
                )}
              </div>
              <p className="font-serif text-sage-900 text-lg leading-snug">{prompt.title}</p>
              {prompt.quote && (
                <p className="text-sm text-sage-500 italic mt-2 leading-relaxed line-clamp-2">"{prompt.quote}"</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-1">
                  {prompt.tags.map(t => <Badge key={t} variant="tag">{t}</Badge>)}
                </div>
                <div className="ml-auto">
                  <Feather size={14} className="text-sage-400" />
                </div>
              </div>
            </div>
          )
        })}

        {upcoming.length > 0 && (
          <>
            <p className="text-xs font-semibold text-sage-400 uppercase tracking-wider mt-5 mb-2">Coming Soon</p>
            {upcoming.map(prompt => (
              <div key={prompt.id} className="bg-sage-50 rounded-2xl border border-sage-100 p-5 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={12} className="text-sage-400" />
                  <Badge variant="tag">Week {prompt.week}</Badge>
                </div>
                <p className="font-serif text-sage-700 text-lg leading-snug">{prompt.title}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
