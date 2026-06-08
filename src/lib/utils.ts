import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(dateStr)
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function getTodayQuote(quotes: string[]): string {
  const day = new Date().getDay()
  return quotes[day % quotes.length]
}

export function isPromptLive(publishAt: string): boolean {
  return new Date(publishAt) <= new Date()
}

export function planColorClass(color: string): string {
  const map: Record<string, string> = {
    sage: 'bg-sage-100 border-sage-200',
    bark: 'bg-bark-100 border-bark-200',
    moss: 'bg-moss-100 border-moss-200',
    earth: 'bg-earth-100 border-earth-200',
  }
  return map[color] ?? 'bg-sage-100 border-sage-200'
}

export function planAccentClass(color: string): string {
  const map: Record<string, string> = {
    sage: 'text-sage-700 bg-sage-500',
    bark: 'text-bark-700 bg-bark-500',
    moss: 'text-moss-700 bg-moss-500',
    earth: 'text-earth-700 bg-earth-500',
  }
  return map[color] ?? 'text-sage-700 bg-sage-500'
}
