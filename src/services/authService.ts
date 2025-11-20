/**
 * Authentication Service
 * Handles login, logout, and session management
 */

// Use proxy in dev mode, or direct URL in production
const getApiBase = () => {
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In dev, use proxy if available, otherwise direct URL
  if (import.meta.env.DEV) {
    // Try proxy first (if vite dev server is running)
    return '/api';
  }
  // Fallback to direct URL
  return 'http://localhost:4000';
};

const API_BASE = getApiBase();

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
}

export interface AuthError {
  code?: string;
  message: string;
  details?: string[];
}

class AuthService {
  private readonly TOKEN_KEY = 'launchbase_token';
  private readonly SESSION_EXPIRES_KEY = 'launchbase_session_expires';
  private readonly EMAIL_KEY = 'launchbase_email';

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for refresh token
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (errorData.error?.code === 'ACCOUNT_NOT_VERIFIED') {
          throw new Error('ACCOUNT_NOT_VERIFIED');
        }

        const errorMessage = errorData.error?.message || errorData.message || 'Login failed';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.accessToken) {
        throw new Error('Login successful but no token received');
      }

      // Store token and session info
      this.setToken(data.accessToken);
      if (data.expiresAt) {
        this.setSessionExpires(data.expiresAt);
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running (port 4000)');
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token from cookie
   */
  async refreshToken(): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Send cookie with refresh token
    });

    if (!response.ok) {
      // Refresh failed, clear storage
      this.clearAuth();
      throw new Error('Refresh token expired or invalid');
    }

    const data = await response.json();

    if (!data.accessToken) {
      throw new Error('Refresh failed: no access token received');
    }

    // Store new token and expiration
    this.setToken(data.accessToken);
    if (data.expiresAt) {
      this.setSessionExpires(data.expiresAt);
    }

    return data;
  }

  /**
   * Get current user info
   * Automatically refreshes token if expired
   */
  async getCurrentUser(): Promise<UserInfo> {
    // Check if token is expired and refresh if needed
    if (!this.isAuthenticated()) {
      // Try to refresh token
      try {
        await this.refreshToken();
      } catch {
        throw new Error('Session expired');
      }
    }

    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // If 401, try refresh once more
      if (response.status === 401) {
        try {
          await this.refreshToken();
          // Retry with new token
          const newToken = this.getToken();
          if (!newToken) {
            throw new Error('No token after refresh');
          }
          const retryResponse = await fetch(`${API_BASE}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newToken}`,
            },
            credentials: 'include',
          });
          if (!retryResponse.ok) {
            this.clearAuth();
            throw new Error('Session expired');
          }
          const retryData = await retryResponse.json();
          // Backend returns { user: {...} }, extract user object
          return retryData.user || retryData;
        } catch {
          this.clearAuth();
          throw new Error('Session expired');
        }
      }
      // Token invalid, clear storage
      this.clearAuth();
      throw new Error('Session expired');
    }

    const data = await response.json();
    // Backend returns { user: {...} }, extract user object
    return data.user || data;
  }

  /**
   * Check if user is authenticated
   * Returns true if token exists and is not expired
   * Note: This doesn't refresh token automatically, use getCurrentUser() for that
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiresAt = this.getSessionExpires();

    if (!token || !expiresAt) {
      return false;
    }

    // Check if session is still valid
    const expires = new Date(expiresAt);
    const now = new Date();
    
    // Token expired, but don't clear here - let refresh logic handle it
    if (expires <= now) {
      return false;
    }

    return true;
  }

  /**
   * Check if token is expired (or will expire soon)
   * @param bufferSeconds - Buffer time in seconds before expiration (default: 60)
   */
  isTokenExpired(bufferSeconds: number = 60): boolean {
    const expiresAt = this.getSessionExpires();
    if (!expiresAt) {
      return true;
    }

    const expires = new Date(expiresAt);
    const now = new Date();
    const buffer = new Date(now.getTime() + bufferSeconds * 1000);

    return expires <= buffer;
  }

  /**
   * Logout (clear local storage)
   */
  logout(): void {
    this.clearAuth();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get session expiration
   */
  getSessionExpires(): string | null {
    return localStorage.getItem(this.SESSION_EXPIRES_KEY);
  }

  /**
   * Set session expiration
   */
  private setSessionExpires(expiresAt: string): void {
    localStorage.setItem(this.SESSION_EXPIRES_KEY, expiresAt);
  }

  /**
   * Save email for remember me
   */
  saveEmail(email: string): void {
    localStorage.setItem(this.EMAIL_KEY, email);
  }

  /**
   * Get saved email
   */
  getSavedEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  /**
   * Clear saved email
   */
  clearSavedEmail(): void {
    localStorage.removeItem(this.EMAIL_KEY);
  }

  /**
   * Clear all auth data
   */
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_EXPIRES_KEY);
  }
}

export const authService = new AuthService();

