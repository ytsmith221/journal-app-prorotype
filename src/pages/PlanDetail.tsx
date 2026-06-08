import { useParams, useNavigate } from 'react-router-dom'
import { Users, CheckCircle2, Circle, Feather } from 'lucide-react'
import { plans, chapterPrompts, allPrompts } from '../lib/data'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'
import { cn } from '../lib/utils'

const planBg: Record<string, string> = {
  sage: 'from-sage-700 to-sage-900',
  bark: 'from-bark-600 to-bark-800',
  moss: 'from-moss-600 to-moss-800',
}

export function PlanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEntryForPrompt } = useApp()
  const plan = plans.find(p => p.id === id)

  if (!plan) return <div className="p-8 text-center text-sage-400 font-serif">Plan not found.</div>

  const prompts = plan.promptIds.map(pid => allPrompts.find(p => p.id === pid)).filter(Boolean) as typeof allPrompts

  return (
    <div>
      {/* Hero */}
      <div className={cn('bg-gradient-to-br px-5 pt-6 pb-8 text-white', planBg[plan.coverColor] ?? planBg.sage)}>
        <Badge variant={plan.type === 'live' ? 'live' : 'evergreen'} className="bg-white/20 text-white border-0 mb-3">
          {plan.type === 'live' ? '⚡ Live Plan' : 'Evergreen'}
        </Badge>
        <h1 className="font-serif text-2xl leading-snug">{plan.title}</h1>
        <p className="text-white/70 text-sm mt-1">{plan.subtitle}</p>
        <p className="text-white/80 text-sm mt-3 leading-relaxed">{plan.description}</p>
        {plan.authorNote && (
          <p className="italic text-white/70 text-sm mt-4 border-t border-white/20 pt-3 leading-relaxed">
            "{plan.authorNote}"
          </p>
        )}
        <div className="flex items-center gap-4 mt-4 text-white/60 text-xs">
          <span className="flex items-center gap-1"><Users size={12} /> {plan.enrolledCount.toLocaleString()} enrolled</span>
          <span>{plan.duration} {plan.type === 'evergreen' ? 'chapters' : 'days'}</span>
        </div>
      </div>

      {/* Progress */}
      {plan.isEnrolled && plan.progress !== undefined && (
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-sage-100 p-4">
          <div className="flex items-center justify-between text-xs text-sage-600 mb-2">
            <span className="font-medium">Your progress</span>
            <span>{plan.progress}%</span>
          </div>
          <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
            <div className="h-full bg-sage-500 rounded-full transition-all" style={{ width: `${plan.progress}%` }} />
          </div>
        </div>
      )}

      {/* Prompts */}
      <div className="px-4 pt-5 pb-8 space-y-3">
        {!plan.isEnrolled && (
          <Button size="lg" className="w-full mb-4">
            Join this plan
          </Button>
        )}

        <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-2">Prompts</p>
        {prompts.map((prompt, idx) => {
          const entry = getEntryForPrompt(prompt.id)
          const done = !!entry
          return (
            <div
              key={prompt.id}
              onClick={() => navigate(`/prompts/${prompt.id}`)}
              className={cn(
                'bg-white rounded-2xl border p-4 cursor-pointer hover:border-sage-200 transition-colors',
                done ? 'border-sage-200' : 'border-sage-100'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {done
                    ? <CheckCircle2 size={18} className="text-sage-500" />
                    : <Circle size={18} className="text-sage-200" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-sage-400 mb-0.5">
                    {prompt.chapter ? `Chapter ${prompt.chapter}` : `Week ${prompt.week}`}
                  </p>
                  <p className="font-serif text-sage-900 leading-snug text-[15px]">{prompt.title}</p>
                  {done && entry && (
                    <p className="text-xs text-sage-500 mt-1">{entry.wordCount} words written</p>
                  )}
                </div>
                <Feather size={14} className="text-sage-300 mt-1 flex-shrink-0" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
