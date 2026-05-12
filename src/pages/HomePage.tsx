import { HomeFeatureGrid } from '../components/home/HomeFeatureGrid'
import { HomeInfoPanel } from '../components/home/HomeInfoPanel'
import { HomeQuoteSpotlight } from '../components/home/HomeQuoteSpotlight'

export function HomePage() {
  return (
    <section className="page-section home-page">
      <HomeQuoteSpotlight />
      <HomeFeatureGrid />
      <HomeInfoPanel />
    </section>
  )
}
