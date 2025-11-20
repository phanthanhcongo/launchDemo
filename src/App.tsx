import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ReservePage } from './pages/ReservePage';
import { ConfirmPage } from './pages/ConfirmPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyPage } from './pages/VerifyPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfileCompletionPage } from './pages/ProfileCompletionPage';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import './i18n/config';
import './styles/tokens.css';

/**
 * App Component
 * 
 * Main application with routing.
 * Routes:
 * - / → HomePage (Landing page - no auth required)
 * - /explore → ExplorePage (Requires auth + complete profile)
 * - /reserve/:unitId → ReservePage (Reservation Flow - requires auth + complete profile)
 * - /confirm → ConfirmPage (Payment Result)
 * - /login → LoginPage (Authentication)
 * - /register → RegisterPage (Registration)
 * - /forgot-password → ForgotPasswordPage (Password Reset)
 * - /verify → VerifyPage (OTP Verification)
 * - /profile → ProfilePage (User Profile - requires auth)
 * - /profile/complete → ProfileCompletionPage (Complete profile - requires auth)
 * - /admin → AdminPage (Admin Panel - requires auth + admin role)
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Protected routes - require authentication + complete profile */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <ExplorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reserve/:unitId"
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <ReservePage />
            </ProtectedRoute>
          }
        />
        
        {/* Protected routes - require authentication only */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth={true}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/complete"
          element={
            <ProtectedRoute requireAuth={true}>
              <ProfileCompletionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAuth={true}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        
        {/* Public routes */}
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

