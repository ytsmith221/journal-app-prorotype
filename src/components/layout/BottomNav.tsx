import { NavLink } from 'react-router-dom'
import { Home, BookOpen, PenLine, BookMarked, Users, Rss } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useApp } from '../../context/AppContext'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/prompts', icon: BookOpen, label: 'Prompts' },
  { to: '/journal', icon: PenLine, label: 'Journal' },
  { to: '/plans', icon: BookMarked, label: 'Plans' },
  { to: '/feed', icon: Rss, label: 'Feed' },
  { to: '/community', icon: Users, label: 'Board' },
]

export function BottomNav() {
  const { user } = useApp()
  const items = user.role === 'author'
    ? [...navItems, { to: '/author', icon: BookMarked, label: 'Studio' }]
    : navItems

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t border-sage-100 pb-safe z-30">
      <div className="flex items-center justify-around px-1 pt-1 pb-2">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[44px]',
              isActive ? 'text-sage-700' : 'text-sage-400 hover:text-sage-600'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className={cn('text-[10px] font-medium', isActive ? 'text-sage-700' : 'text-sage-400')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
