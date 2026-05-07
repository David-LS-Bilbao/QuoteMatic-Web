import { Outlet } from 'react-router'

import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
