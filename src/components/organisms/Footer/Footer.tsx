import { useTranslation } from 'react-i18next';
import { Text, Image } from '@/components/atoms';
import { cn } from '@/lib/cn';

export interface FooterProps {
  className?: string;
}

const FOOTER_LINKS = [
  { labelKey: 'footer.links.about', href: '#about' },
  { labelKey: 'footer.links.privacy', href: '#privacy' },
  { labelKey: 'footer.links.book', href: '#contact' },
  { labelKey: 'footer.links.terms', href: '#terms' },
  { labelKey: 'footer.links.website', href: 'https://nyalavillas.com' },
];

/**
 * Footer Component
 * 
 * Site footer with navigation links and branding.
 * Pure presentational - receives data via constants.
 */
export function Footer({ className }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer
      className={cn(
        'relative bg-surface h-[200px] flex items-center justify-center',
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/footer-background.svg"
          alt=""
          objectFit="cover"
          className="w-full h-full opacity-20"
        />
      </div>

      {/* Submark Watermark */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2">
        <div className="w-[138px] h-[152px] opacity-10">
          <Image
            src="/images/logo-primary.svg"
            alt=""
            objectFit="contain"
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-16">
        {/* Footer Links */}
        <nav
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
          aria-label="Footer navigation"
        >
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.labelKey}
              href={link.href}
              className="focus-ring rounded-sm"
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <Text
                variant="menu"
                className="hover:text-primary transition-colors text-primary/70"
              >
                {t(link.labelKey)}
              </Text>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

Footer.displayName = 'Footer';

