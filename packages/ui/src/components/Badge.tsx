import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../internal/cn'

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type BadgeVariant = 'solid' | 'soft' | 'outline'

export type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  tone?: BadgeTone
  variant?: BadgeVariant
}

type BadgeElement = ElementRef<'span'>

export const Badge = forwardRef<BadgeElement, BadgeProps>(function Badge(
  { tone = 'neutral', variant = 'soft', className, ...props }: BadgeProps,
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn('ms-badge', `ms-badge--tone-${tone}`, `ms-badge--${variant}`, className)}
      {...props}
    />
  )
})
