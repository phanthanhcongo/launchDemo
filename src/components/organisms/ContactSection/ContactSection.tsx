import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Image, SocialIcon } from '@/components/atoms';
import { FormInput } from '@/components/molecules';
import { cn } from '@/lib/cn';

export interface ContactSectionProps {
  className?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

const CONTACT_FORM_FIELDS = [
  { name: 'firstName', type: 'text', label: 'First Name', required: true },
  { name: 'lastName', type: 'text', label: 'Last Name', required: true },
  { name: 'email', type: 'email', label: 'Email', required: true },
  { name: 'phone', type: 'tel', label: 'Phone Number', required: false },
  { name: 'preferredContact', type: 'text', label: 'Preferred Method of Contact', required: false },
];

/**
 * ContactSection Component
 * 
 * Contact form section with map and contact information.
 * Logic separated: form state management isolated from UI.
 */
export function ContactSection({ className, onSubmit }: ContactSectionProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit?.(formData);
      setFormData({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      className={cn('relative min-h-screen flex items-center', className)}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/contact-background.svg"
          alt=""
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-16 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Form */}
          <div className="space-y-12">
            <Text variant="h2" className="text-left text-primary">
              {t('contact.heading')}
            </Text>

            <form onSubmit={handleSubmit} className="space-y-8">
              {CONTACT_FORM_FIELDS.map((field) => (
                <FormInput
                  key={field.name}
                  label={t(`contact.form.${field.name}`, field.label)}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                />
              ))}

              <Button
                type="submit"
                intent="primary"
                size="md"
                isLoading={isSubmitting}
                className="mt-12"
              >
                {t('contact.form.submit')}
              </Button>
            </form>
          </div>

          {/* Right: Map & Contact Info */}
          <div className="space-y-8">
            {/* Map */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/contact-map.svg"
                alt="Nyala Villas Location"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <Text variant="menu" className="text-left text-primary">
                {t('contact.email')}
              </Text>
              <Text variant="menu" className="text-left text-primary">
                {t('contact.phone')}
              </Text>
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              <SocialIcon
                platform="instagram"
                href="https://instagram.com/nyalavillas"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ContactSection.displayName = 'ContactSection';

