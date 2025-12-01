import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react'
import { cn } from '../internal/cn'

type InputElement = ElementRef<'input'>
type InputProps = ComponentPropsWithoutRef<'input'>

export type TextFieldProps = Omit<InputProps, 'size'> & {
  label?: string
  hint?: string
  error?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

export const TextField = forwardRef<InputElement, TextFieldProps>(function TextField(
  { label, hint, error, prefix, suffix, className, id, ...props }: TextFieldProps,
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? props.name ?? generatedId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  const hasPrefix = prefix !== undefined && prefix !== null
  const hasSuffix = suffix !== undefined && suffix !== null

  return (
    <div className={cn('ms-field', className)}>
      {label ? (
        <label className="ms-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          'ms-input-shell',
          hasPrefix && 'ms-input-shell--with-prefix',
          hasSuffix && 'ms-input-shell--with-suffix',
          error && 'ms-input-shell--error',
        )}
      >
        {hasPrefix ? <span className="ms-input-affix">{prefix}</span> : null}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn('ms-input', error && 'ms-input--error')}
          {...props}
        />

        {hasSuffix ? <span className="ms-input-affix">{suffix}</span> : null}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          className="ms-field__message ms-field__message--error"
          role="alert"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="ms-field__message ms-field__message--hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
})
