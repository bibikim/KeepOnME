import type { ComponentPropsWithoutRef, ElementType } from 'react'

type CardProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>

export function Card<T extends ElementType = 'div'>({ as, className = '', ...props }: CardProps<T>) {
  const Component = as ?? 'div'
  return (
    <Component
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
      {...props}
    />
  )
}
