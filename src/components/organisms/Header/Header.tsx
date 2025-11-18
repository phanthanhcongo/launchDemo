import * as React from 'react';
import { Image } from '@/components/atoms';
import { Navigation } from '@/components/molecules/Navigation';
import { useScrollSpy } from '@/hooks';
import { XMarkIcon, Bars3BottomRightIcon } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface HeaderProps {
  className?: string;
}

const LEFT_NAV_ITEMS = [
  { labelKey: 'nav.home', href: '#home' },
  { labelKey: 'nav.lifestyle', href: '#lifestyle' },
  { labelKey: 'nav.villas', href: '#villas' },
  { labelKey: 'nav.investment', href: '#investment' },
];

const RIGHT_NAV_ITEMS = [
  { labelKey: 'nav.whyBali', href: '#why-bali' },
  { labelKey: 'nav.gallery', href: '#gallery' },
  { labelKey: 'nav.offers', href: '#offers' },
  { labelKey: 'nav.contact', href: '#contact' },
];

/**
 * Header Component
 * 
 * Main navigation header with logo and menu items.
 * Sticky positioning with backdrop blur on scroll.
 * Logic separated: uses useScrollSpy hook for active section tracking.
 */
export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const activeSection = useScrollSpy([
    'home',
    'lifestyle',
    'villas',
    'investment',
    'why-bali',
    'gallery',
    'offers',
    'contact',
  ]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const sectionId = href.replace('#', '');
    const section = document.getElementById(sectionId);
    
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    
    setIsMobileMenuOpen(false);
  };

  const leftNavWithActive = LEFT_NAV_ITEMS.map((item) => ({
    ...item,
    isActive: activeSection === item.href.replace('#', ''),
  }));

  const rightNavWithActive = RIGHT_NAV_ITEMS.map((item) => ({
    ...item,
    isActive: activeSection === item.href.replace('#', ''),
  }));

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-fixed transition-all duration-300',
        'bg-[#b4533a99] backdrop-blur-md shadow-lg',
        className
      )}
    >
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex items-center justify-between h-[100px]">
          {/* Left Nav */}
          <div className="hidden lg:block">
            <Navigation items={leftNavWithActive} onItemClick={handleNavClick} />
          </div>

          {/* Logo - Switch based on scroll state */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="focus-ring rounded-sm block"
              aria-label="Nyala Villas Home"
            >
                <Image
                  src="/images/logo-primary.svg"
                  alt="Nyala Villas"
                  className="w-[141px] h-[100px] object-contain"
                />
            </a>
          </div>

          {/* Right Nav */}
          <div className="hidden lg:block">
            <Navigation items={rightNavWithActive} onItemClick={handleNavClick} />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 focus-ring rounded-sm"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon size="lg" className="text-primary" />
            ) : (
              <Bars3BottomRightIcon size="lg" className="text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-primary/20">
            <Navigation
              items={[...leftNavWithActive, ...rightNavWithActive]}
              onItemClick={handleNavClick}
              orientation="vertical"
              className="gap-4"
            />
          </div>
        )}
      </div>
    </header>
  );
}

Header.displayName = 'Header';

