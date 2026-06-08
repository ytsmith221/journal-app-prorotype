import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Check, Feather } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { allPrompts } from '../lib/data'
import { wordCount } from '../lib/utils'
import type { JournalEntry as JournalEntryType } from '../lib/types'

export function JournalEntry() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { entries, addEntry, updateEntry } = useApp()

  const isNew = id === 'new'
  const promptId = searchParams.get('promptId') ?? undefined
  const prompt = promptId ? allPrompts.find(p => p.id === promptId) : undefined

  const existingEntry = !isNew ? entries.find(e => e.id === id) : undefined

  const [body, setBody] = useState(existingEntry?.body ?? '')
  const [saved, setSaved] = useState(false)
  const [entryId] = useState(() => isNew ? `entry-${Date.now()}` : id!)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus()
  }, [])

  useEffect(() => {
    if (!body.trim()) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (isNew) {
        const entry: JournalEntryType = {
          id: entryId,
          promptId,
          userId: 'u1',
          body,
          wordCount: wordCount(body),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isShared: false,
        }
        addEntry(entry)
      } else {
        updateEntry(entryId, body)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 800)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [body])

  const wc = wordCount(body)

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Prompt context banner */}
      {prompt && (
        <div className="bg-sage-800 px-5 py-4">
          <p className="text-sage-300 text-xs font-medium mb-1">Writing to</p>
          <p className="font-serif text-cream text-base leading-snug">{prompt.title}</p>
        </div>
      )}

      {/* Writing area */}
      <div className="flex-1 px-5 pt-5">
        {!prompt && (
          <div className="flex items-center gap-2 mb-4 text-sage-400">
            <Feather size={16} />
            <span className="text-sm">Free write</span>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Begin here. There's no wrong way to do this…"
          className="w-full bg-transparent text-sage-800 text-[15px] leading-loose placeholder-sage-300 outline-none resize-none min-h-[60vh] font-sans"
        />
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-cream/95 backdrop-blur border-t border-sage-100 px-5 py-3 flex items-center justify-between">
        <span className="text-xs text-sage-400">{wc} {wc === 1 ? 'word' : 'words'}</span>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-sage-500">
              <Check size={12} /> Saved
            </span>
          )}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-sage-500 hover:text-sage-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
