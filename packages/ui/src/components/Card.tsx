import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../internal/cn'

type DivProps = ComponentPropsWithoutRef<'div'>

type CardElement = ElementRef<'div'>

type TitleElement = ElementRef<'h3'>

type TitleProps = ComponentPropsWithoutRef<'h3'>

type ParagraphProps = ComponentPropsWithoutRef<'p'>

type CardSectionProps = ComponentPropsWithoutRef<'div'>

export const Card = forwardRef<CardElement, DivProps>(function Card({ className, ...props }, ref) {
  return <div ref={ref} className={cn('ms-card', className)} {...props} />
})

export const CardHeader = forwardRef<CardElement, CardSectionProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('ms-card__header', className)} {...props} />
})

export const CardTitle = forwardRef<TitleElement, TitleProps>(function CardTitle(
  { className, ...props },
  ref,
) {
  return <h3 ref={ref} className={cn('ms-card__title', className)} {...props} />
})

export const CardDescription = forwardRef<ElementRef<'p'>, ParagraphProps>(function CardDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cn('ms-card__description', className)} {...props} />
})

export const CardContent = forwardRef<CardElement, CardSectionProps>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('ms-card__content', className)} {...props} />
})

export const CardFooter = forwardRef<CardElement, CardSectionProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn('ms-card__footer', className)} {...props} />
})
