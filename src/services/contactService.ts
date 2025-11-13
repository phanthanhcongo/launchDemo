/**
 * Contact Form Service
 * Handles form submission logic
 */

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  preferredContact?: string;
}

export interface ContactServiceResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class ContactService {
  /**
   * Submit contact form
   * TODO: Replace with actual API endpoint
   */
  async submitContactForm(data: ContactFormData): Promise<ContactServiceResponse> {
    try {
      // Simulate API call
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      // TODO: Replace with actual API call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      console.log('Contact form submitted:', data);

      return {
        success: true,
        message: 'Thank you for your interest! We will contact you soon.',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit form',
      };
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\d\s+()-]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}

export const contactService = new ContactService();

