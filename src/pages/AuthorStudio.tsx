import { useState } from 'react'
import { CalendarPlus, Megaphone, Users, BookMarked, BarChart3, Zap } from 'lucide-react'
import { weeklyPrompts, plans } from '../lib/data'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { formatDate } from '../lib/utils'

export function AuthorStudio() {
  const [tab, setTab] = useState<'overview' | 'prompts' | 'plans' | 'broadcast'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'prompts', label: 'Prompts' },
    { id: 'plans', label: 'Plans' },
    { id: 'broadcast', label: 'Broadcast' },
  ] as const

  return (
    <div>
      <div className="bg-sage-800 px-5 pt-5 pb-6">
        <p className="text-sage-400 text-xs mb-1">Author Studio</p>
        <h1 className="font-serif text-cream text-2xl">Your Dashboard</h1>
        <p className="text-sage-400 text-sm mt-1">Manage content, engage your readers.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sage-100 bg-white px-4 gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-3 px-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t.id ? 'text-sage-800 border-sage-600' : 'text-sage-400 border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-5">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'prompts' && <PromptsTab />}
        {tab === 'plans' && <PlansTab />}
        {tab === 'broadcast' && <BroadcastTab />}
      </div>
    </div>
  )
}

function OverviewTab() {
  const stats = [
    { label: 'Total readers', value: '2,841', icon: Users, color: 'bg-sage-100 text-sage-600' },
    { label: 'Entries this week', value: '634', icon: BookMarked, color: 'bg-bark-100 text-bark-600' },
    { label: 'Board comments', value: '189', icon: BarChart3, color: 'bg-moss-100 text-moss-600' },
    { label: 'Active in plans', value: '1,209', icon: Zap, color: 'bg-earth-100 text-earth-600' },
  ]
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-sage-100 p-4">
            <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center mb-2`}>
              <s.icon size={16} />
            </div>
            <p className="text-2xl font-bold text-sage-900">{s.value}</p>
            <p className="text-xs text-sage-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-bark-50 rounded-2xl border border-bark-200 px-5 py-4">
        <p className="text-xs font-semibold text-bark-700 uppercase tracking-wider mb-1">Reader sentiment</p>
        <p className="text-sm text-bark-800 leading-relaxed">
          This week's prompt on dreaming generated the highest engagement so far — 341 entries, 47 board comments. Readers are resonating most with the permission framing.
        </p>
      </div>
    </div>
  )
}

function PromptsTab() {
  const [showForm, setShowForm] = useState(false)
  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(!showForm)} className="w-full" variant="secondary">
        <CalendarPlus size={15} /> Schedule new prompt
      </Button>
      {showForm && (
        <div className="bg-white rounded-2xl border border-sage-200 p-4 space-y-3">
          <input className="w-full border border-sage-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage-400" placeholder="Prompt question…" />
          <textarea className="w-full border border-sage-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage-400 min-h-[80px] resize-none" placeholder="Prompt body / context…" />
          <input className="w-full border border-sage-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage-400" placeholder="Author quote (optional)…" />
          <input type="date" className="w-full border border-sage-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage-400" />
          <Button size="sm" className="w-full">Save prompt</Button>
        </div>
      )}
      <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider">Scheduled</p>
      {weeklyPrompts.map(p => (
        <div key={p.id} className="bg-white rounded-xl border border-sage-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <Badge variant="tag">Week {p.week}</Badge>
            <span className="text-xs text-sage-400">{formatDate(p.publishAt)}</span>
          </div>
          <p className="font-serif text-sage-900 text-sm mt-1.5 leading-snug">{p.title}</p>
        </div>
      ))}
    </div>
  )
}

function PlansTab() {
  return (
    <div className="space-y-3">
      <Button className="w-full" variant="secondary">
        <Zap size={15} /> Create live plan
      </Button>
      {plans.map(plan => (
        <div key={plan.id} className="bg-white rounded-xl border border-sage-100 px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-sage-900 text-sm">{plan.title}</p>
            <Badge variant={plan.type === 'live' ? 'live' : 'evergreen'}>{plan.type}</Badge>
          </div>
          <p className="text-xs text-sage-500">{plan.enrolledCount.toLocaleString()} enrolled · {plan.duration} {plan.type === 'live' ? 'days' : 'chapters'}</p>
        </div>
      ))}
    </div>
  )
}

function BroadcastTab() {
  const [msg, setMsg] = useState('')
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-sage-200 p-4">
        <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Megaphone size={12} /> Broadcast message
        </p>
        <p className="text-xs text-sage-500 mb-3">Sends a push notification + in-app message to all active readers.</p>
        <textarea
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Write something to your readers…"
          className="w-full border border-sage-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-sage-400 min-h-[100px] resize-none"
        />
        <Button size="sm" className="mt-3 w-full" variant="bark" disabled={!msg.trim()}>
          Send to all readers
        </Button>
      </div>
    </div>
  )
}
