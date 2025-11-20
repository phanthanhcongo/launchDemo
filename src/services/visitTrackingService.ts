import { authService } from './authService';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export enum VisitAction {
  HOME_PAGE_VIEW = 'HOME_PAGE_VIEW',
  EXPLORE_PAGE_VIEW = 'EXPLORE_PAGE_VIEW',
  UNIT_VIEW = 'UNIT_VIEW',
  PROJECT_VIEW = 'PROJECT_VIEW',
  LOGIN = 'LOGIN',
  SEARCH = 'SEARCH',
  PAGE_VIEW = 'PAGE_VIEW',
}

interface LogVisitParams {
  action: VisitAction;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

/**
 * Service to track user visits and page views
 */
export const visitTrackingService = {
  /**
   * Log a visit/action
   * Works for both authenticated and anonymous users
   */
  async logVisit(params: LogVisitParams): Promise<void> {
    try {
      const token = authService.getToken();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`${API_BASE}/activity/log-visit`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(params),
      });
      
      // Silently fail - don't block user experience if logging fails
    } catch (error) {
      // Silently fail - don't log errors to console in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log visit:', error);
      }
    }
  },
};

