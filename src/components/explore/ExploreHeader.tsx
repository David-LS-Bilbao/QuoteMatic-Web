import { Badge } from '../ui'

export function ExploreHeader() {
  return (
    <div className="placeholder-header">
      <div className="home-badges">
        <Badge>Explorador</Badge>
        <Badge variant="accent">API real</Badge>
        <Badge variant="muted">localStorage</Badge>
      </div>

      <p className="eyebrow">Generador público</p>
      <h1>Encuentra una frase para este momento.</h1>

      <p className="page-lead">
        Filtra por texto, situación o tipo de frase. QuoteMatic te muestra una
        recomendación principal y una alternativa para seguir explorando sin
        ruido visual.
      </p>
    </div>
  )
}
