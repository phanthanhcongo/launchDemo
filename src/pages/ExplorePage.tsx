import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVisitTracking } from '@/hooks/useVisitTracking';
import { VisitAction } from '@/services/visitTrackingService';
import { Image, Button } from '@/components/atoms';
import {
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
import './styles/explore.css';

export function ExplorePage() {
  const { t } = useTranslation();
  
  // Track page visit
  useVisitTracking(VisitAction.EXPLORE_PAGE_VIEW);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialVillaType = searchParams.get('villa');
  const initialUnitId = searchParams.get('unit');
  const shortlistParam = searchParams.get('shortlist');

  const { shortlistIds, toggleShortlist } = useShortlist();

  const [searchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(() => {
    const filters = new Set<string>();
    if (initialVillaType) filters.add(`type-${initialVillaType}`);
    return filters;
  });
  const [sort, setSort] = useState<UnitSort>({ field: 'price', direction: 'asc' });
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(initialUnitId || undefined);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isShortlistTrayOpen, setIsShortlistTrayOpen] = useState(false);

  useEffect(() => {
    if (shortlistParam) {
      const unitIds = shortlistParam.split(',').filter(Boolean);
      if (unitIds.length > 0) shortlistService.loadFromUrl(unitIds);
    }
  }, [shortlistParam]);

  const filterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    ['1-BED', '2-BED', '3-BED', '4-BED'].forEach(type => {
      chips.push({
        id: `type-${type}`,
        label: t(`villas.${type.replace('-', '')}.title`, type),
        value: type,
        category: 'type',
      });
    });
    [1, 2, 3].forEach(floor => {
      chips.push({
        id: `floor-${floor}`,
        label: `${floor}`,
        value: floor,
        category: 'floor',
      });
    });
    return chips;
  }, [t]);

  const filteredAndSortedUnits = useMemo(() => {
    let filtered = MOCK_UNITS.filter(unit => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !unit.code.toLowerCase().includes(q) &&
          !unit.type.toLowerCase().includes(q) &&
          !unit.floor.toString().includes(q)
        ) return false;
      }

      if (selectedFilters.size > 0) {
        const matchesFilter = Array.from(selectedFilters).some(filterId => {
          const chip = filterChips.find(c => c.id === filterId);
          if (!chip) return false;
          switch (chip.category) {
            case 'type': return unit.type === chip.value;
            case 'status': return unit.status === chip.value;
            case 'floor': return unit.floor === chip.value;
            default: return false;
          }
        });
        if (!matchesFilter) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      const get = (u: Unit) => {
        switch (sort.field) {
          case 'price': return u.price;
          case 'area': return u.area;
          case 'floor': return u.floor;
          case 'code': return u.code;
          default: return 0;
        }
      };
      const aV: any = get(a);
      const bV: any = get(b);
      if (aV < bV) return sort.direction === 'asc' ? -1 : 1;
      if (aV > bV) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, selectedFilters, filterChips, sort]);

  const handleFilterToggle = (chip: FilterChip) => {
    setSelectedFilters(prev => {
      const next = new Set(prev);
      if (next.has(chip.id)) next.delete(chip.id);
      else next.add(chip.id);
      return next;
    });
  };

  const handleUnitSelect = (unit: Unit) => setSelectedUnitId(unit.id);
  const handleShortlist = (unit: Unit) => toggleShortlist(unit.id);

  const handleReserve = async (unit: Unit) => {
    if (unit.status !== 'available') {
      alert(t('explore.unit.unavailable', 'This unit is not available for reservation'));
      return;
    }
    navigate(`/reserve/${unit.id}`);
  };

  const selectedUnit = selectedUnitId ? filteredAndSortedUnits.find(u => u.id === selectedUnitId) : null;
  const totalUnits = MOCK_UNITS.length;

  return (
    <div className={layoutService.page.fullPageLight}>
      {/* Status Summary */}
      <div className={layoutService.nav.sticky}>
        <StatusSummaryBar totalUnits={totalUnits} soldUnits={MOCK_UNITS.filter(u => u.status === 'sold').length} heldUnits={MOCK_UNITS.filter(u => u.status === 'held').length} />
      </div>

      {/* HERO */}
      <div className="relative">
        <div className="relative h-[420px] sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[720px] overflow-hidden">
          <Image
            src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_EXT04_ROOF TERRACE_SWATCH ARCHITECTS.jpg"
            alt="Nyala Villas"
            objectFit="cover"
            className="w-full h-full scale-110 animate-[heroZoom_12s_ease-out]"
          />

          {/* overlay */}
          <div
            className="
              absolute inset-0,
              bg-gradient-to-t,
              from-[#b4533a]/60,
              via-[#b4533a]/30,
              to-transparent
            "
          />

          {/* hero text — keep animations but no transform on parent */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <h1 className="font-nyala text-white text-[64px] sm:text-[82px] md:text-[96px] lg:text-[110px] tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] opacity-0 animate-fadeInUp [animation-delay:200ms]">
              NYALA
            </h1>
            <h2 className="text-white font-serif text-[32px] sm:text-[40px] md:text-[46px] lg:text-[52px] mt-[-10px] opacity-0 animate-fadeInUp [animation-delay:400ms]">
              Villas <span className="italic font-light tracking-wide">Collection</span>
            </h2>
            <p className="text-white/80 font-light text-[14px] sm:text-[16px] md:text-[18px] mt-4 opacity-0 animate-fadeInUp [animation-delay:600ms]">
              Find Your Perfect In Paradise
            </p>
          </div>
        </div>

        {/* ========== FILTER BAR: wrapper keeps positioning, inner element animates ========== */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] sm:w-[85%] md:w-[75%] lg:w-[100%] flex justify-center pointer-events-none">
          {/* inner card — animated, no translateX here */}
          <div
            className={cn(
              'w-full pointer-events-auto backdrop-blur-xl bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]',
              'opacity-0 animate-fadeInUp [animation-delay:800ms]'
            )}
            role="region"
            aria-label={t('explore.filters.label', 'Filter options')}
          >
            <ResponsiveContainer size="full" padding="md" className="py-3">
              <ResponsiveStack
                direction={{ default: 'col', lg: 'row' }}
                align="center"
                justify="start"
                gap="md">
                {/* Left: chips (desktop) */}
                <div className="flex items-center gap-6 min-w-0">
                  <ResponsiveShow above="xl">
                    <FilterChips selected={selectedFilters} onToggle={handleFilterToggle} filters={filterChips} className="flex-shrink-0 text-white" />
                  </ResponsiveShow>
                </div>

                {/* Right: view mode / sort / wishlist / counter */}
                <div className="flex items-center gap-4 lg:gap-6">
                  <ViewModeToggle mode={viewMode} onChange={setViewMode} />
                  <SortDropdown sort={sort} onSortChange={setSort} />
                  <Button intent="ghost" size="sm" onClick={() => setIsShortlistTrayOpen(true)} className="relative p-2">
                    <HeartIcon size="md" className={cn("transition-colors", shortlistIds.size > 0 ? "text-error" : "text-white/80")} fill={shortlistIds.size > 0 ? "currentColor" : "none"} />
                    {shortlistIds.size > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white rounded-full text-[10px] flex items-center justify-center">{shortlistIds.size}</span>}
                  </Button>

                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
                    <span>{filteredAndSortedUnits.length}</span>
                    <span className="opacity-70">/</span>
                    <span>{totalUnits}</span>
                  </div>
                </div>
              </ResponsiveStack>

              {/* mobile filters below */}
              <ResponsiveShow below="xl">
                <div className="mt-3">
                  <FilterChips selected={selectedFilters} onToggle={handleFilterToggle} filters={filterChips} />
                </div>
              </ResponsiveShow>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <ResponsiveContainer size="full" padding="md" className="bg-[#fff7ed] py-4 sm:py-6 lg:py-8">
        {filteredAndSortedUnits.length > 0 && (
          <div className="mb-4 sm:mb-6 py-[20px]">
            <p className="text-[#1a1a1a] text-lg font-light">
              Showing <span className="font-semibold">{filteredAndSortedUnits.length}</span> of <span className="font-semibold">{totalUnits}</span> <span className="font-semibold">Units</span>
            </p>
          </div>
        )}

        {viewMode === 'grid' && (
          <UnitGrid units={filteredAndSortedUnits} selectedUnitId={selectedUnitId} hoveredUnitId={hoveredUnitId}
            onUnitSelect={handleUnitSelect} onUnitHover={setHoveredUnitId} onShortlist={handleShortlist} onReserve={handleReserve} />
        )}

        {viewMode === 'plan' && (
          <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="md" className="min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
            <div className="h-[350px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-400px)] min-h-[350px] sm:min-h-[400px]">
              <UnitMapViewer units={filteredAndSortedUnits} selectedUnitId={selectedUnitId} hoveredUnitId={hoveredUnitId} onUnitSelect={handleUnitSelect} onUnitHover={setHoveredUnitId} />
            </div>

            <div className={cn("h-[350px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-400px)] min-h-[350px] sm:min-h-[400px] overflow-hidden", layoutService.page.cardElevated)}>
              <UnitList units={filteredAndSortedUnits} selectedUnitId={selectedUnitId} hoveredUnitId={hoveredUnitId} onUnitSelect={handleUnitSelect} onUnitHover={setHoveredUnitId} onShortlist={handleShortlist} onReserve={handleReserve} />
            </div>
          </ResponsiveGrid>
        )}

        {viewMode === 'list' && (
          <ResponsiveContainer size="lg" padding="none">
            <UnitList units={filteredAndSortedUnits} selectedUnitId={selectedUnitId} hoveredUnitId={hoveredUnitId} onUnitSelect={handleUnitSelect} onUnitHover={setHoveredUnitId} onShortlist={handleShortlist} onReserve={handleReserve} />
          </ResponsiveContainer>
        )}

      </ResponsiveContainer>

      <UnitDetailModal unit={selectedUnit || null} isOpen={Boolean(selectedUnit)} onClose={() => setSelectedUnitId(undefined)} onShortlist={handleShortlist} onReserve={handleReserve} />

      <ShortlistTray units={MOCK_UNITS} isOpen={isShortlistTrayOpen} onClose={() => setIsShortlistTrayOpen(false)} onUnitClick={(unit: Unit) => { setSelectedUnitId(unit.id); setIsShortlistTrayOpen(false); }} />
    </div>
  );
}

ExplorePage.displayName = 'ExplorePage';
