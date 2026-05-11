import type React from 'react'
import { ChevronDown, X } from 'lucide-react'

type FilterControlProps = {
  icon: React.ReactNode
  label: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  drawerId: string
  drawerAriaLabel: string
  drawerTitle: string
  children: React.ReactNode
}

export function FilterControl({
  icon,
  label,
  isOpen,
  onToggle,
  onClose,
  drawerId,
  drawerAriaLabel,
  drawerTitle,
  children,
}: FilterControlProps) {
  return (
    <div className="explore-filter-control">
      <button
        className="filter-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls={drawerId}
        onClick={onToggle}
      >
        {icon}
        <span>{label}</span>
        <ChevronDown aria-hidden="true" size={16} />
      </button>

      {isOpen ? (
        <div
          className="filter-drawer"
          id={drawerId}
          aria-label={drawerAriaLabel}
        >
          <div className="filter-drawer-header">
            <strong>{drawerTitle}</strong>
            <button
              type="button"
              aria-label={`Cerrar selector de ${drawerTitle.toLowerCase()}`}
              onClick={onClose}
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>

          <div className="filter-drawer-options">{children}</div>
        </div>
      ) : null}
    </div>
  )
}
