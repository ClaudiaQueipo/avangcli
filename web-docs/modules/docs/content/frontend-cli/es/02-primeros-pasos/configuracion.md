# Configuración

## Introducción

AvangCLI permite configurar preferencias por proyecto para automatizar decisiones comunes y acelerar tu flujo de trabajo. Esta guía explica todas las opciones de configuración disponibles.

## Archivos de Configuración

### Proyecto: `avangclirc.json`

**Ubicación:** Raíz del proyecto

**Propósito:** Configuración específica del proyecto

**Ejemplo:**

```json
{
  "packageManager": "pnpm",
  "tailwind": true,
  "linterFormatter": "eslint-prettier",
  "docker": "dev",
  "uiLibrary": "shadcn",
  "gitSetup": true
}
```

## Opciones de Configuración

### Package Manager

**Opción:** `defaultPackageManager`

**Valores:** `npm` | `yarn` | `pnpm` | `bun`

**Default:** `npm`

**Establecer por proyecto:**

```bash
# Editar avangclirc.json en la raíz del proyecto
{
  "packageManager": "pnpm"
}
```

**Uso:**

```bash
# Sin configuración
avangcli init my-app
# → Pregunta qué package manager usar

# Con configuración de proyecto
avangcli init my-app
# → Usa el package manager configurado automáticamente
```

### Store Manager

**Opción:** `defaultStoreManager`

**Valores:** `zustand` | `redux` | `none`

**Default:** Pregunta interactivamente

**Establecer por proyecto:**

```bash
# Durante la creación de un módulo
avangcli module users --store redux -p

# O manualmente en avangclirc.json
{
  "defaultStoreManager": "redux"
}
```

**Uso:**

```bash
# Sin configuración
avangcli module products
# → Pregunta qué store manager usar

# Con configuración de proyecto
avangcli module products
# → Usa el store manager configurado automáticamente
```

### Linter/Formatter

**Opción:** `defaultLinterFormatter`

**Valores:** `eslint-prettier` | `biome` | `none`

**Default:** `eslint-prettier`

**Configuración:**

```json
{
  "defaultLinterFormatter": "biome"
}
```

### UI Library

**Opción:** `defaultUiLibrary`

**Valores:** `mui` | `shadcn` | `heroui` | `none`

**Default:** `none`

**Configuración:**

```json
{
  "defaultUiLibrary": "shadcn"
}
```

## Prioridad de Configuración

Cuando hay múltiples fuentes de configuración, AvangCLI las aplica en este orden (de mayor a menor prioridad):

1. **Argumentos CLI** - `--pm bun`
2. **Configuración de proyecto** - `avangclirc.json`
3. **Defaults del sistema**
4. **Modo interactivo**

### Ejemplo

```bash
# proyecto/avangclirc.json
{
  "packageManager": "pnpm",
  "defaultStoreManager": "redux"
}

# Comando
avangcli module products --pm bun

# Resultado:
# - Package manager: bun (argumento CLI)
# - Store manager: redux (config proyecto)
```

## Configuración Inicial

```bash
# 1. Crear primer proyecto
avangcli init my-app --pm bun --ui shadcn

# 2. Establecer store manager como default del proyecto
cd my-app
avangcli module auth --store zustand -p

# 3. Todos los módulos futuros usan zustand
avangcli module products  # → usa zustand
avangcli module cart      # → usa zustand
```

## Comandos de Configuración

### Ver Configuración Actual

```bash
# Ver configuración de proyecto
cat avangclirc.json
```

### Editar Configuración

```bash
# Proyecto
code avangclirc.json
```

### Resetear Configuración

```bash
# Proyecto
rm avangclirc.json
```

### Regenerar Configuración de Proyecto

Si necesitas regenerar el archivo `avangclirc.json` basándote en la configuración actual del proyecto:

```bash
# Detecta automáticamente la configuración y regenera avangclirc.json
avangcli config
```

## Configuración por Tipo de Proyecto

### Startup / MVP

```json
{
  "defaultPackageManager": "bun",
  "defaultStoreManager": "zustand",
  "defaultLinterFormatter": "biome",
  "defaultUiLibrary": "shadcn"
}
```

**Razones:**

- Bun: Rápido para desarrollo iterativo
- Zustand: Simple y liviano
- Biome: Fast linting
- shadcn: UI moderna y customizable

### Aplicación Empresarial

```json
{
  "defaultPackageManager": "pnpm",
  "defaultStoreManager": "redux",
  "defaultLinterFormatter": "eslint-prettier",
  "defaultUiLibrary": "mui"
}
```

**Razones:**

- pnpm: Ahorro de espacio en monorepos
- Redux: Patterns establecidos, DevTools avanzadas
- ESLint+Prettier: Estándar de la industria
- MUI: Componentes empresariales robustos

### Proyecto Personal

```json
{
  "defaultPackageManager": "bun",
  "defaultStoreManager": "zustand",
  "defaultLinterFormatter": "biome",
  "defaultUiLibrary": "shadcn"
}
```

## Variables de Entorno

### `.env.local`

AvangCLI respeta las variables de entorno de Next.js:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=MyApp
NEXT_PUBLIC_ENV=development

# Privadas (solo servidor)
DATABASE_URL=postgresql://...
API_SECRET_KEY=...
```

### Uso en la Aplicación

```typescript
// modules/products/services/products.service.ts
export class ProductsService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL!

  async fetchProducts() {
    return fetch(`${this.apiUrl}/products`)
  }
}
```

## Configuración de Herramientas

### ESLint

**Archivo:** `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Prettier

**Archivo:** `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### TypeScript

**Archivo:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./*"],
      "@/modules/*": ["./modules/*"],
      "@/shared/*": ["./shared/*"]
    }
  }
}
```

### Tailwind CSS

**Archivo:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0070f3",
        secondary: "#7928ca"
      }
    }
  },
  plugins: []
}

export default config
```

## Configuración de Git

### Husky Hooks

**Pre-commit:**

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

bun run lint
bun run type-check
```

**Commit-msg:**

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

### Commitlint

**Archivo:** `commitlint.config.js`

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "ci", "build"]]
  }
}
```

## Docker

### Development

**Archivo:** `docker-compose.dev.yml`

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: bun dev
```

### Production

**Archivo:** `docker-compose.prod.yml`

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    command: bun start
```

## Troubleshooting

### Configuración no se Aplica

**Problema:** Cambios en config no tienen efecto

**Solución:**

```bash
# Verificar sintaxis JSON
cat avangclirc.json | jq .

# Verificar permisos
ls -la avangclirc.json

# Recrear archivo
rm avangclirc.json
avangcli config
```

### Conflictos de Configuración

**Problema:** No está claro qué configuración se usa

**Solución:**

```bash
# Ver precedencia:
# 1. CLI args
# 2. avangclirc.json (proyecto)

# Verificar configuración de proyecto
cat avangclirc.json
```

## Recursos Adicionales

- [Instalación](./instalacion.md)
- [Comando init](../03-comandos/init.md)
- [Comando module](../03-comandos/module.md)
- [Mejores Prácticas](../08-guias/mejores-practicas.md)
