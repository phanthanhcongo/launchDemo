/**
 * Shortlist Service
 * 
 * Manages user's shortlist of units with localStorage persistence
 * and share link generation.
 */

const SHORTLIST_STORAGE_KEY = 'nyala_villas_shortlist';

export interface ShortlistItem {
  unitId: string;
  addedAt: string;
}

export interface ShortlistState {
  items: ShortlistItem[];
  unitIds: Set<string>;
}

class ShortlistService {
  private listeners: Set<(state: ShortlistState) => void> = new Set();

  /**
   * Get current shortlist from localStorage
   */
  getShortlist(): ShortlistState {
    try {
      const stored = localStorage.getItem(SHORTLIST_STORAGE_KEY);
      if (!stored) {
        return { items: [], unitIds: new Set() };
      }
      const items: ShortlistItem[] = JSON.parse(stored);
      return {
        items,
        unitIds: new Set(items.map(item => item.unitId)),
      };
    } catch {
      return { items: [], unitIds: new Set() };
    }
  }

  /**
   * Add unit to shortlist
   */
  addUnit(unitId: string): void {
    const state = this.getShortlist();
    if (state.unitIds.has(unitId)) {
      return; // Already in shortlist
    }

    const newItem: ShortlistItem = {
      unitId,
      addedAt: new Date().toISOString(),
    };

    const newItems = [...state.items, newItem];
    localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(newItems));
    
    const newState = {
      items: newItems,
      unitIds: new Set(newItems.map(item => item.unitId)),
    };
    
    this.notifyListeners(newState);
  }

  /**
   * Remove unit from shortlist
   */
  removeUnit(unitId: string): void {
    const state = this.getShortlist();
    if (!state.unitIds.has(unitId)) {
      return;
    }

    const newItems = state.items.filter(item => item.unitId !== unitId);
    localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(newItems));
    
    const newState = {
      items: newItems,
      unitIds: new Set(newItems.map(item => item.unitId)),
    };
    
    this.notifyListeners(newState);
  }

  /**
   * Toggle unit in shortlist
   */
  toggleUnit(unitId: string): boolean {
    const state = this.getShortlist();
    if (state.unitIds.has(unitId)) {
      this.removeUnit(unitId);
      return false;
    } else {
      this.addUnit(unitId);
      return true;
    }
  }

  /**
   * Check if unit is in shortlist
   */
  isInShortlist(unitId: string): boolean {
    return this.getShortlist().unitIds.has(unitId);
  }

  /**
   * Clear shortlist
   */
  clear(): void {
    localStorage.removeItem(SHORTLIST_STORAGE_KEY);
    const emptyState: ShortlistState = { items: [], unitIds: new Set<string>() };
    this.notifyListeners(emptyState);
  }

  /**
   * Generate shareable link with shortlist snapshot
   */
  generateShareLink(baseUrl: string = window.location.origin): string {
    const state = this.getShortlist();
    if (state.items.length === 0) {
      return baseUrl;
    }

    const unitIds = state.items.map(item => item.unitId).join(',');
    const url = new URL('/explore', baseUrl);
    url.searchParams.set('shortlist', unitIds);
    
    return url.toString();
  }

  /**
   * Load shortlist from URL params
   */
  loadFromUrl(unitIds: string[]): void {
    this.clear();
    unitIds.forEach(unitId => this.addUnit(unitId));
  }

  /**
   * Subscribe to shortlist changes
   */
  subscribe(listener: (state: ShortlistState) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.getShortlist());
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(state: ShortlistState): void {
    this.listeners.forEach(listener => listener(state));
  }
}

export const shortlistService = new ShortlistService();

