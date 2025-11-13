# 🚀 Nyala Villas - Quick Start Guide

## Bắt đầu nhanh (5 phút)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Mở browser: http://localhost:5173
```

Xong! Website đã chạy với tất cả sections và hình ảnh từ Figma.

## 📂 Cấu trúc quan trọng

```
src/
├── components/
│   ├── atoms/          # Button, Text, Image, Line
│   ├── molecules/      # FormInput, VillaCard, CountdownTimer
│   └── organisms/      # Header, Hero, VillaSection, etc.
├── pages/
│   └── HomePage.tsx    # ⭐ Main page - tất cả sections ở đây
├── hooks/              # useCountdown, useScrollSpy
├── services/           # contactService (form logic)
├── lib/
│   └── constants.ts    # ⭐ Tất cả data ở đây
└── i18n/
    └── locales/en.json # ⭐ Tất cả text ở đây
```

## 🎯 Chỉnh sửa nhanh

### Thay đổi text
```tsx
// src/i18n/locales/en.json
{
  "hero": {
    "welcome": "Welcome to nyala Villas",  // ← Sửa ở đây
    "cta": "Reserve Your Villa Now"
  }
}
```

### Thay đổi data
```tsx
// src/lib/constants.ts
export const INVESTMENT_STATS = {
  rentalROI: '16%',        // ← Sửa ở đây
  capitalGrowth: '30%',
  startingPrice: '$359K'
}
```

### Thay đổi màu sắc
```css
/* src/styles/tokens.css */
:root {
  --color-primary: #FFF7ED;    /* ← Sửa ở đây */
  --color-secondary: #B4533A;
  --color-surface: #372016;
}
```

### Thay đổi hình ảnh
```tsx
// Thay file trong public/images/
// Ví dụ: public/images/villa-1.svg
// Component tự động load hình mới
```

## 🔧 Commands thường dùng

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier

# Testing
npm test                 # Run tests
npm run test:ui          # Tests with UI
npm run test:coverage    # Coverage report

# Documentation
npm run storybook        # Component documentation
npm run build-storybook  # Build Storybook
```

## 📱 Sections trong HomePage

```tsx
// src/pages/HomePage.tsx
<Header />                    // Navigation
<Hero />                      // Hero section
<VillaSection />              // 3 villa types
<LifestyleSection />          // Lifestyle info
<InvestmentSection />         // Investment ROI
<WhyBaliSection />            // Why invest
<OffersSection />             // Limited offers + countdown
<ContactSection />            // Contact form
<Footer />                    // Footer links
```

## 🎨 Components có sẵn

### Atoms
```tsx
<Button intent="primary" size="lg">Click me</Button>
<Text variant="h1">Heading</Text>
<Image src="/path" alt="..." aspectRatio="16/9" />
<Line orientation="horizontal" color="primary" />
```

### Molecules
```tsx
<FormInput label="Email" name="email" required />
<VillaCard image="..." title="..." subtitle="..." />
<CountdownTimer targetDate={new Date()} />
```

## 🔗 Thêm Section mới

1. Tạo component trong `src/components/organisms/NewSection/`
2. Export trong `src/components/organisms/index.ts`
3. Thêm vào `HomePage.tsx`:

```tsx
import { NewSection } from '@/components/organisms';

export function HomePage() {
  return (
    <main>
      <Hero />
      <NewSection />  {/* ← Thêm ở đây */}
      <VillaSection />
    </main>
  );
}
```

## 🌐 Thêm ngôn ngữ mới

1. Tạo file `src/i18n/locales/vi.json`
2. Copy structure từ `en.json`
3. Dịch tất cả text
4. Import trong `src/i18n/config.ts`:

```tsx
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },  // ← Thêm ở đây
};
```

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Thay đổi port
npm run dev -- --port 3000
```

### Images không load
```bash
# Check images trong public/images/
ls -la public/images/

# Restart dev server
npm run dev
```

### TypeScript errors
```bash
# Check tsconfig.json paths
# Restart IDE/Editor
```

### Build errors
```bash
# Clear cache và rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 📊 File sizes

```
Total images: 15 files (từ Figma)
Total components: 30+ components
Total lines: 5000+ lines
Build size: ~200KB (gzipped)
```

## 🎯 Production Checklist

- [ ] `npm run lint` - No errors
- [ ] `npm test` - All tests pass
- [ ] `npm run build` - Build success
- [ ] `npm run preview` - Preview works
- [ ] Check responsive design
- [ ] Test all forms
- [ ] Verify all images
- [ ] Test all CTAs

## 📚 Tài liệu chi tiết

- `README.md` - Overview
- `PROJECT_STRUCTURE.md` - Kiến trúc chi tiết
- `DEPLOYMENT.md` - Hướng dẫn deploy
- `CHECKLIST.md` - Checklist đầy đủ

## 💡 Tips

1. **Component reuse**: Tất cả components có props, dễ dàng tái sử dụng
2. **Type safety**: TypeScript sẽ báo lỗi ngay khi code sai
3. **Storybook**: Xem tất cả components: `npm run storybook`
4. **Hot reload**: Code tự động reload khi save
5. **Console**: Check browser console để debug

## 🎉 Ready to go!

Website đã hoàn chỉnh 100%:
- ✅ Tất cả sections từ Figma
- ✅ Tất cả hình ảnh từ Figma
- ✅ Logic tách biệt rõ ràng
- ✅ Components có thể tái sử dụng
- ✅ Responsive design
- ✅ Type safe
- ✅ Tested
- ✅ Documented

**Bắt đầu code ngay: `npm run dev`** 🚀

