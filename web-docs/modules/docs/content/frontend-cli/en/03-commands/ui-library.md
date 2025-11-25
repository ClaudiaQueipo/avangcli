# Command: ui-library

## Description

The `ui-library` command adds and installs a UI components library in an existing Next.js project. It automatically configures all dependencies, configuration files, and necessary structure for each supported library.

## Syntax

```bash
avangcli ui-library [library]
```

## Prerequisites

- Be in a valid Next.js project
- Node.js 20+ installed
- Package manager configured (npm, yarn, pnpm, bun)

## Supported Libraries

- **Material UI (MUI)** - Robust and complete component library
- **shadcn/ui** - Accessible components built with Radix UI + Tailwind
- **HeroUI** - Modern and customizable components with Tailwind

## Interactive Mode

```bash
avangcli ui-library
```

The CLI will show a menu to select:

1. Material UI (mui)
2. shadcn/ui (shadcn)
3. HeroUI (heroui)
4. None (none)

## Options

### `[library]`

- **Type:** Positional (optional)
- **Options:** `mui`, `shadcn`, `heroui`
- **Description:** UI library to install
- **Example:** `avangcli ui-library shadcn`

## Usage Examples

### Example 1: Interactive Mode

```bash
avangcli ui-library
# Select from list
```

### Example 2: Material UI

```bash
avangcli ui-library mui
```

### Example 3: shadcn/ui

```bash
avangcli ui-library shadcn
```

### Example 4: HeroUI

```bash
avangcli ui-library heroui
```

## Material UI (MUI)

### What Gets Installed?

```bash
📦 Packages:
- @mui/material
- @emotion/react
- @emotion/styled
```

### Automatic Configuration

AvangCLI automatically configures:

1. **Theme Provider** in `app/layout.tsx`
2. **Emotion Cache** for SSR
3. **Typography configuration**

### After Installation

```typescript
// Use MUI components
import { Button, TextField, Card } from '@mui/material'

export default function MyComponent() {
  return (
    <Card>
      <TextField label="Name" />
      <Button variant="contained">Submit</Button>
    </Card>
  )
}
```

### Theme Customization

```typescript
// app/theme.ts
import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2"
    },
    secondary: {
      main: "#dc004e"
    }
  }
})
```

### MUI Resources

- [Official documentation](https://mui.com/)
- [Components](https://mui.com/components/)
- [Theming](https://mui.com/customization/theming/)

---

## shadcn/ui

### Special Requirements

⚠️ **shadcn/ui requires Tailwind CSS**

If your project doesn't have Tailwind, AvangCLI will install it automatically.

### What Gets Installed?

```bash
📦 Base packages:
- tailwindcss (if not installed)
- @radix-ui/react-* (depending on components)
- class-variance-authority
- clsx
- tailwind-merge

📁 Files created:
- components.json
- lib/utils.ts
- components/ui/ (folder for components)
```

### Automatic Configuration

AvangCLI configures:

1. **`components.json`** - shadcn configuration
2. **`lib/utils.ts`** - `cn()` utility for classes
3. **Tailwind config** - Colors and CSS variables
4. **globals.css** - Theme variables

### After Installation

Add components one by one:

```bash
# Add Button component
npx shadcn@latest add button

# Add Card component
npx shadcn@latest add card

# Add Dialog component
npx shadcn@latest add dialog

# Add multiple components
npx shadcn@latest add button card dialog input
```

### Using Components

```typescript
// After: npx shadcn@latest add button
import { Button } from '@/components/ui/button'

export default function MyComponent() {
  return (
    <Button variant="default">Click me</Button>
  )
}
```

### Theme Customization

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }
}
```

### shadcn/ui Advantages

✅ **Copy & Paste** - Not npm packages, it's your code
✅ **Customizable** - Modify each component freely
✅ **Accessible** - Built with Radix UI (WAI-ARIA)
✅ **Typed** - Full TypeScript support
✅ **Flexible** - Use only what you need

### shadcn/ui Resources

- [Official documentation](https://ui.shadcn.com/)
- [Components](https://ui.shadcn.com/docs/components/accordion)
- [Theming](https://ui.shadcn.com/docs/theming)
- [Examples](https://ui.shadcn.com/examples)

---

## HeroUI

### Special Requirements

⚠️ **HeroUI requires Tailwind CSS**

If you don't have Tailwind, AvangCLI will install it automatically.

### What Gets Installed?

```bash
📦 Packages:
- @heroui/react
- framer-motion
- tailwindcss (if not installed)
```

### Automatic Configuration

AvangCLI configures:

1. **Tailwind config** - HeroUI plugin
2. **Provider** - HeroUIProvider in layout
3. **Theme** - Color configuration

### After Installation

```bash
# Add Button component
heroui add button

# Add Card component
heroui add card

# Add all components
heroui add --all
```

### Using Components

```typescript
import { Button, Card, Input } from '@heroui/react'

export default function MyComponent() {
  return (
    <Card>
      <Input label="Email" />
      <Button color="primary">Submit</Button>
    </Card>
  )
}
```

### Theme Customization

```typescript
// app/layout.tsx
import { HeroUIProvider } from '@heroui/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <HeroUIProvider theme={{
          colors: {
            primary: '#0072F5',
            secondary: '#7828C8',
          }
        }}>
          {children}
        </HeroUIProvider>
      </body>
    </html>
  )
}
```

### HeroUI Resources

- [Official documentation](https://heroui.com/)
- [Components](https://heroui.com/docs/components/button)
- [Theming](https://heroui.com/docs/customization/theme)

---

## Library Comparison

| Feature            | Material UI     | shadcn/ui     | HeroUI         |
| ------------------ | --------------- | ------------- | -------------- |
| **Tailwind CSS**   | ❌ Not required | ✅ Required   | ✅ Required    |
| **Bundle Size**    | Large (~100KB)  | Small (~20KB) | Medium (~50KB) |
| **Customization**  | Medium          | Very High     | High           |
| **Components**     | 60+             | 50+           | 40+            |
| **Accessibility**  | ✅ Excellent    | ✅ Excellent  | ✅ Good        |
| **Animations**     | Basic           | Customizable  | ✅ Built-in    |
| **TypeScript**     | ✅ Full         | ✅ Full       | ✅ Full        |
| **Dark Mode**      | ✅ Yes          | ✅ Yes        | ✅ Yes         |
| **Learning curve** | Medium          | Low           | Low            |

## Which One to Choose?

### Choose Material UI if:

- ✅ You want a complete and robust solution
- ✅ You don't use Tailwind CSS
- ✅ You need complex components (DataGrid, Autocomplete)
- ✅ Your team knows Material Design
- ✅ You need enterprise support (MUI X)

**Ideal for:** Enterprise applications, complex dashboards

### Choose shadcn/ui if:

- ✅ You use Tailwind CSS
- ✅ You want full control over code
- ✅ You prefer copy-paste over npm install
- ✅ You need maximum customization
- ✅ You value small bundle size

**Ideal for:** Startups, SaaS, modern applications

### Choose HeroUI if:

- ✅ You use Tailwind CSS
- ✅ You want modern and animated components
- ✅ You need a middle ground between MUI and shadcn
- ✅ You value modern and clean design
- ✅ You want built-in animations

**Ideal for:** Consumer-facing applications, landing pages

## Recommended Workflow

### 1. New Project with UI Library

```bash
# Option 1: During init
avangcli init my-app --pm bun --tailwind --ui shadcn

