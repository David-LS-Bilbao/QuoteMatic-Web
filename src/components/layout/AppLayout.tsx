import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { PageTransition } from './PageTransition'

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <PageTransition />
      </main>
      <Footer />
    </div>
  )
}
