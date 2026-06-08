import { useNavigate } from 'react-router-dom'
import { Flame, Feather, ArrowRight, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { weeklyPrompts, authorQuotes, plans } from '../lib/data'
import { getTodayQuote, isPromptLive, timeAgo } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export function Home() {
  const navigate = useNavigate()
  const { user, entries } = useApp()
  const quote = getTodayQuote(authorQuotes)
  const livePrompts = weeklyPrompts.filter(p => isPromptLive(p.publishAt))
  const currentPrompt = livePrompts[livePrompts.length - 1]
  const enrolledPlans = plans.filter(p => p.isEnrolled)
  const recentEntry = entries[0]

  return (
    <div className="px-4 py-5 space-y-6">

      {/* Greeting */}
      <div>
        <p className="text-sm text-sage-500 font-medium">Good morning</p>
        <h2 className="font-serif text-2xl text-sage-900 mt-0.5">
          {user.name.split(' ')[0]}
        </h2>
      </div>

      {/* Streak + stats */}
      <div className="flex gap-3">
        <div className="flex-1 bg-white rounded-2xl border border-sage-100 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-bark-100 flex items-center justify-center">
            <Flame size={18} className="text-bark-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-sage-900">{user.streak}</p>
            <p className="text-xs text-sage-500">day streak</p>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-sage-100 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center">
            <Feather size={18} className="text-sage-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-sage-900">{user.totalEntries}</p>
            <p className="text-xs text-sage-500">entries written</p>
          </div>
        </div>
      </div>

      {/* Author quote */}
      <div className="bg-sage-800 rounded-2xl px-5 py-4">
        <p className="font-serif text-cream leading-relaxed italic text-[15px]">"{quote}"</p>
        <p className="text-sage-400 text-xs mt-2 font-medium">— The Way of Asking</p>
      </div>

      {/* This week's prompt */}
      {currentPrompt && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider">This Week's Prompt</p>
            <button onClick={() => navigate('/prompts')} className="text-xs text-sage-500 hover:text-sage-700 flex items-center gap-0.5">
              All prompts <ArrowRight size={12} />
            </button>
          </div>
          <div
            onClick={() => navigate(`/prompts/${currentPrompt.id}`)}
            className="bg-white rounded-2xl border border-sage-100 p-5 cursor-pointer hover:border-sage-200 transition-colors shadow-warm"
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="tag">Week {currentPrompt.week}</Badge>
              {currentPrompt.tags.slice(0, 2).map(t => (
                <Badge key={t} variant="tag">{t}</Badge>
              ))}
            </div>
            <p className="font-serif text-sage-900 text-lg leading-snug">{currentPrompt.title}</p>
            {currentPrompt.quote && (
              <p className="text-sm text-sage-500 italic mt-2 leading-relaxed">"{currentPrompt.quote}"</p>
            )}
            <Button size="sm" className="mt-4">
              <Feather size={14} /> Write to this
            </Button>
          </div>
        </div>
      )}

      {/* Active plans */}
      {enrolledPlans.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-2">Your Plans</p>
          <div className="space-y-3">
            {enrolledPlans.map(plan => (
              <div
                key={plan.id}
                onClick={() => navigate(`/plans/${plan.id}`)}
                className="bg-white rounded-2xl border border-sage-100 p-4 cursor-pointer hover:border-sage-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sage-900 text-sm">{plan.title}</p>
                    <p className="text-xs text-sage-500 mt-0.5">{plan.subtitle}</p>
                  </div>
                  <Badge variant={plan.type === 'live' ? 'live' : 'evergreen'}>
                    {plan.type === 'live' ? 'Live' : 'Evergreen'}
                  </Badge>
                </div>
                {plan.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-sage-500 mb-1">
                      <span>{plan.progress}% complete</span>
                      <span>{Math.round(plan.duration * plan.progress / 100)} / {plan.duration} prompts</span>
                    </div>
                    <div className="h-1.5 bg-sage-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sage-500 rounded-full transition-all"
                        style={{ width: `${plan.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue writing */}
      {recentEntry && (
        <div>
          <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-2">Continue Writing</p>
          <div
            onClick={() => navigate(`/journal/${recentEntry.id}`)}
            className="bg-white rounded-2xl border border-sage-100 p-4 cursor-pointer hover:border-sage-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-sage-400" />
              <span className="text-xs text-sage-500">{timeAgo(recentEntry.updatedAt)} · {recentEntry.wordCount} words</span>
            </div>
            <p className="text-sm text-sage-700 line-clamp-2 leading-relaxed">
              {recentEntry.body.substring(0, 140)}…
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
