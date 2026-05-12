import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'

import type { UseExploreQuotesResult } from '../../hooks/useExploreQuotes'
import { FilterControl } from '../ui'

type ExploreFiltersProps = Pick<
  UseExploreQuotesResult,
  | 'filters'
  | 'searchInput'
  | 'situations'
  | 'quoteTypes'
  | 'activeFilterDrawer'
  | 'isLoading'
  | 'hasActiveFilters'
  | 'selectedSituationLabel'
  | 'selectedQuoteTypeLabel'
  | 'setSearchInput'
  | 'setActiveFilterDrawer'
  | 'handleSearchSubmit'
  | 'handleSituationChange'
  | 'handleQuoteTypeChange'
  | 'handleClearFilters'
>

export function ExploreFilters({
  filters,
  searchInput,
  situations,
  quoteTypes,
  activeFilterDrawer,
  isLoading,
  hasActiveFilters,
  selectedSituationLabel,
  selectedQuoteTypeLabel,
  setSearchInput,
  setActiveFilterDrawer,
  handleSearchSubmit,
  handleSituationChange,
  handleQuoteTypeChange,
  handleClearFilters,
}: ExploreFiltersProps) {
  return (
    <form className="explore-filters" onSubmit={handleSearchSubmit}>
      <label className="explore-search">
        <Search aria-hidden="true" size={18} />
        <span className="sr-only">Buscar frases</span>
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar por texto..."
        />
      </label>

      <FilterControl
        icon={<Filter aria-hidden="true" size={18} />}
        label={selectedSituationLabel}
        isOpen={activeFilterDrawer === 'situation'}
        onToggle={() =>
          setActiveFilterDrawer((d) => (d === 'situation' ? null : 'situation'))
        }
        onClose={() => setActiveFilterDrawer(null)}
        drawerId="situation-filter-drawer"
        drawerAriaLabel="Seleccionar situación"
        drawerTitle="Situación"
      >
        <button
          className={
            filters.situation === ''
              ? 'filter-option filter-option-active'
              : 'filter-option'
          }
          type="button"
          onClick={() => handleSituationChange('')}
        >
          Todas las situaciones
        </button>

        {situations.map((situation) => (
          <button
            className={
              filters.situation === situation.slug
                ? 'filter-option filter-option-active'
                : 'filter-option'
            }
            key={situation._id}
            type="button"
            onClick={() => handleSituationChange(situation.slug)}
          >
            {situation.name}
          </button>
        ))}
      </FilterControl>

      <FilterControl
        icon={<SlidersHorizontal aria-hidden="true" size={18} />}
        label={selectedQuoteTypeLabel}
        isOpen={activeFilterDrawer === 'quoteType'}
        onToggle={() =>
          setActiveFilterDrawer((d) => (d === 'quoteType' ? null : 'quoteType'))
        }
        onClose={() => setActiveFilterDrawer(null)}
        drawerId="quote-type-filter-drawer"
        drawerAriaLabel="Seleccionar tipo de frase"
        drawerTitle="Tipo de frase"
      >
        <button
          className={
            filters.quoteType === ''
              ? 'filter-option filter-option-active'
              : 'filter-option'
          }
          type="button"
          onClick={() => handleQuoteTypeChange('')}
        >
          Todos los tipos
        </button>

        {quoteTypes.map((quoteType) => (
          <button
            className={
              filters.quoteType === quoteType.slug
                ? 'filter-option filter-option-active'
                : 'filter-option'
            }
            key={quoteType._id}
            type="button"
            onClick={() => handleQuoteTypeChange(quoteType.slug)}
          >
            {quoteType.name}
          </button>
        ))}
      </FilterControl>

      <button
        className="ui-button ui-button-primary ui-button-md"
        type="submit"
        disabled={isLoading}
      >
        Buscar
      </button>

      {hasActiveFilters ? (
        <button
          className="ui-button ui-button-ghost ui-button-md"
          type="button"
          onClick={handleClearFilters}
        >
          <X aria-hidden="true" size={18} />
          Limpiar
        </button>
      ) : null}
    </form>
  )
}
