import { useNavigate } from 'react-router-dom'
import { MessageSquare, ArrowRight, Pin } from 'lucide-react'
import { weeklyPrompts, boardComments } from '../lib/data'
import { isPromptLive, timeAgo } from '../lib/utils'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'

export function Community() {
  const navigate = useNavigate()
  const live = weeklyPrompts.filter(p => isPromptLive(p.publishAt))

  return (
    <div className="px-4 py-5 space-y-5">
      <p className="text-sage-600 text-sm leading-relaxed">
        Join the conversation around each prompt. The author reads and responds here.
      </p>

      {live.map(prompt => {
        const promptComments = boardComments.filter(c => c.promptId === prompt.id)
        const pinned = promptComments.find(c => c.isPinned)
        const total = promptComments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0)

        return (
          <div
            key={prompt.id}
            onClick={() => navigate(`/prompts/${prompt.id}?tab=board`)}
            className="bg-white rounded-2xl border border-sage-100 overflow-hidden shadow-warm cursor-pointer hover:border-sage-200 transition-colors"
          >
            <div className="px-5 py-4 border-b border-sage-50">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="tag">Week {prompt.week}</Badge>
              </div>
              <h3 className="font-serif text-sage-900 text-lg leading-snug">{prompt.title}</h3>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-sage-400">
                <MessageSquare size={12} />
                <span>{total} {total === 1 ? 'comment' : 'comments'}</span>
                <ArrowRight size={12} className="ml-auto" />
              </div>
            </div>

            {pinned && (
              <div className="px-5 py-3 bg-bark-50">
                <div className="flex items-center gap-1 text-[10px] text-bark-600 mb-1.5">
                  <Pin size={10} /> Author's note
                </div>
                <div className="flex items-start gap-2.5">
                  <Avatar name={pinned.user.name} role="author" size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-sage-900">{pinned.user.name}</span>
                      <Badge variant="author">Author</Badge>
                      <span className="text-[10px] text-sage-400 ml-auto">{timeAgo(pinned.createdAt)}</span>
                    </div>
                    <p className="text-xs text-sage-700 leading-relaxed mt-0.5 line-clamp-2">{pinned.body}</p>
                  </div>
                </div>
              </div>
            )}

            {promptComments.filter(c => !c.isPinned).slice(0, 2).map(comment => (
              <div key={comment.id} className="px-5 py-3 border-t border-sage-50 flex items-start gap-2.5">
                <Avatar name={comment.user.name} role={comment.user.role} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-sage-800">{comment.user.name}</span>
                    <span className="text-[10px] text-sage-400 ml-auto">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs text-sage-600 leading-relaxed mt-0.5 line-clamp-2">{comment.body}</p>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
