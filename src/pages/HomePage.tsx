import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Header, 
  Hero, 
  ValueProposition, 
  VillaSection, 
  LifestyleSection, 
  InvestmentSection, 
  WhyBaliSection, 
  OffersSection, 
  ContactSection, 
  Footer,
  VRExperienceEntry
} from '@/components/organisms';
import { ResponsiveContainer } from '@/components/ui';
import { contactService, layoutService } from '@/services';
import { VillaData } from '@/lib/villaData';
import { vrService } from '@/lib/vrService';

/**
 * HomePage Component
 * 
 * Main landing page composition with all sections.
 * Follows atomic design principles: organisms composed into pages.
 * Logic separated into services and hooks.
 * Enhanced with proper navigation and UX improvements.
 */
export function HomePage() {
  const navigate = useNavigate();
  const [isVRExperienceOpen, setIsVRExperienceOpen] = useState(false);

  // Scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Navigate to explore page
  const navigateToExplore = () => {
    navigate('/explore');
  };

  // Handle villa card click - Navigate to explore page
  const handleVillaClick = (villa: VillaData) => {
    // Navigate to explore page with villa filter
    navigate(`/explore?villa=${villa.type}`);
  };

  // Handle download investment guide
  const handleDownloadClick = () => {
    // Navigate to download or open PDF
    const link = document.createElement('a');
    link.href = '/investment-guide.pdf';
    link.download = 'Nyala-Villas-Investment-Guide.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle schedule consultation
  const handleScheduleClick = () => {
    scrollToContact();
    // Optional: Pre-fill form or show calendar
  };

  // Handle claim offer
  const handleClaimClick = () => {
    // Navigate to explore page to see available units
    navigateToExplore();
  };

  // Handle contact form submission
  const handleContactSubmit = async (data: Record<string, string>) => {
    const result = await contactService.submitContactForm({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      preferredContact: data.preferredContact,
    });

    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className={layoutService.page.fullPage}>
      <Header />

      <main className="relative">
        {/* 01. Hero Section - Emotion + Dual CTAs */}
        <Hero 
          onExploreVillas={navigateToExplore}
          onBookCall={scrollToContact}
        />

        {/* 02. Value Proposition - 3 USP Tiles */}
        <ResponsiveContainer size="full" padding="none">
          <ValueProposition />
        </ResponsiveContainer>

        {/* 03. Villa Categories - 1/2/3 Bedrooms */}
        <ResponsiveContainer size="full" padding="none">
          <VillaSection onVillaClick={handleVillaClick} />
        </ResponsiveContainer>

        {/* 04. Lifestyle Section - Storytelling */}
        <ResponsiveContainer size="full" padding="none">
          <LifestyleSection />
        </ResponsiveContainer>

        {/* 05. Investment Section - Hard Selling */}
        <ResponsiveContainer size="full" padding="none">
          <InvestmentSection onDownloadClick={handleDownloadClick} />
        </ResponsiveContainer>

        {/* 06. Why Bali - Trust Booster */}
        <ResponsiveContainer size="full" padding="none">
          <WhyBaliSection onScheduleClick={handleScheduleClick} />
        </ResponsiveContainer>

        {/* 07. Pre-Sale Offer - Urgency */}
        <ResponsiveContainer size="full" padding="none">
          <OffersSection onClaimClick={handleClaimClick} />
        </ResponsiveContainer>

        {/* 08. Contact Form - Lead Capture */}
        <ResponsiveContainer size="full" padding="none">
          <ContactSection onSubmit={handleContactSubmit} />
        </ResponsiveContainer>
      </main>

      <Footer />

      {/* VR Experience Entry */}
      <VRExperienceEntry
        isOpen={isVRExperienceOpen}
        onClose={() => setIsVRExperienceOpen(false)}
        onEnterExperience={() => {
          // Navigate to explore page or open VR directly
          vrService.openExternalUrl('vr');
          setIsVRExperienceOpen(false);
        }}
      />
    </div>
  );
}

HomePage.displayName = 'HomePage';

