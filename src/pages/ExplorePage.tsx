import { ExploreFilters } from '../components/explore/ExploreFilters'
import { ExploreHeader } from '../components/explore/ExploreHeader'
import { ExploreResults } from '../components/explore/ExploreResults'
import { ExploreSummary } from '../components/explore/ExploreSummary'
import { useExploreQuotes } from '../hooks/useExploreQuotes'

export function ExplorePage() {
  const explore = useExploreQuotes()

  return (
    <section className="page-section explore-page">
      <ExploreHeader />

      <ExploreFilters
        filters={explore.filters}
        searchInput={explore.searchInput}
        situations={explore.situations}
        quoteTypes={explore.quoteTypes}
        activeFilterDrawer={explore.activeFilterDrawer}
        isLoading={explore.isLoading}
        hasActiveFilters={explore.hasActiveFilters}
        selectedSituationLabel={explore.selectedSituationLabel}
        selectedQuoteTypeLabel={explore.selectedQuoteTypeLabel}
        setSearchInput={explore.setSearchInput}
        setActiveFilterDrawer={explore.setActiveFilterDrawer}
        handleSearchSubmit={explore.handleSearchSubmit}
        handleSituationChange={explore.handleSituationChange}
        handleQuoteTypeChange={explore.handleQuoteTypeChange}
        handleClearFilters={explore.handleClearFilters}
      />

      <ExploreSummary
        catalogError={explore.catalogError}
        isLoading={explore.isLoading}
        totalQuotes={explore.totalQuotes}
        hasActiveFilters={explore.hasActiveFilters}
      />

      <ExploreResults
        quotesError={explore.quotesError}
        isLoading={explore.isLoading}
        isResultsTransitioning={explore.isResultsTransitioning}
        hasCompletedInitialLoad={explore.hasCompletedInitialLoad}
        quotes={explore.quotes}
        handleGenerateMore={explore.handleGenerateMore}
        handleClearFilters={explore.handleClearFilters}
      />
    </section>
  )
}
