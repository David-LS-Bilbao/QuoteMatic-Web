import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'primary' | 'accent' | 'muted'

/** Etiqueta visual para estados como "Demo visual", "Próximamente" o "API REST". */
type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: BadgeVariant
}

export function Badge({
  children,
  variant = 'primary',
  className = '',
  ...props
}: BadgeProps) {
  const classes = ['ui-badge', `ui-badge-${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}
