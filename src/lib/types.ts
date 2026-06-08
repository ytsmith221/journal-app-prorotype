export type Role = 'reader' | 'author' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: Role
  joinedAt: string
  streak: number
  totalEntries: number
  bio?: string
}

export interface Prompt {
  id: string
  week: number
  chapter?: number
  title: string
  body: string
  quote?: string
  publishAt: string
  planId?: string
  tags: string[]
}

export interface JournalEntry {
  id: string
  promptId?: string
  userId: string
  body: string
  wordCount: number
  createdAt: string
  updatedAt: string
  isShared: boolean
  mood?: string
}

export interface BoardComment {
  id: string
  promptId: string
  userId: string
  user: Pick<User, 'id' | 'name' | 'avatar' | 'role'>
  body: string
  createdAt: string
  likes: number
  likedByCurrentUser: boolean
  parentId?: string
  replies?: BoardComment[]
  isPinned?: boolean
}

export interface Plan {
  id: string
  title: string
  subtitle: string
  description: string
  type: 'live' | 'evergreen'
  startDate?: string
  duration: number
  coverColor: string
  promptIds: string[]
  enrolledCount: number
  authorNote?: string
  isEnrolled?: boolean
  progress?: number
}

export type FeedMediaType = 'image' | 'video' | 'audio' | 'short-text' | 'long-text'

export interface FeedPost {
  id: string
  userId: string
  user: Pick<User, 'id' | 'name' | 'avatar' | 'role'>
  mediaType: FeedMediaType
  body: string
  mediaUrl?: string
  thumbnailUrl?: string
  audioDuration?: string
  createdAt: string
  likes: number
  likedByCurrentUser: boolean
  comments: FeedComment[]
}

export interface FeedComment {
  id: string
  postId: string
  userId: string
  user: Pick<User, 'id' | 'name' | 'avatar' | 'role'>
  body: string
  createdAt: string
  likes: number
  likedByCurrentUser: boolean
}

export interface Notification {
  id: string
  type: 'new_prompt' | 'reply' | 'friend_share' | 'author_comment' | 'plan_day'
  message: string
  createdAt: string
  read: boolean
  linkTo?: string
}
