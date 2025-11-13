# Images Mapping - Figma to Components

## Total Images: 35 files

### Hero Section
- `hero-background.svg` - Main hero background (1920x1080) ✅ Used in Hero
- `hero-mask.svg` - Hero overlay mask (1920x1080) ✅ Used in Hero  
- `hero-mask-image.svg` - Additional mask layer (1920x1080) 🆕 NEW

**Usage in Hero.tsx:**
```tsx
<Image src="/images/hero-background.svg" alt="" objectFit="cover" />
<Image src="/images/hero-mask.svg" alt="" objectFit="cover" />
// Add: <Image src="/images/hero-mask-image.svg" alt="" objectFit="cover" />
```

### Villa Section
- `villa-1.svg` - One-bedroom villa main image ✅ Used
- `villa-1-mask.svg` - Villa 1 mask overlay (500x580) 🆕 NEW
- `villa-2.svg` - Two-bedroom villa main image ✅ Used
- `villa-2-mask.svg` - Villa 2 mask overlay (914x650) 🆕 NEW
- `villa-3.svg` - Three-bedroom villa main image ✅ Used
- `villa-3-mask.svg` - Villa 3 mask overlay (500x730) 🆕 NEW

**Usage in VillaCard.tsx:**
```tsx
// Current: just villa-1.svg, villa-2.svg, villa-3.svg
// Add mask overlays for each villa card
```

### Villa Gallery Section
- `villa-gallery-slider.svg` - Gallery slider controls (1751x86) 🆕 NEW
- `villa-gallery-lines.svg` - Gallery decorative lines (1921x1002) 🆕 NEW

**Usage:** Gallery navigation component

### Lifestyle Section
- `lifestyle-background.svg` - Lifestyle section background ✅ Used
- `lifestyle-gallery.svg` - Lifestyle gallery images ✅ Used
- `lifestyle-submark.svg` - Lifestyle watermark logo (1167x1167) 🆕 NEW

**Usage in LifestyleSection.tsx:**
```tsx
<Image src="/images/lifestyle-background.svg" />
<Image src="/images/lifestyle-gallery.svg" />
// Add: <Image src="/images/lifestyle-submark.svg" className="opacity-10" />
```

### Investment Section
- `investment-background.svg` - Investment section background ✅ Used
- `investment-gallery.svg` - Investment gallery images ✅ Used
- `investment-submark.svg` - Investment watermark (633x633) 🆕 NEW

**Usage in InvestmentSection.tsx:**
```tsx
<Image src="/images/investment-background.svg" />
<Image src="/images/investment-gallery.svg" />
// Add: <Image src="/images/investment-submark.svg" className="opacity-8" />
```

### Why Bali Section
- `why-bali-gallery.svg` - Why Bali gallery (old) ✅ Used
- `why-bali-image.svg` - Why Bali main image (1671x563) 🆕 NEW (better quality)
- `why-bali-line.svg` - Vertical separator line (1x175) 🆕 NEW

**Usage in WhyBaliSection.tsx:**
```tsx
// Replace: why-bali-gallery.svg with why-bali-image.svg
<Image src="/images/why-bali-image.svg" />
// Add separator lines between points:
<Image src="/images/why-bali-line.svg" className="h-[175px]" />
```

### Offers Section
- `offers-background.svg` - Offers section background ✅ Used
- `offers-pic.svg` - Offers main picture (old) ✅ Used
- `offers-image.svg` - Offers better image (891x506) 🆕 NEW
- `offers-submark.svg` - Offers watermark (343x343) 🆕 NEW

**Usage in OffersSection.tsx:**
```tsx
<Image src="/images/offers-background.svg" />
// Replace: offers-pic.svg with offers-image.svg
<Image src="/images/offers-image.svg" />
// Add: <Image src="/images/offers-submark.svg" />
```

### Gallery Navigation
- `gallery-arrow-left.svg` - Left arrow icon (32x86) 🆕 NEW
- `gallery-arrow-right.svg` - Right arrow icon (32x86) 🆕 NEW
- `gallery-lines.svg` - Gallery decorative lines (1920x1002) 🆕 NEW

**Usage in GallerySlider.tsx:**
```tsx
// Replace Icon component with actual SVG images
<Image src="/images/gallery-arrow-left.svg" />
<Image src="/images/gallery-arrow-right.svg" />
```

### Contact Section
- `contact-background.svg` - Contact section background ✅ Used
- `contact-map.svg` - Map location image ✅ Used

**Usage in ContactSection.tsx:** ✅ Already correct

### Footer
- `footer-background.svg` - Footer background pattern ✅ Used
- `footer-submark.svg` - Footer watermark (138x152) 🆕 NEW

**Usage in Footer.tsx:**
```tsx
<Image src="/images/footer-background.svg" />
// Replace logo-primary.svg with footer-submark.svg
<Image src="/images/footer-submark.svg" className="opacity-10" />
```

### Logos
- `logo-white.svg` - White logo for header ✅ Used in Header
- `logo-primary.svg` - Primary logo ✅ Used
- `logo-primary-group.svg` - Logo group variant (119x15) 🆕 NEW

### Social Icons
- `instagram-icon.svg` - Instagram icon (46x46) 🆕 NEW

**Usage in ContactSection.tsx:**
```tsx
// Replace Icon component with actual SVG
<Image src="/images/instagram-icon.svg" className="w-12 h-12" />
```

## Summary of Changes Needed

### 🔴 High Priority (Missing/Wrong Images)
1. **Hero Section**: Add `hero-mask-image.svg` as additional layer
2. **Villa Cards**: Add mask overlays for each villa
3. **Why Bali**: Replace `why-bali-gallery.svg` with `why-bali-image.svg`
4. **Why Bali**: Add `why-bali-line.svg` as separators between points
5. **Offers**: Replace `offers-pic.svg` with `offers-image.svg`
6. **Instagram**: Replace Icon component with `instagram-icon.svg`
7. **Footer**: Replace `logo-primary.svg` with `footer-submark.svg`

### 🟡 Medium Priority (Enhancement)
1. Add watermark images (submarks) to sections:
   - `lifestyle-submark.svg` in Lifestyle
   - `investment-submark.svg` in Investment
   - `offers-submark.svg` in Offers

2. Add gallery navigation images:
   - `gallery-arrow-left.svg`
   - `gallery-arrow-right.svg`
   - `gallery-lines.svg`
   - `villa-gallery-slider.svg`
   - `villa-gallery-lines.svg`

### 🟢 Low Priority (Optional)
1. `logo-primary-group.svg` - Alternative logo variant

## Files to Update

1. `src/components/organisms/Hero/Hero.tsx`
2. `src/components/molecules/VillaCard/VillaCard.tsx`
3. `src/components/organisms/VillaSection/VillaSection.tsx`
4. `src/components/organisms/LifestyleSection/LifestyleSection.tsx`
5. `src/components/organisms/InvestmentSection/InvestmentSection.tsx`
6. `src/components/organisms/WhyBaliSection/WhyBaliSection.tsx`
7. `src/components/organisms/OffersSection/OffersSection.tsx`
8. `src/components/organisms/ContactSection/ContactSection.tsx`
9. `src/components/organisms/Footer/Footer.tsx`
10. `src/components/molecules/GallerySlider/GallerySlider.tsx`

## Next Steps

1. Update all components to use correct images
2. Add missing watermarks/submarks
3. Replace Icon components with actual SVG images where appropriate
4. Test all images display correctly
5. Verify 100% match with Figma design

