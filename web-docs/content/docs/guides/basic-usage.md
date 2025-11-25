---
title: Basic Usage
description: Learn the basics of using the platform
order: 1
---

# Basic Usage

This guide covers the basic usage patterns of our platform.

## Your First Component

Here's how to create your first component:

```tsx
import { Button } from '@/components/ui/button'

export default function MyComponent() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
    </div>
  )
}
```

## Data Fetching

Fetch data using React Server Components:

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()

  return <div>{/* Render your data */}</div>
}
```

## Styling

Use Tailwind CSS for styling:

```tsx
<div className="flex items-center justify-center p-4 bg-blue-500">
  <h1 className="text-2xl font-bold text-white">Styled Content</h1>
</div>
```
