import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Feather, MessageSquare, Share2, Heart, Pin, ChevronDown, ChevronUp } from 'lucide-react'
import { allPrompts, boardComments } from '../lib/data'
import { timeAgo } from '../lib/utils'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { useApp } from '../context/AppContext'
import type { BoardComment } from '../lib/types'

export function PromptDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEntryForPrompt } = useApp()
  const prompt = allPrompts.find(p => p.id === id)
  const entry = prompt ? getEntryForPrompt(prompt.id) : undefined
  const comments = boardComments.filter(c => c.promptId === id)
  const [commentText, setCommentText] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'board'>('write')
  const [localComments, setLocalComments] = useState(comments)
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({})
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})

  if (!prompt) return (
    <div className="p-8 text-center text-sage-400">
      <p className="font-serif text-lg">Prompt not found.</p>
    </div>
  )

  function submitComment() {
    if (!commentText.trim()) return
    const newComment: BoardComment = {
      id: `bc-${Date.now()}`,
      promptId: prompt!.id,
      userId: 'u1',
      user: { id: 'u1', name: 'Sarah M.', role: 'reader' },
      body: commentText,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByCurrentUser: false,
      replies: [],
    }
    setLocalComments(prev => [...prev, newComment])
    setCommentText('')
  }

  function toggleLike(commentId: string) {
    setCommentLikes(prev => ({ ...prev, [commentId]: (prev[commentId] ?? 0) === 0 ? 1 : 0 }))
  }

  return (
    <div>
      {/* Prompt hero */}
      <div className="bg-sage-800 px-5 pt-6 pb-8">
        <div className="flex gap-2 mb-4">
          {prompt.chapter && <Badge variant="tag">Chapter {prompt.chapter}</Badge>}
          {prompt.week > 0 && <Badge variant="tag">Week {prompt.week}</Badge>}
          {prompt.tags.map(t => <Badge key={t} variant="tag" className="bg-sage-700 text-sage-200">{t}</Badge>)}
        </div>
        <h1 className="font-serif text-cream text-2xl leading-tight">{prompt.title}</h1>
        {prompt.quote && (
          <p className="text-sage-300 italic text-sm mt-3 leading-relaxed">"{prompt.quote}"</p>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-[57px] z-10 bg-cream border-b border-sage-100 flex">
        {(['write', 'board'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-sage-800 border-b-2 border-sage-600'
                : 'text-sage-400'
            }`}
          >
            {tab === 'write' ? (
              <span className="flex items-center justify-center gap-1.5"><Feather size={14} /> Write</span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <MessageSquare size={14} /> Board
                {localComments.length > 0 && (
                  <span className="bg-sage-100 text-sage-600 text-xs rounded-full px-1.5">{localComments.length}</span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'write' && (
        <div className="px-4 py-5 space-y-4">
          {/* Prompt body */}
          <div className="bg-white rounded-2xl border border-sage-100 p-5">
            {prompt.body.split('\n\n').map((para, i) => (
              <p key={i} className={`leading-relaxed text-sage-700 ${i === 0 ? 'font-serif text-lg text-sage-900 mb-3' : 'text-sm mt-3'}`}>
                {para}
              </p>
            ))}
          </div>

          {/* Write or view entry */}
          {entry ? (
            <div
              onClick={() => navigate(`/journal/${entry.id}`)}
              className="bg-parchment rounded-2xl border border-earth-200 p-5 cursor-pointer hover:border-earth-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-earth-600">Your entry · {entry.wordCount} words</span>
                <Feather size={13} className="text-earth-500" />
              </div>
              <p className="text-sage-700 text-sm leading-relaxed line-clamp-4">{entry.body}</p>
              <p className="text-xs text-sage-400 mt-2">Tap to continue writing</p>
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate(`/journal/new?promptId=${prompt.id}`)}
            >
              <Feather size={16} /> Start writing
            </Button>
          )}

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" size="sm">
              <Share2 size={14} /> Share prompt
            </Button>
            <Button variant="secondary" className="flex-1" size="sm" onClick={() => setActiveTab('board')}>
              <MessageSquare size={14} /> Join discussion
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'board' && (
        <div className="px-4 py-5 space-y-4">
          {/* New comment */}
          <div className="bg-white rounded-2xl border border-sage-100 p-4">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Share something with the community…"
              className="w-full text-sm text-sage-800 placeholder-sage-300 bg-transparent resize-none outline-none min-h-[80px] leading-relaxed"
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" onClick={submitComment} disabled={!commentText.trim()}>Post</Button>
            </div>
          </div>

          {/* Comments */}
          {localComments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sage-400 font-serif">Be the first to share a thought.</p>
            </div>
          )}
          {localComments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              liked={commentLikes[comment.id] === 1}
              onLike={() => toggleLike(comment.id)}
              expanded={expandedReplies[comment.id]}
              onToggleReplies={() => setExpandedReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CommentCard({
  comment, liked, onLike, expanded, onToggleReplies
}: {
  comment: BoardComment
  liked: boolean
  onLike: () => void
  expanded: boolean
  onToggleReplies: () => void
}) {
  const likeCount = comment.likes + (liked ? 1 : 0)
  return (
    <div className={`bg-white rounded-2xl border p-4 ${comment.isPinned ? 'border-bark-200' : 'border-sage-100'}`}>
      {comment.isPinned && (
        <div className="flex items-center gap-1 text-xs text-bark-600 mb-2">
          <Pin size={11} /> Pinned by author
        </div>
      )}
      <div className="flex items-start gap-2.5">
        <Avatar name={comment.user.name} role={comment.user.role} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-sage-900">{comment.user.name}</span>
            {comment.user.role === 'author' && <Badge variant="author">Author</Badge>}
            {comment.user.role === 'admin' && <Badge variant="admin">Admin</Badge>}
            <span className="text-xs text-sage-400 ml-auto">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-sage-700 leading-relaxed mt-1">{comment.body}</p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={onLike}
              className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-bark-500' : 'text-sage-400 hover:text-sage-600'}`}
            >
              <Heart size={13} fill={liked ? 'currentColor' : 'none'} /> {likeCount}
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={onToggleReplies}
                className="flex items-center gap-1 text-xs text-sage-400 hover:text-sage-600"
              >
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && comment.replies && comment.replies.map(reply => (
        <div key={reply.id} className="mt-3 ml-8 pl-3 border-l border-sage-100 flex items-start gap-2.5">
          <Avatar name={reply.user.name} role={reply.user.role} size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-sage-900">{reply.user.name}</span>
              {reply.user.role === 'author' && <Badge variant="author">Author</Badge>}
              <span className="text-xs text-sage-400">{timeAgo(reply.createdAt)}</span>
            </div>
            <p className="text-sm text-sage-700 leading-relaxed mt-0.5">{reply.body}</p>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-sage-400">
              <Heart size={12} /> {reply.likes}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
