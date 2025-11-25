# Solución de Problemas

## Introducción

Esta guía te ayudará a resolver los problemas más comunes que puedes encontrar al usar AvangCLI. Si no encuentras tu problema aquí, por favor [reporta un issue](https://github.com/avangenio/avangcli/issues).

## Problemas de Instalación

### Error: "command not found: avangcli"

**Síntoma:** El comando `avangcli` no es reconocido después de la instalación.

**Solución:**

```bash
# Verificar si está instalado globalmente
npm list -g avangcli

# Si no está instalado, instalar globalmente
npm install -g avangcli

# O con Bun
bun install -g avangcli

# Verificar la variable PATH
echo $PATH

# Si usas bun, asegúrate de que el bin path esté en PATH
export PATH="$HOME/.bun/bin:$PATH"

# Si usas npm
export PATH="$HOME/.npm-global/bin:$PATH"
```

### Error de Permisos en Linux/Mac

**Síntoma:** `EACCES` o `permission denied` durante la instalación.

**Solución:**

```bash
# Opción 1: Usar un prefijo local para npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
source ~/.profile

# Opción 2: Cambiar permisos del directorio npm
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Opción 3: Usar nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
npm install -g avangcli
```

### Versión Incompatible de Node

**Síntoma:** Error sobre versión de Node.js no compatible.

**Solución:**

```bash
# Verificar versión actual
node --version

# Instalar versión compatible (>=18.0.0)
nvm install 18
nvm use 18

# O usar Bun (recomendado)
curl -fsSL https://bun.sh/install | bash
```

## Problemas con Comandos

### `avangcli init` Falla

#### Error: "Directory already exists"

**Síntoma:** No se puede crear el proyecto porque el directorio ya existe.

**Solución:**

```bash
# Opción 1: Usar otro nombre
avangcli init my-app-v2

# Opción 2: Eliminar directorio existente
rm -rf my-app
avangcli init my-app

# Opción 3: Renombrar directorio existente
mv my-app my-app-old
avangcli init my-app
```

#### Error: "Failed to install dependencies"

**Síntoma:** La instalación de dependencias falla durante `avangcli init`.

**Solución:**

```bash
# Limpiar caché de npm
npm cache clean --force

# Intentar con otro package manager
avangcli init my-app --pm bun

# Si persiste, instalar manualmente
avangcli init my-app --skip-install
cd my-app
npm install
```

### `avangcli module` Falla

#### Error: "Not in a valid project"

**Síntoma:** El comando module no funciona.

**Solución:**

```bash
# Asegurarse de estar en la raíz del proyecto
cd /path/to/your/project

# Verificar que existe package.json
ls -la package.json

# Verificar que es un proyecto Next.js
cat package.json | grep "next"
```

#### Error: "Module already exists"

**Síntoma:** El módulo que intentas crear ya existe.

**Solución:**

```bash
# Verificar módulos existentes
ls -la modules/

# Usar otro nombre
avangcli module user-management

# O eliminar el módulo existente
rm -rf modules/user
avangcli module user
```

### `avangcli ui-library` Falla

#### Error: "UI library already configured"

**Síntoma:** Ya hay una UI library configurada.

**Solución:**

```bash
# Ver cuál está configurada
cat package.json | grep -E "(mui|shadcn|heroui)"

# Si quieres cambiar, eliminar la anterior manualmente
npm uninstall @mui/material @emotion/react @emotion/styled

# Luego instalar la nueva
avangcli ui-library --ui shadcn
```

## Problemas de Desarrollo

### Errores de TypeScript

#### Error: "Cannot find module '@/modules/...'"

**Síntoma:** TypeScript no encuentra los imports de módulos.

**Solución:**

```bash
# Verificar tsconfig.json
cat tsconfig.json

# Asegurarse de que los paths estén configurados
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/modules/*": ["./modules/*"]
    }
  }
}

# Reiniciar el servidor de desarrollo
npm run dev
```

#### Error: "Type 'X' is not assignable to type 'Y'"

**Síntoma:** Errores de tipos en el código generado.

**Solución:**

```typescript
// Verificar que los tipos estén correctamente importados
import type { UserProfile } from "../types/user-profile.types"

// Usar type assertions si es necesario
const profile = data as UserProfile

// O type guards
function isUserProfile(data: any): data is UserProfile {
  return "id" in data && "name" in data
}
```

### Errores de Build

#### Error: "Module not found" durante build

**Síntoma:** El build falla con errores de módulos no encontrados.

**Solución:**

```bash
# Limpiar caché de Next.js
rm -rf .next

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### Error: "Out of memory"

**Síntoma:** El build se queda sin memoria.

**Solución:**

```bash
# Aumentar memoria de Node
export NODE_OPTIONS="--max-old-space-size=4096"

# O en package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### Errores de Runtime

#### Error: "Hydration failed"

**Síntoma:** Error de hidratación en Next.js.

**Solución:**

```typescript
// Asegurarse de que el HTML servidor/cliente coincide
// Evitar:
<div>
  {typeof window !== 'undefined' && <ClientComponent />}
</div>

// Usar:
'use client'

import { useEffect, useState } from 'react'

export function Component() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <ClientComponent />
}
```

#### Error: "useStore is not a function"

**Síntoma:** Error al usar Zustand store.

**Solución:**

```typescript
// Verificar que el store esté correctamente exportado
// store/user.store.ts
export const useUserStore = create<UserStore>((set) => ({
  // ...
}))

// En el componente
;("use client") // Asegurarse de que sea client component

import { useUserStore } from "../store/user.store"

export const Component = () => {
  const { data } = useUserStore() // ✅
  // const data = useUserStore((state) => state.data) // ✅ También válido
}
```

## Problemas de Configuración

### ESLint Errors

#### Error: "Parsing error: Cannot find module 'next/babel'"

**Síntoma:** ESLint no puede parsear archivos.

**Solución:**

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "parserOptions": {
    "babelOptions": {
      "presets": [require.resolve("next/babel")]
    }
  }
}
```

### Prettier Conflicts

#### Error: Prettier y ESLint están en conflicto

**Síntoma:** Reglas de formato contradictorias.

**Solución:**

```bash
# Instalar eslint-config-prettier
npm install --save-dev eslint-config-prettier

