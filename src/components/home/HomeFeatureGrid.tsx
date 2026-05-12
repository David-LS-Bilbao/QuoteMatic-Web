import { Badge } from '../ui'
import { featureCards } from './homeContent'

export function HomeFeatureGrid() {
  return (
    <div className="feature-grid" aria-label="Funciones principales">
      {featureCards.map((feature) => {
        const Icon = feature.icon

        return (
          <article className="feature-card" key={feature.title}>
            <div className="feature-card-icon" aria-hidden="true">
              <Icon size={22} />
            </div>

            <Badge variant="muted">{feature.badge}</Badge>

            <h2 className="feature-card-title">{feature.title}</h2>

            <p className="feature-card-description">{feature.description}</p>
          </article>
        )
      })}
    </div>
  )
}
