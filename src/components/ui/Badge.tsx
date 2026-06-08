import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'author' | 'admin' | 'tag' | 'live' | 'evergreen'
  className?: string
}

export function Badge({ children, variant = 'tag', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
      variant === 'author' && 'bg-bark-100 text-bark-700 border border-bark-200',
      variant === 'admin' && 'bg-sage-100 text-sage-700 border border-sage-200',
      variant === 'tag' && 'bg-earth-100 text-earth-700',
      variant === 'live' && 'bg-moss-100 text-moss-700 border border-moss-200',
      variant === 'evergreen' && 'bg-sage-100 text-sage-600',
      className
    )}>
      {variant === 'author' && <span className="w-1.5 h-1.5 rounded-full bg-bark-500 inline-block" />}
      {children}
    </span>
  )
}
