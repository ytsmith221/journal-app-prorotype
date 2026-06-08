import { cn } from '../../lib/utils'
import type { Role } from '../../lib/types'

interface AvatarProps {
  name: string
  src?: string
  role?: Role
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

const sizeClasses = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }

const roleColors: Record<Role, string> = {
  author: 'bg-bark-200 text-bark-800',
  admin: 'bg-sage-200 text-sage-800',
  reader: 'bg-earth-200 text-earth-800',
}

export function Avatar({ name, src, role = 'reader', size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white', sizeClasses[size], className)}
      />
    )
  }
  return (
    <span className={cn(
      'rounded-full flex items-center justify-center font-semibold ring-2 ring-white select-none',
      sizeClasses[size],
      roleColors[role],
      className
    )}>
      {initials(name)}
    </span>
  )
}
