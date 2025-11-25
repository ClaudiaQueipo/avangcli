---
title: Configuration
description: Configure your application
order: 3
---

# Configuration

Learn how to configure your application for different environments.

## Environment Variables

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

## Next.js Configuration

Edit `next.config.mjs`:

```js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
}

export default nextConfig
```

## TypeScript Configuration

The project uses TypeScript with strict mode enabled. You can customize `tsconfig.json` as needed.
