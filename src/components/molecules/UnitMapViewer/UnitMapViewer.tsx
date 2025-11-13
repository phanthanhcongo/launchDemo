import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Icon } from '@/components/atoms';
import { Unit } from '@/lib/unitData';
import { cn } from '@/lib/cn';

export interface UnitMapViewerProps {
  /**
   * All units to display
   */
  units: Unit[];
  /**
   * Currently selected unit ID
   */
  selectedUnitId?: string;
  /**
   * Callback when unit is selected
   */
  onUnitSelect: (unit: Unit) => void;
  /**
   * Currently hovered unit ID
   */
  hoveredUnitId?: string;
  /**
   * Callback when unit is hovered
   */
  onUnitHover?: (unitId: string | undefined) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * UnitMapViewer Component
 *
 * Interactive map/floor plan viewer with embedded VR.
 * Shows unit status with color coding and supports drilldown.
 *
 * @example
 * ```tsx
 * <UnitMapViewer
 *   units={filteredUnits}
 *   selectedUnitId={selectedId}
 *   onUnitSelect={handleUnitSelect}
 *   hoveredUnitId={hoveredId}
 *   onUnitHover={setHoveredId}
 * />
 * ```
 */
export function UnitMapViewer({
  units,
  selectedUnitId,
  onUnitSelect,
  hoveredUnitId,
  onUnitHover,
  className,
}: UnitMapViewerProps) {
  const { t } = useTranslation();
  const [is2DMode, setIs2DMode] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [selectedVRUrl, setSelectedVRUrl] = useState<string | undefined>();

  // Get unique floors
  const floors = Array.from(new Set(units.map(u => u.floor))).sort((a, b) => a - b);
  const currentFloorUnits = units.filter(u => u.floor === currentFloor);

  // Get VR URL for selected unit or default
  const vrUrl = selectedUnitId 
    ? units.find(u => u.id === selectedUnitId)?.vrUrl
    : currentFloorUnits[0]?.vrUrl;

  const handleUnitClick = (unit: Unit) => {
    onUnitSelect(unit);
    if (unit.vrUrl) {
      setSelectedVRUrl(unit.vrUrl);
    }
  };

  const handleResetView = () => {
    setSelectedVRUrl(undefined);
    onUnitSelect(units[0]);
  };

  return (
    <div className={cn('relative w-full h-full bg-surface rounded-lg overflow-hidden', className)}>
      {/* Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-surface/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/20">
          {/* Floor Slider */}
          {floors.length > 1 && (
            <div className="flex items-center gap-2">
              <Text variant="caption" className="text-primary/70">
                {t('explore.map.floor', 'Floor')}:
              </Text>
              <select
                value={currentFloor}
                onChange={(e) => setCurrentFloor(Number(e.target.value))}
                className="bg-transparent border border-primary/20 rounded px-2 py-1 text-primary text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {floors.map(floor => (
                  <option key={floor} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 2D/3D Toggle */}
          <Button
            intent="ghost"
            size="sm"
            onClick={() => setIs2DMode(!is2DMode)}
            className="ml-2"
          >
            <Text variant="caption">
              {is2DMode ? '3D' : '2D'}
            </Text>
          </Button>

          {/* Reset View */}
          <Button
            intent="ghost"
            size="sm"
            onClick={handleResetView}
            className="ml-2"
            aria-label={t('explore.map.reset', 'Reset view')}
          >
            <Icon name="close" size="sm" iconColor="primary" />
          </Button>
        </div>
      </div>

      {/* 2D SVG Fallback */}
      {is2DMode ? (
        <div className="w-full h-full flex items-center justify-center bg-surface/50">
          <div className="text-center space-y-4">
            <Text variant="h4" className="text-primary/70">
              {t('explore.map.floorPlan', 'Floor Plan View')}
            </Text>
            <Text variant="body" className="text-primary/50">
              {t('explore.map.floorPlanDesc', '2D floor plan visualization')}
            </Text>
            
            {/* Simple 2D Grid Representation */}
            <div className="grid grid-cols-4 gap-4 p-8">
              {currentFloorUnits.map((unit) => {
                const isSelected = unit.id === selectedUnitId;
                const isHovered = unit.id === hoveredUnitId;
                
                return (
                  <button
                    key={unit.id}
                    onClick={() => handleUnitClick(unit)}
                    onMouseEnter={() => onUnitHover?.(unit.id)}
                    onMouseLeave={() => onUnitHover?.(undefined)}
                    className={cn(
                      'aspect-square rounded border-2 transition-all',
                      'hover:scale-110 hover:shadow-lg',
                      isSelected && 'ring-4 ring-primary',
                      isHovered && !isSelected && 'ring-2 ring-primary/50',
                      unit.status === 'available' && 'bg-green-500 border-green-500',
                      unit.status === 'held' && 'bg-accent border-accent',
                      unit.status === 'sold' && 'bg-primary/30 border-primary/30'
                    )}
                    aria-label={`${unit.code} - ${unit.status}`}
                  >
                    <div className="p-2 text-center">
                      <Text variant="caption" className="text-surface font-bold">
                        {unit.code}
                      </Text>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 3D VR Viewer */
        <div className="w-full h-full relative">
          {selectedVRUrl || vrUrl ? (
            <iframe
              src={selectedVRUrl || vrUrl}
              className="w-full h-full border-0"
              title={t('explore.map.vrTitle', 'Virtual Reality Tour')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface/50">
              <Text variant="body" className="text-primary/50">
                {t('explore.map.noVR', 'VR tour not available for this floor')}
              </Text>
            </div>
          )}

          {/* Unit Status Legend */}
          <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-secondary rounded" />
                <Text variant="caption" className="text-primary">
                  {t('explore.map.available', 'Available')}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-accent rounded" />
                <Text variant="caption" className="text-primary">
                  {t('explore.map.held', 'Held')}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/30 rounded" />
                <Text variant="caption" className="text-primary">
                  {t('explore.map.sold', 'Sold')}
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

UnitMapViewer.displayName = 'UnitMapViewer';
