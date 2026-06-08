import { Flame, Feather, BookMarked, Bell, Shield, ChevronRight, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'

const notifications = [
  { id: 'n1', message: "The author replied to Jordan's comment on Week 2.", time: '2h ago', read: false },
  { id: 'n2', message: 'New weekly prompt is live — Week 2.', time: '1d ago', read: false },
  { id: 'n3', message: 'Mae R. wrote to the same prompt as you.', time: '2d ago', read: true },
]

export function Profile() {
  const { user, entries } = useApp()
  const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0)
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-sage-100 p-5">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} role={user.role} size="lg" />
          <div>
            <h2 className="font-serif text-xl text-sage-900">{user.name}</h2>
            <p className="text-xs text-sage-500 mt-0.5">{user.email}</p>
            {user.role !== 'reader' && (
              <Badge variant={user.role === 'author' ? 'author' : 'admin'} className="mt-1">
                {user.role === 'author' ? 'Author' : 'Admin'}
              </Badge>
            )}
          </div>
        </div>
        {user.bio && (
          <p className="text-sm text-sage-600 italic mt-4 leading-relaxed">"{user.bio}"</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame, label: 'Streak', value: `${user.streak}d`, color: 'text-bark-500 bg-bark-100' },
          { icon: Feather, label: 'Entries', value: user.totalEntries, color: 'text-sage-600 bg-sage-100' },
          { icon: BookMarked, label: 'Words', value: totalWords > 999 ? `${Math.floor(totalWords/1000)}k` : totalWords, color: 'text-moss-600 bg-moss-100' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-sage-100 p-3 text-center">
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mx-auto mb-1.5`}>
              <Icon size={15} />
            </div>
            <p className="font-bold text-sage-900">{value}</p>
            <p className="text-[10px] text-sage-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-sage-500 uppercase tracking-wider flex items-center gap-1.5">
            <Bell size={12} /> Notifications
            {unread > 0 && (
              <span className="bg-bark-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{unread}</span>
            )}
          </p>
        </div>
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`rounded-xl border px-4 py-3 ${n.read ? 'bg-white border-sage-100' : 'bg-bark-50 border-bark-200'}`}>
              <p className={`text-sm leading-relaxed ${n.read ? 'text-sage-600' : 'text-sage-900'}`}>{n.message}</p>
              <p className="text-xs text-sage-400 mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-sage-100 overflow-hidden">
        {[
          { icon: Bell, label: 'Notification preferences' },
          { icon: Shield, label: 'Privacy settings' },
          { icon: Feather, label: 'Journal export' },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-sage-50 last:border-0 hover:bg-sage-50 transition-colors">
            <Icon size={16} className="text-sage-500" />
            <span className="text-sm text-sage-800">{label}</span>
            <ChevronRight size={14} className="text-sage-300 ml-auto" />
          </button>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-sage-400 hover:text-sage-600">
        <LogOut size={15} /> Sign out
      </button>
    </div>
  )
}
