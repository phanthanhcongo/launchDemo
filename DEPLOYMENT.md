# Hướng dẫn Deploy Nyala Villas

## 🚀 Build Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

Output sẽ ở thư mục `dist/`

## 📦 Deploy Options

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Hoặc connect GitHub repo với Vercel dashboard.

### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

Hoặc drag & drop thư mục `dist/` vào Netlify dashboard.

### 3. GitHub Pages

Thêm vào `vite.config.ts`:
```ts
export default defineConfig({
  base: '/repo-name/',
  // ...
});
```

Thêm script vào `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

```bash
npm install -D gh-pages
npm run deploy
```

### 4. Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t nyala-villas .
docker run -p 80:80 nyala-villas
```

## 🔧 Environment Variables

Tạo file `.env.production`:

```env
VITE_API_URL=https://api.nyalavillas.com
VITE_CONTACT_EMAIL=sales@swatchdevelopments.com
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

## ✅ Pre-deployment Checklist

- [ ] Run tests: `npm test`
- [ ] Run linter: `npm run lint`
- [ ] Build production: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Check responsive design
- [ ] Test all CTAs and forms
- [ ] Verify all images load
- [ ] Check SEO meta tags
- [ ] Test on multiple browsers
- [ ] Verify analytics tracking

## 🌐 Domain Setup

1. Point domain to hosting provider
2. Setup SSL certificate (Let's Encrypt)
3. Configure DNS records:
   ```
   A     @     <IP-ADDRESS>
   CNAME www   <DOMAIN>
   ```

## 📊 Analytics

Add Google Analytics to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Security Headers

Add to hosting provider config:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 📈 Performance Optimization

- [ ] Enable gzip compression
- [ ] Setup CDN (Cloudflare)
- [ ] Optimize images (already using lazy loading)
- [ ] Enable HTTP/2
- [ ] Setup caching headers

## 🐛 Monitoring

Setup error tracking with Sentry:

```bash
npm install @sentry/react
```

```tsx
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

## 🔄 CI/CD

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