# Actualizar .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier" // Debe ser el último
  ]
}
```

### Tailwind CSS No Funciona

#### Error: Clases de Tailwind no se aplican

**Síntoma:** Las clases de Tailwind no tienen efecto.

**Solución:**

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}', // ← Importante
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
}

export default config
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Problemas de Package Managers

### npm vs Bun vs pnpm Conflicts

**Síntoma:** Errores al mezclar package managers.

**Solución:**

```bash
# Limpiar todos los lock files
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml bun.lockb

# Reinstalar con un solo package manager
npm install
# O
bun install
# O
pnpm install

# Configurar el proyecto para usar uno específico
echo "package-manager=bun" > .npmrc
```

## Problemas de Store Managers

### Zustand State No Se Actualiza

**Síntoma:** El estado de Zustand no se refleja en los componentes.

**Solución:**

```typescript
// ❌ Mal: Mutar estado directamente
set({ data: state.data.push(item) })

// ✅ Bien: Crear nuevo objeto
set({ data: [...state.data, item] })

// ✅ Bien: Usar Immer
import { immer } from "zustand/middleware/immer"

export const useStore = create<Store>()(
  immer((set) => ({
    data: [],
    addItem: (item) =>
      set((state) => {
        state.data.push(item) // Ahora sí funciona
      })
  }))
)
```

### Redux DevTools No Aparece

**Síntoma:** Redux DevTools no muestra el estado.

**Solución:**

```typescript
// Para Zustand
import { devtools } from "zustand/middleware"

export const useStore = create<Store>()(
  devtools(
    (set) => ({
      // ...
    }),
    { name: "MyStore" } // ← Importante dar nombre
  )
)

// Verificar que la extensión esté instalada
// Chrome/Edge: Redux DevTools Extension
```

## Problemas de UI Libraries

### shadcn/ui Components No Se Encuentran

**Síntoma:** Componentes de shadcn/ui no están disponibles.

**Solución:**

```bash
# Verificar que shadcn esté inicializado
ls -la components/ui

