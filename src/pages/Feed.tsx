import { useState } from 'react'
import { Heart, MessageCircle, Volume2, Image, Type, AlignLeft, Film, Plus, X } from 'lucide-react'
import { feedPosts } from '../lib/data'
import { timeAgo } from '../lib/utils'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import type { FeedPost, FeedMediaType } from '../lib/types'

export function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>(feedPosts)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [newComments, setNewComments] = useState<Record<string, string>>({})
  const [composing, setComposing] = useState(false)
  const [composeText, setComposeText] = useState('')
  const [composeType, setComposeType] = useState<FeedMediaType>('short-text')

  function toggleLike(postId: string) {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  function submitComment(postId: string) {
    const text = newComments[postId]?.trim()
    if (!text) return
    setPosts(prev => prev.map(p =>
      p.id !== postId ? p : {
        ...p,
        comments: [...p.comments, {
          id: `fc-${Date.now()}`,
          postId,
          userId: 'u1',
          user: { id: 'u1', name: 'Sarah M.', role: 'reader' },
          body: text,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedByCurrentUser: false,
        }]
      }
    ))
    setNewComments(prev => ({ ...prev, [postId]: '' }))
  }

  function submitPost() {
    if (!composeText.trim()) return
    const newPost: FeedPost = {
      id: `fp-${Date.now()}`,
      userId: 'u1',
      user: { id: 'u1', name: 'Sarah M.', role: 'reader' },
      mediaType: composeType,
      body: composeText,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByCurrentUser: false,
      comments: [],
    }
    setPosts(prev => [newPost, ...prev])
    setComposeText('')
    setComposing(false)
  }

  return (
    <div>
      {/* Compose bar */}
      <div className="px-4 pt-4 pb-2">
        {!composing ? (
          <button
            onClick={() => setComposing(true)}
            className="w-full flex items-center gap-3 bg-white border border-sage-100 rounded-2xl px-4 py-3 text-left"
          >
            <Avatar name="Sarah M." role="reader" size="sm" />
            <span className="text-sage-400 text-sm flex-1">Share something with the community…</span>
            <Plus size={16} className="text-sage-400" />
          </button>
        ) : (
          <div className="bg-white rounded-2xl border border-sage-200 p-4 shadow-warm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                {([
                  { type: 'short-text', icon: Type, label: 'Short' },
                  { type: 'long-text', icon: AlignLeft, label: 'Long' },
                  { type: 'image', icon: Image, label: 'Photo' },
                  { type: 'audio', icon: Volume2, label: 'Audio' },
                ] as const).map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setComposeType(type)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                      composeType === type ? 'bg-sage-100 text-sage-700' : 'text-sage-400'
                    }`}
                  >
                    <Icon size={12} /> {label}
                  </button>
                ))}
              </div>
              <button onClick={() => setComposing(false)}><X size={16} className="text-sage-400" /></button>
            </div>
            <textarea
              value={composeText}
              onChange={e => setComposeText(e.target.value)}
              placeholder={
                composeType === 'short-text' ? 'A thought, a line, a small truth…'
                : composeType === 'long-text' ? 'Write something longer…'
                : 'Describe your photo or audio…'
              }
              className="w-full text-sm text-sage-800 placeholder-sage-300 bg-transparent resize-none outline-none min-h-[80px] leading-relaxed"
              autoFocus
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={submitPost}
                disabled={!composeText.trim()}
                className="bg-sage-600 text-white text-sm px-4 py-2 rounded-xl disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="px-4 py-2 space-y-4 pb-6">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            liked={likedPosts[post.id] ?? false}
            onLike={() => toggleLike(post.id)}
            commentsOpen={expandedComments[post.id] ?? false}
            onToggleComments={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
            commentDraft={newComments[post.id] ?? ''}
            onCommentChange={text => setNewComments(prev => ({ ...prev, [post.id]: text }))}
            onCommentSubmit={() => submitComment(post.id)}
          />
        ))}
      </div>
    </div>
  )
}

function PostCard({
  post, liked, onLike, commentsOpen, onToggleComments, commentDraft, onCommentChange, onCommentSubmit
}: {
  post: FeedPost
  liked: boolean
  onLike: () => void
  commentsOpen: boolean
  onToggleComments: () => void
  commentDraft: string
  onCommentChange: (t: string) => void
  onCommentSubmit: () => void
}) {
  const likeCount = post.likes + (liked ? 1 : 0)
  const isAuthor = post.user.role === 'author'

  return (
    <article className={`bg-white rounded-2xl border overflow-hidden shadow-warm ${isAuthor ? 'border-bark-200' : 'border-sage-100'}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2.5">
        <Avatar name={post.user.name} role={post.user.role} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-sage-900">{post.user.name}</span>
            {post.user.role === 'author' && <Badge variant="author">Author</Badge>}
            {post.user.role === 'admin' && <Badge variant="admin">Admin</Badge>}
          </div>
          <span className="text-xs text-sage-400">{timeAgo(post.createdAt)}</span>
        </div>
        <MediaTypeIcon type={post.mediaType} />
      </div>

      {/* Media */}
      {post.mediaType === 'image' && post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt=""
          className="w-full object-cover max-h-72"
        />
      )}
      {post.mediaType === 'audio' && (
        <div className="mx-4 mb-3 bg-sage-50 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-sage-200 rounded-full flex items-center justify-center">
            <Volume2 size={16} className="text-sage-600" />
          </div>
          <div>
            <p className="text-sm text-sage-700 font-medium">Audio reflection</p>
            <p className="text-xs text-sage-400">{post.audioDuration}</p>
          </div>
          <button className="ml-auto bg-sage-600 text-white text-xs px-3 py-1.5 rounded-lg">Play</button>
        </div>
      )}

      {/* Body */}
      <div className="px-4 pb-3">
        <p className={`text-sage-800 leading-relaxed whitespace-pre-line ${
          post.mediaType === 'short-text' ? 'text-lg font-serif' : 'text-sm'
        }`}>
          {post.body}
        </p>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t border-sage-50 flex items-center gap-4">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-bark-500' : 'text-sage-400 hover:text-sage-600'}`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          <span className="text-xs">{likeCount}</span>
        </button>
        <button
          onClick={onToggleComments}
          className="flex items-center gap-1.5 text-sm text-sage-400 hover:text-sage-600"
        >
          <MessageCircle size={16} />
          <span className="text-xs">{post.comments.length}</span>
        </button>
      </div>

      {/* Comments */}
      {commentsOpen && (
        <div className="border-t border-sage-50 bg-sage-50/50 px-4 py-3 space-y-3">
          {post.comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-2.5">
              <Avatar name={comment.user.name} role={comment.user.role} size="sm" />
              <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-sage-100">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-medium text-sage-800">{comment.user.name}</span>
                  {comment.user.role === 'author' && <Badge variant="author">Author</Badge>}
                  {comment.user.role === 'admin' && <Badge variant="admin">Admin</Badge>}
                </div>
                <p className="text-xs text-sage-700 leading-relaxed">{comment.body}</p>
                <div className="flex items-center gap-1 mt-1 text-sage-400">
                  <Heart size={11} />
                  <span className="text-[10px]">{comment.likes}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add comment */}
          <div className="flex items-center gap-2 mt-2">
            <Avatar name="Sarah M." role="reader" size="sm" />
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-sage-100 px-3 py-2">
              <input
                value={commentDraft}
                onChange={e => onCommentChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onCommentSubmit()}
                placeholder="Add a comment…"
                className="flex-1 text-xs text-sage-800 placeholder-sage-300 bg-transparent outline-none"
              />
              <button
                onClick={onCommentSubmit}
                disabled={!commentDraft.trim()}
                className="text-xs text-sage-500 hover:text-sage-700 disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

function MediaTypeIcon({ type }: { type: FeedMediaType }) {
  const props = { size: 13, className: 'text-sage-400' }
  if (type === 'image') return <Image {...props} />
  if (type === 'audio') return <Volume2 {...props} />
  if (type === 'video') return <Film {...props} />
  if (type === 'long-text') return <AlignLeft {...props} />
  return <Type {...props} />
}
