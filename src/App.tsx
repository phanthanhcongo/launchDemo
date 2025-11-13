import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ReservePage } from './pages/ReservePage';
import { ConfirmPage } from './pages/ConfirmPage';
import './i18n/config';
import './styles/tokens.css';

/**
 * App Component
 * 
 * Main application with routing.
 * Routes:
 * - / → HomePage
 * - /explore → ExplorePage (Listing)
 * - /reserve/:unitId → ReservePage (Reservation Flow)
 * - /confirm → ConfirmPage (Payment Result)
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/reserve/:unitId" element={<ReservePage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

