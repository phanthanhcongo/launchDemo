import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Line } from './Line';

describe('Line', () => {
  it('renders as hr element', () => {
    const { container } = render(<Line />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    const { container } = render(<Line orientation="horizontal" />);
    const line = container.querySelector('hr');
    expect(line).toHaveAttribute('role', 'separator');
    expect(line).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('applies orientation classes', () => {
    const { container, rerender } = render(<Line orientation="horizontal" />);
    expect(container.querySelector('hr')).toHaveClass('w-full');

    rerender(<Line orientation="vertical" />);
    expect(container.querySelector('hr')).toHaveClass('h-full');
  });

  it('applies color variants', () => {
    const { container } = render(<Line color="secondary" />);
    expect(container.querySelector('hr')).toHaveClass('bg-secondary');
  });

  it('applies thickness variants', () => {
    const { container } = render(<Line thickness="thick" />);
    expect(container.querySelector('hr')).toHaveClass('h-1');
  });
});

