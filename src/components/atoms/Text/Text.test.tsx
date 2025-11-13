import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders with default props', () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders correct semantic HTML element', () => {
    const { container } = render(<Text variant="h1">Heading</Text>);
    expect(container.querySelector('h1')).toBeInTheDocument();
  });

  it('allows custom element override', () => {
    const { container } = render(
      <Text variant="h1" as="div">
        Custom
      </Text>
    );
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Text variant="h2">Heading 2</Text>);
    const element = screen.getByText('Heading 2');
    expect(element).toHaveClass('font-seasons');
    expect(element).toHaveClass('uppercase');
  });

  it('applies color variants', () => {
    render(
      <Text color="secondary" data-testid="colored-text">
        Colored
      </Text>
    );
    expect(screen.getByTestId('colored-text')).toHaveClass('text-secondary');
  });

  it('applies alignment', () => {
    render(
      <Text align="center" data-testid="centered">
        Centered
      </Text>
    );
    expect(screen.getByTestId('centered')).toHaveClass('text-center');
  });
});

