# Nyala Villas - Cấu trúc dự án

## 📁 Kiến trúc tổng quan

Dự án được xây dựng theo **Atomic Design** với logic tách biệt rõ ràng:

```
src/
├── components/          # UI Components (Atomic Design)
│   ├── atoms/          # Thành phần cơ bản (Button, Text, Image, Line)
│   ├── molecules/      # Kết hợp atoms (FormInput, VillaCard, CountdownTimer)
│   └── organisms/      # Sections phức tạp (Header, Hero, Footer, etc.)
├── pages/              # Trang web (HomePage)
├── hooks/              # Custom React hooks (useCountdown, useScrollSpy)
├── services/           # Business logic & API calls (contactService)
├── lib/                # Utilities (cn, constants)
├── models/             # TypeScript types & Zod schemas
├── styles/             # Design tokens & global styles
├── i18n/               # Internationalization
└── tests/              # Test setup & utilities
```

## 🎨 Components (Atomic Design)

### Atoms (Thành phần cơ bản)
- **Button**: Nút bấm với variants (primary, secondary, ghost)
- **Text**: Typography với semantic variants (h1-h4, body, caption, menu, cta)
- **Image**: Hình ảnh tối ưu với lazy loading
- **Line**: Đường kẻ trang trí

### Molecules (Kết hợp atoms)
- **FormInput**: Input form với label, validation
- **VillaCard**: Card hiển thị villa với image overlay
- **CountdownTimer**: Đếm ngược thời gian (sử dụng useCountdown hook)

### Organisms (Sections)
- **Header**: Navigation bar với logo và menu
- **Hero**: Hero section với CTA
- **VillaSection**: Showcase 3 loại villa
- **LifestyleSection**: Mô tả lifestyle
- **InvestmentSection**: Thông tin đầu tư
- **WhyBaliSection**: Lý do đầu tư Bali
- **OffersSection**: Ưu đãi với countdown
- **ContactSection**: Form liên hệ
- **Footer**: Footer với links

## 🔧 Logic Layer (Tách biệt khỏi UI)

### Hooks (`src/hooks/`)
- **useCountdown**: Logic đếm ngược thời gian
- **useScrollSpy**: Track section đang hiển thị

### Services (`src/services/`)
- **contactService**: Xử lý submit form, validation email/phone

### Constants (`src/lib/constants.ts`)
- Tất cả data cứng: villa info, navigation items, contact fields, etc.

## 🎯 Data Flow

```
User Action → Component → Hook/Service → Update State → Re-render
```

**Ví dụ: Submit contact form**
```
ContactSection (UI)
  → handleSubmit
  → contactService.submitContactForm (Logic)
  → API call
  → Response
  → Update UI
```

## 🖼️ Images từ Figma

Tất cả hình ảnh đã được tải từ Figma và lưu trong `/public/images/`:

- `hero-background.svg` - Hero background
- `hero-mask.svg` - Hero overlay
- `villa-1.svg`, `villa-2.svg`, `villa-3.svg` - Villa images
- `lifestyle-background.svg` - Lifestyle section background
- `lifestyle-gallery.svg` - Lifestyle gallery
- `investment-background.svg` - Investment background
- `investment-gallery.svg` - Investment gallery
- `why-bali-gallery.svg` - Why Bali image
- `offers-background.svg` - Offers background
- `offers-pic.svg` - Offers image
- `contact-map.svg` - Contact map
- `logo-primary.svg`, `logo-white.svg` - Logos

## 🌐 Internationalization

Sử dụng i18next với file translations trong `src/i18n/locales/en.json`.

Không có text hardcode trong components:
```tsx
// ❌ Bad
<Text>Welcome to Nyala Villas</Text>

// ✅ Good
const { t } = useTranslation();
<Text>{t('hero.welcome')}</Text>
```

## 🎨 Styling

### Design Tokens (`src/styles/tokens.css`)
```css
--color-primary: #FFF7ED  /* Cream */
--color-secondary: #B4533A /* Terracotta */
--color-surface: #372016   /* Dark Brown */
```

### TailwindCSS + CVA
Tất cả components sử dụng CVA cho variants:
```tsx
const buttonVariants = cva('base-classes', {
  variants: {
    intent: { primary: '...', secondary: '...' }
  }
});
```

## 📝 Component Pattern

Mỗi component theo cấu trúc:
```
ComponentName/
├── ComponentName.tsx       # Component code
├── ComponentName.stories.tsx # Storybook
├── ComponentName.test.tsx   # Tests
└── index.ts                # Barrel export
```

## 🧪 Testing

- **Unit tests**: Vitest + React Testing Library
- **Component tests**: Render, interactions, a11y
- **Hook tests**: Logic testing tách biệt

## ♿ Accessibility

- ARIA attributes đầy đủ
- Keyboard navigation
- Focus rings
- Semantic HTML
- Color contrast WCAG AA

## 🚀 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run storybook    # Component documentation
npm run lint         # Lint code
```

## 📦 Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** + **CVA** (styling)
- **i18next** (i18n)
- **Vitest** (testing)
- **Storybook** (docs)
- **ESLint** + **Prettier** (code quality)

## 🎯 Best Practices

✅ **Separation of Concerns**
- UI trong components
- Logic trong hooks/services
- Data trong constants
- Styles trong design tokens

✅ **Type Safety**
- Tất cả props có TypeScript types
- Strict mode enabled

✅ **Performance**
- Lazy loading images
- Memoization hợp lý
- Code splitting

✅ **Maintainability**
- Atomic design
- Single responsibility
- DRY principle
- Clear naming conventions

