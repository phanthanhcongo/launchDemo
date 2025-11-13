import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Image } from './Image';

describe('Image', () => {
  it('renders with required props', () => {
    render(<Image src="/test.jpg" alt="Test image" />);
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('applies object-fit classes', () => {
    render(<Image src="/test.jpg" alt="Test" objectFit="contain" />);
    expect(screen.getByAltText('Test')).toHaveClass('object-contain');
  });

  it('sets aspect ratio style', () => {
    render(<Image src="/test.jpg" alt="Test" aspectRatio="16/9" />);
    const img = screen.getByAltText('Test');
    expect(img).toHaveStyle({ aspectRatio: '16/9' });
  });

  it('supports lazy loading', () => {
    render(<Image src="/test.jpg" alt="Test" loading="lazy" />);
    expect(screen.getByAltText('Test')).toHaveAttribute('loading', 'lazy');
  });

  it('has proper accessibility', () => {
    render(<Image src="/test.jpg" alt="Descriptive alt text" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAccessibleName('Descriptive alt text');
  });
});

