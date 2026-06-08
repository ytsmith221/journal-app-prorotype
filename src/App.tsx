import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import { Home } from './pages/Home'
import { Prompts } from './pages/Prompts'
import { PromptDetail } from './pages/PromptDetail'
import { Journal } from './pages/Journal'
import { JournalEntry } from './pages/JournalEntry'
import { Plans } from './pages/Plans'
import { PlanDetail } from './pages/PlanDetail'
import { Feed } from './pages/Feed'
import { Community } from './pages/Community'
import { Profile } from './pages/Profile'
import { AuthorStudio } from './pages/AuthorStudio'
import { Auth } from './pages/Auth'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/prompts/:id" element={<PromptDetail />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:id" element={<JournalEntry />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/plans/:id" element={<PlanDetail />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/author" element={<AuthorStudio />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
