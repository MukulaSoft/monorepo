import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementRef,
} from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

type ButtonElement = ElementRef<'button'>

const BASE_STYLES: CSSProperties = {
  alignItems: 'center',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  display: 'inline-flex',
  fontWeight: 600,
  gap: '0.35rem',
  justifyContent: 'center',
  lineHeight: 1.3,
  transition: 'transform 120ms ease, box-shadow 120ms ease',
}

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: '#2563eb',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: '#f4f4f5',
    color: '#0f172a',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#2563eb',
  },
}

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: {
    fontSize: '0.85rem',
    padding: '0.4rem 0.9rem',
  },
  md: {
    fontSize: '0.95rem',
    padding: '0.55rem 1.2rem',
  },
  lg: {
    fontSize: '1.05rem',
    padding: '0.7rem 1.5rem',
  },
}

export const Button = forwardRef<ButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', style: styleOverrides, ...props }: ButtonProps,
  ref,
) {
  const variantKey: ButtonVariant = variant ?? 'primary'
  const sizeKey: ButtonSize = size ?? 'md'

  return (
    <button
      ref={ref}
      style={{
        ...BASE_STYLES,
        ...VARIANT_STYLES[variantKey],
        ...SIZE_STYLES[sizeKey],
        ...styleOverrides,
      }}
      {...props}
    />
  )
})
