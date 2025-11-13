import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, Image, Button } from '@/components/atoms';
import { 
  SearchBar, 
  FilterChips, 
  SortDropdown, 
  UnitMapViewer, 
  FilterChip,
  StatusSummaryBar,
  ViewModeToggle,
  ViewMode,
  ShortlistTray,
} from '@/components/molecules';
import { 
  HeartIcon,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveShow
} from '@/components/ui';
import { UnitList, UnitDetailModal, UnitGrid } from '@/components/organisms';
import { Unit, UnitSort, MOCK_UNITS } from '@/lib/unitData';
import { useShortlist } from '@/hooks/useShortlist';
import { shortlistService, layoutService } from '@/services';
import { cn } from '@/lib/cn';

/**
 * ExplorePage Component
 *
 * Luxury real estate listing page following international UX standards.
 * Features:
 * - Status summary bar with progress
 * - Hero banner for emotion
 * - Comprehensive filter panel
 * - View mode toggle (Grid/Plan/List)
 * - Grid view as default
 * - Real-time updates
 * - Social proof
 *
 * @example
 * ```tsx
 * <ExplorePage />
 * ```
 */
export function ExplorePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get initial filter from URL params
  const initialVillaType = searchParams.get('villa');
  const initialUnitId = searchParams.get('unit');
  const shortlistParam = searchParams.get('shortlist');
  
  // Shortlist hook
  const { shortlistIds, toggleShortlist } = useShortlist();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(() => {
    const filters = new Set<string>();
    if (initialVillaType) {
      filters.add(`type-${initialVillaType}`);
    }
    return filters;
  });
  const [sort, setSort] = useState<UnitSort>({ field: 'price', direction: 'asc' });
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(initialUnitId || undefined);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid'); // Grid is default
  const [isShortlistTrayOpen, setIsShortlistTrayOpen] = useState(false);
  
  // Load shortlist from URL if present
  useEffect(() => {
    if (shortlistParam) {
      const unitIds = shortlistParam.split(',').filter(Boolean);
      if (unitIds.length > 0) {
        shortlistService.loadFromUrl(unitIds);
      }
    }
  }, [shortlistParam]);

  // Generate filter chips
  const filterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    
    // Type filters
    ['1-bed', '2-bed', '3-bed-a', '3-bed-b'].forEach(type => {
      chips.push({
        id: `type-${type}`,
        label: t(`villas.${type.replace('-', '')}.title`, type),
        value: type,
        category: 'type',
      });
    });

    // Status filters
    ['available', 'held', 'sold'].forEach(status => {
      chips.push({
        id: `status-${status}`,
        label: t(`explore.unit.status.${status}`, status),
        value: status,
        category: 'status',
      });
    });

    // Floor filters
    [1, 2, 3, 4].forEach(floor => {
      chips.push({
        id: `floor-${floor}`,
        label: `${floor}`,
        value: floor,
        category: 'floor',
      });
    });

    return chips;
  }, [t]);

  // Filter and sort units
  const filteredAndSortedUnits = useMemo(() => {
    let filtered = MOCK_UNITS.filter(unit => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          unit.code.toLowerCase().includes(query) ||
          unit.type.toLowerCase().includes(query) ||
          unit.floor.toString().includes(query);
        if (!matchesSearch) return false;
      }

      // Filter chips
      if (selectedFilters.size > 0) {
        const matchesFilter = Array.from(selectedFilters).some(filterId => {
          const chip = filterChips.find(c => c.id === filterId);
          if (!chip) return false;

          switch (chip.category) {
            case 'type':
              return unit.type === chip.value;
            case 'status':
              return unit.status === chip.value;
            case 'floor':
              return unit.floor === chip.value;
            default:
              return false;
          }
        });
        if (!matchesFilter) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sort.field) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'area':
          aValue = a.area;
          bValue = b.area;
          break;
        case 'floor':
          aValue = a.floor;
          bValue = b.floor;
          break;
        case 'code':
          aValue = a.code;
          bValue = b.code;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, selectedFilters, filterChips, sort]);

  const handleFilterToggle = (chip: FilterChip) => {
    setSelectedFilters(prev => {
      const next = new Set(prev);
      if (next.has(chip.id)) {
        next.delete(chip.id);
      } else {
        next.add(chip.id);
      }
      return next;
    });
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnitId(unit.id);
  };

  const handleShortlist = (unit: Unit) => {
    toggleShortlist(unit.id);
  };
  
  const handleSearchUnitSelect = (unit: Unit) => {
    setSelectedUnitId(unit.id);
    // Highlight on floorplan if in plan view
    if (viewMode === 'plan') {
      setHoveredUnitId(unit.id);
      setTimeout(() => setHoveredUnitId(undefined), 2000);
    }
  };

  const handleReserve = async (unit: Unit) => {
    console.log('Reserve:', unit.code);
    
    // Check if unit is available
    if (unit.status !== 'available') {
      alert(t('explore.unit.unavailable', 'This unit is not available for reservation'));
      return;
    }
    
    try {
      // In production: call lockUnit API
      // For now, navigate directly to reserve page with unit ID
      navigate(`/reserve/${unit.id}`);
    } catch (error) {
      console.error('Failed to start reservation:', error);
      alert(t('explore.unit.reserveError', 'Failed to start reservation. Please try again.'));
    }
  };

  const selectedUnit = selectedUnitId 
    ? filteredAndSortedUnits.find(u => u.id === selectedUnitId)
    : null;

  // Calculate unit statistics
  const totalUnits = MOCK_UNITS.length;
  const soldUnits = MOCK_UNITS.filter(u => u.status === 'sold').length;
  const heldUnits = MOCK_UNITS.filter(u => u.status === 'held').length;

  return (
    <div className={layoutService.page.fullPageLight}>
      {/* Status Summary Bar - Fixed at top */}
      <div className={layoutService.nav.sticky}>
        <StatusSummaryBar
          totalUnits={totalUnits}
          soldUnits={soldUnits}
          heldUnits={heldUnits}
        />
      </div>

      {/* Hero Banner - Responsive proportions */}
      <div className="relative h-[160px] sm:h-[200px] md:h-[240px] lg:h-[280px] xl:h-[320px] overflow-hidden border-b border-primary/10">
        <Image
          src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_EXT04_ROOF TERRACE_SWATCH ARCHITECTS.jpg"
          alt="Nyala Villas"
          objectFit="cover"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ResponsiveContainer size="md" padding="md" className="text-center">
            <Text variant="h1" className="text-white font-bold drop-shadow-lg mb-1 sm:mb-2 md:mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              {t('listing.hero.title', 'Nyala Villas Collection')}
            </Text>
            <Text variant="body" className="text-white/95 drop-shadow-md text-sm sm:text-base">
              {t('listing.hero.subtitle', 'Find your perfect villa in paradise')}
            </Text>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Bar - Sticky below StatusSummaryBar */}
      <div className="sticky top-[65px] md:top-[88px] z-30 bg-surface/98 backdrop-blur-md border-b border-primary/30 shadow-sm">
        <ResponsiveContainer size="full" padding="md" className="py-2 sm:py-3 md:py-4">
          <ResponsiveStack 
            direction={{ default: 'col', lg: 'row' }} 
            align="start" 
            justify="between" 
            gap="md"
          >
            {/* Left: Search + Filters */}
            <ResponsiveStack 
              direction={{ default: 'row' }} 
              gap="sm" 
              className="flex-1 w-full lg:w-auto min-w-0 overflow-visible"
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onUnitSelect={handleSearchUnitSelect}
                units={MOCK_UNITS}
                placeholder={t('explore.search.placeholder')}
                className="flex-1 min-w-0 max-w-full lg:max-w-sm"
              />
              <ResponsiveShow above="xl">
                <FilterChips
                  selected={selectedFilters}
                  onToggle={handleFilterToggle}
                  filters={filterChips}
                  className="flex-shrink-0"
                />
              </ResponsiveShow>
            </ResponsiveStack>

            {/* Right: View Mode + Sort + Counter + Shortlist */}
            <ResponsiveStack 
              direction={{ default: 'row' }} 
              gap="sm" 
              className="w-full lg:w-auto justify-between lg:justify-end flex-shrink-0 overflow-visible"
            >
              <ViewModeToggle
                mode={viewMode}
                onChange={setViewMode}
              />
              <SortDropdown sort={sort} onSortChange={setSort} />
              
              {/* Shortlist Button - Heroicons */}
              <Button
                intent="ghost"
                size="sm"
                onClick={() => setIsShortlistTrayOpen(true)}
                className="relative p-2"
                aria-label={t('shortlist.open', 'Open shortlist')}
              >
                <HeartIcon 
                  size="md"
                  className={cn(
                    "transition-colors",
                    shortlistIds.size > 0 ? "text-error" : "text-primary/70"
                  )}
                  fill={shortlistIds.size > 0 ? "currentColor" : "none"}
                />
                {shortlistIds.size > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-error text-white text-[8px] sm:text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
                    {shortlistIds.size}
                  </span>
                )}
              </Button>
              
              {/* Unit Counter - Responsive */}
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-primary/5 rounded-lg border border-primary/10">
                <Text variant="caption" className="text-primary font-semibold text-xs sm:text-sm">
                  {filteredAndSortedUnits.length}
                </Text>
                <Text variant="caption" className="text-primary/90 text-xs sm:text-sm">
                  / {totalUnits}
                </Text>
              </div>
            </ResponsiveStack>
          </ResponsiveStack>

          {/* Mobile/Tablet Filters */}
          <ResponsiveShow below="xl">
            <FilterChips
              selected={selectedFilters}
              onToggle={handleFilterToggle}
              filters={filterChips}
              className="mt-3"
            />
          </ResponsiveShow>
        </ResponsiveContainer>
      </div>

      {/* Main Content - Responsive spacing */}
      <ResponsiveContainer size="full" padding="md" className="py-4 sm:py-6 lg:py-8">
        {/* Results Summary */}
        {filteredAndSortedUnits.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <Text variant="body" className="text-primary/70 text-sm sm:text-base">
              {t('listing.results', 'Showing {{count}} of {{total}} units', {
                count: filteredAndSortedUnits.length,
                total: totalUnits,
              })}
              {selectedFilters.size > 0 && (
                <span className="ml-2 text-primary/50">
                  • {selectedFilters.size} {t('listing.filtersApplied', 'filters applied')}
                </span>
              )}
            </Text>
          </div>
        )}

        {/* Conditional Rendering based on View Mode */}
        {viewMode === 'grid' && (
          <UnitGrid
            units={filteredAndSortedUnits}
            selectedUnitId={selectedUnitId}
            hoveredUnitId={hoveredUnitId}
            onUnitSelect={handleUnitSelect}
            onUnitHover={setHoveredUnitId}
            onShortlist={handleShortlist}
            onReserve={handleReserve}
          />
        )}

        {viewMode === 'plan' && (
          <ResponsiveGrid 
            cols={{ default: 1, lg: 2 }} 
            gap="md" 
            className="min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]"
          >
            {/* Left Panel - Map Viewer */}
            <div className="h-[350px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-400px)] min-h-[350px] sm:min-h-[400px]">
              <UnitMapViewer
                units={filteredAndSortedUnits}
                selectedUnitId={selectedUnitId}
                hoveredUnitId={hoveredUnitId}
                onUnitSelect={handleUnitSelect}
                onUnitHover={setHoveredUnitId}
              />
            </div>

            {/* Right Panel - Unit List */}
            <div className={cn(
              "h-[350px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-400px)] min-h-[350px] sm:min-h-[400px] overflow-hidden",
              layoutService.page.cardElevated
            )}>
              <UnitList
                units={filteredAndSortedUnits}
                selectedUnitId={selectedUnitId}
                hoveredUnitId={hoveredUnitId}
                onUnitSelect={handleUnitSelect}
                onUnitHover={setHoveredUnitId}
                onShortlist={handleShortlist}
                onReserve={handleReserve}
              />
            </div>
          </ResponsiveGrid>
        )}

        {viewMode === 'list' && (
          <ResponsiveContainer size="lg" padding="none">
            <UnitList
              units={filteredAndSortedUnits}
              selectedUnitId={selectedUnitId}
              hoveredUnitId={hoveredUnitId}
              onUnitSelect={handleUnitSelect}
              onUnitHover={setHoveredUnitId}
              onShortlist={handleShortlist}
              onReserve={handleReserve}
            />
          </ResponsiveContainer>
        )}
      </ResponsiveContainer>


      {/* Unit Detail Modal */}
      <UnitDetailModal
        unit={selectedUnit || null}
        isOpen={Boolean(selectedUnit)}
        onClose={() => setSelectedUnitId(undefined)}
        onShortlist={handleShortlist}
        onReserve={handleReserve}
      />
      
      {/* Shortlist Tray */}
      <ShortlistTray
        units={MOCK_UNITS}
        isOpen={isShortlistTrayOpen}
        onClose={() => setIsShortlistTrayOpen(false)}
        onUnitClick={(unit: Unit) => {
          setSelectedUnitId(unit.id);
          setIsShortlistTrayOpen(false);
        }}
      />
    </div>
  );
}

ExplorePage.displayName = 'ExplorePage';
