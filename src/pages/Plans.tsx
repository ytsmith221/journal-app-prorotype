import { useNavigate } from 'react-router-dom'
import { Users, BookMarked, Zap, ArrowRight } from 'lucide-react'
import { plans } from '../lib/data'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'

const planBg: Record<string, string> = {
  sage: 'from-sage-700 to-sage-900',
  bark: 'from-bark-600 to-bark-800',
  moss: 'from-moss-600 to-moss-800',
  earth: 'from-earth-600 to-earth-800',
}

export function Plans() {
  const navigate = useNavigate()

  const livePlans = plans.filter(p => p.type === 'live')
  const evergreenPlans = plans.filter(p => p.type === 'evergreen')

  return (
    <div className="px-4 py-5 space-y-6">
      <p className="text-sage-600 text-sm leading-relaxed">
        Journey through the book alone, with a small group, or alongside the author in a live cohort.
      </p>

      {livePlans.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-bark-500" />
            <h2 className="text-xs font-semibold text-sage-600 uppercase tracking-wider">Live Plans</h2>
          </div>
          <div className="space-y-3">
            {livePlans.map(plan => <PlanCard key={plan.id} plan={plan} onOpen={() => navigate(`/plans/${plan.id}`)} />)}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-3">
          <BookMarked size={14} className="text-sage-500" />
          <h2 className="text-xs font-semibold text-sage-600 uppercase tracking-wider">Evergreen Plans</h2>
        </div>
        <div className="space-y-3">
          {evergreenPlans.map(plan => <PlanCard key={plan.id} plan={plan} onOpen={() => navigate(`/plans/${plan.id}`)} />)}
        </div>
      </section>
    </div>
  )
}

function PlanCard({ plan, onOpen }: { plan: typeof plans[0], onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className={cn(
        'rounded-2xl overflow-hidden cursor-pointer shadow-warm hover:shadow-bark transition-shadow',
      )}
    >
      <div className={cn('bg-gradient-to-br px-5 pt-5 pb-4 text-white', planBg[plan.coverColor] ?? planBg.sage)}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge variant={plan.type === 'live' ? 'live' : 'evergreen'} className="bg-white/20 text-white border-0 mb-2">
              {plan.type === 'live' ? '⚡ Live' : 'Evergreen'}
            </Badge>
            <h3 className="font-serif text-xl leading-snug">{plan.title}</h3>
            <p className="text-white/70 text-xs mt-1">{plan.subtitle}</p>
          </div>
          <ArrowRight size={18} className="text-white/60 mt-1 flex-shrink-0" />
        </div>
        {plan.authorNote && (
          <p className="text-white/80 text-sm italic mt-3 leading-relaxed border-t border-white/20 pt-3">
            "{plan.authorNote}"
          </p>
        )}
      </div>
      <div className="bg-white border border-t-0 border-sage-100 rounded-b-2xl px-5 py-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-sage-500">
          <Users size={12} /> {plan.enrolledCount.toLocaleString()} enrolled
        </span>
        <span className="text-xs text-sage-500">{plan.duration} {plan.duration === 1 ? 'day' : plan.type === 'live' ? 'days' : 'chapters'}</span>
        {plan.isEnrolled ? (
          <div>
            {plan.progress !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-sage-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sage-500 rounded-full" style={{ width: `${plan.progress}%` }} />
                </div>
                <span className="text-xs text-sage-500">{plan.progress}%</span>
              </div>
            )}
          </div>
        ) : (
          <Button size="sm" variant="secondary">Join</Button>
        )}
      </div>
    </div>
  )
}
