import { cn } from '../../lib/utils'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'bark'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3.5 text-base',
        variant === 'primary' && 'bg-sage-600 text-white hover:bg-sage-700 shadow-sm',
        variant === 'bark' && 'bg-bark-500 text-white hover:bg-bark-600 shadow-sm',
        variant === 'secondary' && 'bg-sage-100 text-sage-800 hover:bg-sage-200 border border-sage-200',
        variant === 'ghost' && 'text-sage-700 hover:bg-sage-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
