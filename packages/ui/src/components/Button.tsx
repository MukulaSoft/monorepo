import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../internal/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

type ButtonElement = ElementRef<'button'>

const VARIANT_CLASS_MAP: Record<ButtonVariant, string> = {
  primary: 'ms-btn--primary',
  secondary: 'ms-btn--secondary',
  ghost: 'ms-btn--ghost',
}

const SIZE_CLASS_MAP: Record<ButtonSize, string> = {
  sm: 'ms-btn--sm',
  md: 'ms-btn--md',
  lg: 'ms-btn--lg',
}

export const Button = forwardRef<ButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, ...props }: ButtonProps,
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn('ms-btn', VARIANT_CLASS_MAP[variant], SIZE_CLASS_MAP[size], className)}
      {...props}
    />
  )
})