# Option 2: After init
avangcli init my-app --pm bun --tailwind
cd my-app
avangcli ui-library shadcn
```

### 2. Existing Project

```bash
# Navigate to project
cd my-existing-project

# Add UI library
avangcli ui-library mui
```

### 3. Change UI Library

```bash
# Uninstall the previous one
npm uninstall @mui/material @emotion/react @emotion/styled

# Install the new one
avangcli ui-library shadcn
```

## Automatic Validations

### Tailwind Detection

```bash
# shadcn/ui without Tailwind
avangcli ui-library shadcn

⚠️ shadcn/ui requires Tailwind CSS. Installing Tailwind CSS first...
✓ Tailwind CSS installed
✓ shadcn/ui configured
```

### Next.js Project Detection

```bash
# If you're not in a Next.js project
avangcli ui-library mui

❌ Error: This command must be run in a Next.js project directory
```

### Package Manager Detection

```bash
# The CLI automatically detects:
- npm (package-lock.json)
- yarn (yarn.lock)
- pnpm (pnpm-lock.yaml)
- bun (bun.lockb)
```

## Troubleshooting

### Error: "Command not found: npx shadcn"

**Solution:**

```bash
# Run with explicit npx
npx shadcn@latest add button
```

### Error: "Tailwind not configured"

**Solution:**

```bash
# Install Tailwind manually
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### MUI Components Don't Look Right

**Cause:** Missing server configuration

**Solution:**

```typescript
// Verify you have the provider in layout.tsx
import { ThemeProvider } from "@mui/material/styles"
```

### shadcn Components Have No Styles

**Cause:** Missing globals.css import

**Solution:**

```typescript
// app/layout.tsx
import "./globals.css"
```

## Next Steps

After installing a UI library:

1. **Explore components**
   - Review official documentation
   - Test basic components

2. **Customize the theme**
   - Define brand colors
   - Configure typography

3. **Create reusable components**

   ```bash
   avangcli module shared-components --store none
   ```

4. **Integrate with your modules**
   ```typescript
   // modules/user-profile/containers/user-profile-container.tsx
   import { Card, Button } from "@/components/ui/card"
   ```

## Tips and Best Practices

### 1. Wrapper Components

```typescript
// components/custom-button.tsx
import { Button } from '@mui/material'

export function CustomButton({ children, ...props }) {
  return (
    <Button
      {...props}
      sx={{ borderRadius: 2, textTransform: 'none' }}
    >
      {children}
    </Button>
  )
}
```

### 2. Centralized Theme

```typescript
// lib/theme.ts
export const colors = {
  primary: "#0070f3",
  secondary: "#7928ca"
}
```

### 3. Shared Components

```bash
# Create module for shared components
avangcli module ui-components --store none

# Structure:
modules/ui-components/
├── components/
│   ├── custom-button.tsx
│   ├── custom-card.tsx
│   └── custom-input.tsx
```

## Related Resources

- [Init command](./init.md)
- [Module command](./module.md)
- [Best Practices](../08-guides/best-practices.md)
- [Complete Project](../08-guides/complete-project-walkthrough.md)
