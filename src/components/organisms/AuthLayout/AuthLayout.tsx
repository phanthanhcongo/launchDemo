import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

export interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * AuthLayout Component
 * 
 * Shared layout for all authentication pages with:
 * - Left section: Image and project branding (fixed)
 * - Right section: Dynamic content (login, register, verify, etc.) with flip animation
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fff7ed' }}>
      {/* Login Card - Rounded, Centered, Split Layout */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
        {/* Left Section - Image & Project Name (Fixed) */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-[400px] lg:min-h-[600px]">
          {/* Row 1: Image */}
          <div className="flex-1 relative">
            <img
              src="/images/Nyala Villas - Visualisation/02 Two Bed/NYALA VILLAS_EXT04_ROOF TERRACE_SWATCH ARCHITECTS.jpg"
              alt="Nyala Villas"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Row 2: Project Name */}
          <div className="flex items-center justify-center p-6 lg:p-8" style={{ backgroundColor: '#b4533a' }}>
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">Nalys</h1>
              <h2 className="text-2xl lg:text-3xl font-normal text-white mb-3 tracking-wide">VILLAS</h2>
              <div className="px-6 py-2 bg-black/80 inline-block rounded-md">
                <p className="text-white text-base lg:text-lg font-medium">BALI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Dynamic Content with Flip Animation */}
        <div 
          className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative" 
          style={{ 
            backgroundColor: '#cbb89d',
            perspective: '1000px'
          }}
        >
          {/* Back Button - Only show if not on login or register page */}
          {location.pathname !== '/login' && location.pathname !== '/register' && (
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
              aria-label="Go back"
              style={{ color: '#1f2937' }}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{ 
                width: '100%',
                maxWidth: '28rem',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

AuthLayout.displayName = 'AuthLayout';