# Si no existe, inicializar
npx shadcn-ui@latest init

# Agregar componentes necesarios
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

### MUI Styles No Se Aplican

**Síntoma:** Estilos de Material-UI no funcionan.

**Solución:**

```typescript
// app/layout.tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/config/theme'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
```

## Problemas de Performance

### Aplicación Lenta en Desarrollo

**Síntoma:** El servidor de desarrollo es muy lento.

**Solución:**

```bash
# Usar Turbopack (Next.js 13+)
npm run dev --turbo

# O actualizar package.json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}

# Verificar que no haya imports circulares
# Usar herramientas como madge
npm install -g madge
madge --circular --extensions ts,tsx .
```

### Build Muy Lento

**Síntoma:** El build tarda mucho tiempo.

**Solución:**

```javascript
// next.config.js
module.exports = {
  // Deshabilitar análisis de bundle en desarrollo
  productionBrowserSourceMaps: false,

  // Optimizar compilación
  swcMinify: true,

  // Reducir verificaciones de tipos durante build
  typescript: {
    ignoreBuildErrors: false // Solo en emergencias
  },

  // Optimizar imágenes
  images: {
    formats: ["image/avif", "image/webp"]
  }
}
```

## Problemas de Git/Husky

### Pre-commit Hook Falla

**Síntoma:** El commit falla en el pre-commit hook.

**Solución:**

```bash
# Verificar que husky esté instalado
ls -la .husky/pre-commit

# Reinstalar husky
npm install --save-dev husky
npx husky install

# Dar permisos de ejecución
chmod +x .husky/pre-commit

# Si necesitas saltarte el hook (no recomendado)
git commit --no-verify -m "message"
```

### Commitlint Rechaza Commits

**Síntoma:** Los mensajes de commit son rechazados.

**Solución:**

```bash
# Usar el formato convencional
# Tipo: feat, fix, docs, style, refactor, test, chore

# ✅ Bien
git commit -m "feat: add user profile module"
git commit -m "fix: resolve hydration error"
git commit -m "docs: update README"

# ❌ Mal
git commit -m "added stuff"
git commit -m "WIP"

# Ver configuración
cat commitlint.config.js
```

## Problemas de Variables de Entorno

### Variables de Entorno No Disponibles

**Síntoma:** `process.env.NEXT_PUBLIC_*` es undefined.

**Solución:**

```bash
# Verificar que el archivo .env.local existe
ls -la .env.local

# Las variables públicas deben tener el prefijo
# ✅ Bien
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=MyApp

# ❌ Mal (no estará disponible en el cliente)
API_URL=http://localhost:3001

# Reiniciar el servidor después de cambios
# Las variables se cargan al iniciar
npm run dev
```

## Cómo Reportar un Bug

Si tu problema no está aquí, por favor reporta un issue con:

1. **Descripción clara del problema**
2. **Pasos para reproducir**
3. **Comportamiento esperado vs actual**
4. **Versiones:**

   ```bash
   avangcli --version
   node --version
   npm --version
   ```

5. **Logs de error completos**
6. **Configuración relevante** (package.json, next.config.js, etc.)

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs/)
- [Documentación de Redux Toolkit](https://redux-toolkit.js.org/)
- [Documentación de shadcn/ui](https://ui.shadcn.com/)
- [GitHub Issues](https://github.com/avangenio/avangcli/issues)

## Comandos Útiles para Debugging

```bash
# Verificar versiones
avangcli --version
node --version
npm --version

# Limpiar caché
npm cache clean --force
rm -rf .next node_modules package-lock.json
npm install

# Ver estructura del proyecto
tree -L 2 -I node_modules

# Verificar dependencias
npm list --depth=0

# Ver scripts disponibles
npm run

# Verificar configuración de TypeScript
npx tsc --noEmit

# Verificar configuración de ESLint
npx eslint --print-config .

# Analizar bundle
npm run build
npx @next/bundle-analyzer
```
