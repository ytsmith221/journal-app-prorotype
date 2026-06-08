import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const pageTitles: Record<string, string> = {
  '/': '',
  '/prompts': 'Prompts',
  '/journal': 'My Journal',
  '/plans': 'Journal Plans',
  '/community': 'Community',
  '/feed': 'Feed',
  '/profile': 'Profile',
  '/author': 'Author Studio',
}

export function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { notifications } = useApp()
  const title = pageTitles[location.pathname]
  const isHome = location.pathname === '/'
  const canGoBack = !Object.keys(pageTitles).includes(location.pathname)

  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-sage-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {canGoBack ? (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-sage-600 hover:text-sage-800">
            <ChevronLeft size={22} />
          </button>
        ) : null}
        {isHome ? (
          <span className="font-serif text-sage-800 text-lg font-medium tracking-tight">The Way of Asking</span>
        ) : (
          <h1 className="font-serif text-sage-800 text-lg font-medium">{title}</h1>
        )}
      </div>
      <button
        onClick={() => navigate('/profile')}
        className="relative p-1.5 text-sage-600 hover:text-sage-800"
      >
        <Bell size={20} />
        {notifications > 0 && (
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-bark-500 rounded-full" />
        )}
      </button>
    </header>
  )
}
