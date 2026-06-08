import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopBar } from './TopBar'

export function AppShell() {
  const location = useLocation()
  const isEntry = location.pathname.startsWith('/journal/') && location.pathname !== '/journal'

  return (
    <div className="min-h-screen bg-cream flex flex-col max-w-md mx-auto relative">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>
      {!isEntry && <BottomNav />}
    </div>
  )
}
