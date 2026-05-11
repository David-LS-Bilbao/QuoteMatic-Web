// Componente reusable para badges

import type { HTMLAttributes, ReactNode } from 'react'

// Tipos
type BadgeVariant = 'primary' | 'accent' | 'muted'
// Propiedades
type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: BadgeVariant
}

// Componente Badge
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


/*
crea una etiqueta visual reutilizable para estados como Demo visual,
Próximamente o API REST.
*/