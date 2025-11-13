# Nyala Villas Landing Page

Enterprise-grade React + TypeScript landing page for Nyala Villas, built with modern best practices and atomic design principles.

## 🏗️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + CSS Variables
- **Component Variants**: class-variance-authority (CVA)
- **UI Primitives**: Radix UI
- **State Management**: Zustand (when needed)
- **i18n**: i18next + react-i18next
- **Testing**: Vitest + React Testing Library
- **Storybook**: Component documentation & development
- **Linting**: ESLint (Airbnb config) + Prettier

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic building blocks (Button, Text, Image, Line)
│   ├── molecules/      # Simple component combinations (FormInput, VillaCard, CountdownTimer)
│   ├── organisms/      # Complex sections (Header, Hero, Footer, ContactSection)
│   └── ui/             # shadcn/ui customized components
├── pages/              # Page-level compositions
├── features/           # Business feature bundles
├── hooks/              # Custom React hooks
├── services/           # API clients, query keys
├── models/             # TypeScript types & Zod schemas
├── lib/                # Utilities (cn, constants)
├── styles/             # Design tokens, global styles
├── i18n/               # Internationalization
└── tests/              # Test setup & utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Tools

```bash
# Run Storybook
npm run storybook

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## 🎨 Design System

### Color Tokens

- **Primary**: `#FFF7ED` (Cream/Beige) - Main text and UI
- **Secondary**: `#B4533A` (Terracotta/Rust) - Accent color
- **Accent**: `#BBAF9F` (Taupe) - Subtle accents
- **Surface**: `#372016` (Dark Brown) - Main backgrounds

### Typography

- **Headings**: The Seasons (serif)
- **Body**: Montserrat (sans-serif)

### Component Variants

All components use CVA for consistent variant management:

```tsx
<Button intent="primary" size="md" />
<Text variant="h1" color="primary" />
<Line orientation="horizontal" thickness="thin" />
```

## 🧪 Testing

Tests are written using Vitest and React Testing Library:

```tsx
// Component tests
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

## ♿ Accessibility

- All interactive elements have proper ARIA attributes
- Keyboard navigation fully supported
- Focus rings on all focusable elements
- Color contrast meets WCAG AA standards
- Semantic HTML throughout

## 🌐 Internationalization

Uses i18next for translations:

```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <Text>{t('hero.welcome')}</Text>;
}
```

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Output directory: dist/
```

Deploy the `dist/` directory to your hosting provider.

## 🔧 Configuration

### TailwindCSS

Design tokens are defined in `tailwind.config.ts` and `src/styles/tokens.css`.

### TypeScript

Path aliases configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"]
  }
}
```

### ESLint

Follows Airbnb style guide with TypeScript support.

## 📝 Component Development

### Creating a New Component

1. Create component directory in appropriate atomic level
2. Write component with TypeScript + CVA variants
3. Add Storybook stories
4. Write tests
5. Export from index.ts

Example:

```tsx
// Button.tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base-classes', {
  variants: { intent: { primary: '...' } }
});

export const Button = ({ intent, ...props }) => (
  <button className={buttonVariants({ intent })} {...props} />
);
```

## 🎯 Best Practices

- ✅ Components are pure and prop-driven
- ✅ No business logic in UI components
- ✅ Hooks for side effects and state
- ✅ Services for API calls
- ✅ Constants in separate files
- ✅ Design tokens for all styling
- ✅ CVA for component variants
- ✅ Comprehensive tests
- ✅ Storybook documentation
- ✅ Accessibility first

## 📄 License

Proprietary - Nyala Villas / Swatch Developments

## 🤝 Contributing

Contact the development team for contribution guidelines.

---

Built with ❤️ for Nyala Villas

