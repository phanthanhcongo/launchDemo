import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { visitTrackingService, VisitAction } from '@/services/visitTrackingService';

/**
 * Hook to automatically track page visits
 * 
 * @param action - The visit action type
 * @param entity - Optional entity type (Unit, Project, etc.)
 * @param entityId - Optional entity ID
 * @param metadata - Optional metadata
 */
export function useVisitTracking(
  action: VisitAction,
  entity?: string,
  entityId?: string,
  metadata?: Record<string, any>,
) {
  const location = useLocation();

  useEffect(() => {
    // Log visit when component mounts or location changes
    visitTrackingService.logVisit({
      action,
      entity,
      entityId,
      metadata: {
        ...metadata,
        path: location.pathname,
        search: location.search,
      },
    });
  }, [location.pathname, location.search, action, entity, entityId]);
}

