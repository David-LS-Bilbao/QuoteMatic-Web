import { Outlet, useLocation } from 'react-router'

export function PageTransition() {
  const { key } = useLocation()

  return (
    <div key={key} className="page-transition">
      <Outlet />
    </div>
  )
}
