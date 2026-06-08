import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen bg-sage-800 flex flex-col items-center justify-center px-6">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🌿</span>
        </div>
        <h1 className="font-serif text-cream text-3xl">The Way of Asking</h1>
        <p className="text-sage-400 text-sm mt-2">A journaling companion for the book</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-bark">
        <div className="flex gap-1 mb-5 bg-sage-50 rounded-xl p-1">
          {(['signin', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === m ? 'bg-white text-sage-800 shadow-sm' : 'text-sage-400'
              }`}
            >
              {m === 'signin' ? 'Sign in' : 'Join'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-sage-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-400 text-sage-800 placeholder-sage-300"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-sage-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-400 text-sage-800 placeholder-sage-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-sage-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage-400 text-sage-800 placeholder-sage-300"
          />
          <Button size="lg" className="w-full mt-1" onClick={() => navigate('/')}>
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </Button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sage-100" /></div>
          <div className="relative text-center"><span className="bg-white px-2 text-xs text-sage-400">or</span></div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full border border-sage-200 rounded-xl py-3 text-sm text-sage-700 font-medium flex items-center justify-center gap-2 hover:bg-sage-50 transition-colors"
        >
          <span>G</span> Continue with Google
        </button>

        <p className="text-xs text-sage-400 text-center mt-4 leading-relaxed">
          Your journal entries are private by default.<br />You choose what to share.
        </p>
      </div>
    </div>
  )
}
