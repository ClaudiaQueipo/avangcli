# Comando: ui-library

## Descripción

El comando `ui-library` agrega e instala una librería de componentes UI en un proyecto Next.js existente. Configura automáticamente todas las dependencias, archivos de configuración y estructura necesaria para cada librería soportada.

## Sintaxis

```bash
avangcli ui-library [library]
```

## Prerrequisitos

- Estar en un proyecto Next.js válido
- Node.js 20+ instalado
- Gestor de paquetes configurado (npm, yarn, pnpm, bun)

## Librerías Soportadas

- **Material UI (MUI)** - Librería de componentes robusta y completa
- **shadcn/ui** - Componentes accesibles construidos con Radix UI + Tailwind
- **HeroUI** - Componentes modernos y personalizables con Tailwind

## Modo Interactivo

```bash
avangcli ui-library
```

El CLI mostrará un menú para seleccionar:

1. Material UI (mui)
2. shadcn/ui (shadcn)
3. HeroUI (heroui)
4. None (ninguna)

## Opciones

### `[library]`

- **Tipo:** Posicional (opcional)
- **Opciones:** `mui`, `shadcn`, `heroui`
- **Descripción:** Librería UI a instalar
- **Ejemplo:** `avangcli ui-library shadcn`

## Ejemplos de Uso

### Ejemplo 1: Modo Interactivo

```bash
avangcli ui-library
# Selecciona de la lista
```

### Ejemplo 2: Material UI

```bash
avangcli ui-library mui
```

### Ejemplo 3: shadcn/ui

```bash
avangcli ui-library shadcn
```

### Ejemplo 4: HeroUI

```bash
avangcli ui-library heroui
```

## Material UI (MUI)

### ¿Qué se Instala?

```bash
📦 Paquetes:
- @mui/material
- @emotion/react
- @emotion/styled
```

### Configuración Automática

AvangCLI configura automáticamente:

1. **Theme Provider** en `app/layout.tsx`
2. **Emotion Cache** para SSR
3. **Configuración de tipografía**

### Después de la Instalación

```typescript
// Usar componentes MUI
import { Button, TextField, Card } from '@mui/material'

export default function MyComponent() {
  return (
    <Card>
      <TextField label="Nombre" />
      <Button variant="contained">Enviar</Button>
    </Card>
  )
}
```

### Personalización del Theme

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

### Recursos MUI

- [Documentación oficial](https://mui.com/)
- [Componentes](https://mui.com/components/)
- [Theming](https://mui.com/customization/theming/)

---

## shadcn/ui

### Requisitos Especiales

⚠️ **shadcn/ui requiere Tailwind CSS**

Si tu proyecto no tiene Tailwind, AvangCLI lo instalará automáticamente.

### ¿Qué se Instala?

```bash
📦 Paquetes base:
- tailwindcss (si no está instalado)
- @radix-ui/react-* (según componentes)
- class-variance-authority
- clsx
- tailwind-merge

📁 Archivos creados:
- components.json
- lib/utils.ts
- components/ui/ (carpeta para componentes)
```

### Configuración Automática

AvangCLI configura:

1. **`components.json`** - Configuración de shadcn
2. **`lib/utils.ts`** - Utilidad `cn()` para clases
3. **Tailwind config** - Colores y variables CSS
4. **globals.css** - Variables de tema

### Después de la Instalación

Agregar componentes uno por uno:

```bash
# Agregar componente Button
npx shadcn@latest add button

# Agregar componente Card
npx shadcn@latest add card

# Agregar componente Dialog
npx shadcn@latest add dialog

# Agregar múltiples componentes
npx shadcn@latest add button card dialog input
```

### Usar Componentes

```typescript
// Después de: npx shadcn@latest add button
import { Button } from '@/components/ui/button'

export default function MyComponent() {
  return (
    <Button variant="default">Click me</Button>
  )
}
```

### Personalización de Tema

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... más variables */
  }
}
```

### Ventajas de shadcn/ui

✅ **Copy & Paste** - No son paquetes npm, son tu código
✅ **Personalizable** - Modifica cada componente libremente
✅ **Accesible** - Construido con Radix UI (WAI-ARIA)
✅ **Tipado** - TypeScript completo
✅ **Flexible** - Usa solo lo que necesitas

### Recursos shadcn/ui

- [Documentación oficial](https://ui.shadcn.com/)
- [Componentes](https://ui.shadcn.com/docs/components/accordion)
- [Theming](https://ui.shadcn.com/docs/theming)
- [Ejemplos](https://ui.shadcn.com/examples)

---

## HeroUI

### Requisitos Especiales

⚠️ **HeroUI requiere Tailwind CSS**

Si no tienes Tailwind, AvangCLI lo instalará automáticamente.

### ¿Qué se Instala?

```bash
📦 Paquetes:
- @heroui/react
- framer-motion
- tailwindcss (si no está instalado)
```

### Configuración Automática

AvangCLI configura:

1. **Tailwind config** - Plugin de HeroUI
2. **Provider** - HeroUIProvider en layout
3. **Tema** - Configuración de colores

### Después de la Instalación

```bash
# Agregar componente Button
heroui add button

# Agregar componente Card
heroui add card

# Agregar todos los componentes
heroui add --all
```

### Usar Componentes

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

### Personalización de Tema

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

### Recursos HeroUI

- [Documentación oficial](https://heroui.com/)
- [Componentes](https://heroui.com/docs/components/button)
- [Theming](https://heroui.com/docs/customization/theme)

---

## Comparación de Librerías

| Característica           | Material UI     | shadcn/ui       | HeroUI          |
| ------------------------ | --------------- | --------------- | --------------- |
| **Tailwind CSS**         | ❌ No requiere  | ✅ Requiere     | ✅ Requiere     |
| **Bundle Size**          | Grande (~100KB) | Pequeño (~20KB) | Mediano (~50KB) |
| **Personalización**      | Media           | Muy Alta        | Alta            |
| **Componentes**          | 60+             | 50+             | 40+             |
| **Accesibilidad**        | ✅ Excelente    | ✅ Excelente    | ✅ Buena        |
| **Animaciones**          | Básicas         | Personalizables | ✅ Built-in     |
| **TypeScript**           | ✅ Full         | ✅ Full         | ✅ Full         |
| **Dark Mode**            | ✅ Sí           | ✅ Sí           | ✅ Sí           |
| **Curva de aprendizaje** | Media           | Baja            | Baja            |

## ¿Cuál Elegir?

### Elige Material UI si

- ✅ Quieres una solución completa y robusta
- ✅ No usas Tailwind CSS
- ✅ Necesitas componentes complejos (DataGrid, Autocomplete)
- ✅ Tu equipo conoce Material Design
- ✅ Necesitas soporte empresarial (MUI X)

**Ideal para:** Aplicaciones empresariales, dashboards complejos

### Elige shadcn/ui si

- ✅ Usas Tailwind CSS
- ✅ Quieres control total sobre el código
- ✅ Prefieres copy-paste sobre npm install
- ✅ Necesitas máxima personalización
- ✅ Valoras bundle size pequeño

**Ideal para:** Startups, SaaS, aplicaciones modernas

### Elige HeroUI si

- ✅ Usas Tailwind CSS
- ✅ Quieres componentes modernos y animados
- ✅ Necesitas un middle ground entre MUI y shadcn
- ✅ Valoras diseño moderno y limpio
- ✅ Quieres animaciones built-in

**Ideal para:** Aplicaciones consumer-facing, landing pages

## Workflow Recomendado

### 1. Proyecto Nuevo con UI Library

```bash
# Opción 1: Durante init
avangcli init my-app --pm bun --tailwind --ui shadcn

# Opción 2: Después de init
avangcli init my-app --pm bun --tailwind
cd my-app
avangcli ui-library shadcn
```

### 2. Proyecto Existente

```bash
# Navegar al proyecto
cd my-existing-project

# Agregar UI library
avangcli ui-library mui
```

### 3. Cambiar de UI Library

```bash
# Desinstalar la anterior
npm uninstall @mui/material @emotion/react @emotion/styled

# Instalar la nueva
avangcli ui-library shadcn
```

## Validaciones Automáticas

### Detección de Tailwind

```bash
# shadcn/ui sin Tailwind
avangcli ui-library shadcn

⚠️ shadcn/ui requires Tailwind CSS. Installing Tailwind CSS first...
✓ Tailwind CSS installed
✓ shadcn/ui configured
```

### Detección de Proyecto Next.js

```bash
# Si no estás en un proyecto Next.js
avangcli ui-library mui

❌ Error: This command must be run in a Next.js project directory
```

### Detección de Package Manager

```bash
# El CLI detecta automáticamente:
- npm (package-lock.json)
- yarn (yarn.lock)
- pnpm (pnpm-lock.yaml)
- bun (bun.lockb)
```

## Troubleshooting

### Error: "Command not found: npx shadcn"

**Solución:**

```bash
# Ejecutar con npx explícito
npx shadcn@latest add button
```

### Error: "Tailwind not configured"

**Solución:**

```bash
# Instalar Tailwind manualmente
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Componentes MUI no se ven bien

**Causa:** Falta configuración de servidor

**Solución:**

```typescript
// Verificar que tienes el provider en layout.tsx
import { ThemeProvider } from "@mui/material/styles"
```

### shadcn componentes no tienen estilos

**Causa:** Falta importar globals.css

**Solución:**

```typescript
// app/layout.tsx
import "./globals.css"
```

## Próximos Pasos

Después de instalar una UI library:

1. **Explora componentes**
   - Revisa la documentación oficial
   - Prueba componentes básicos

2. **Personaliza el tema**
   - Define colores de marca
   - Configura tipografía

3. **Crea componentes reutilizables**

   ```bash
   avangcli module shared-components --store none
   ```

4. **Integra con tus módulos**

   ```typescript
   // modules/user-profile/containers/user-profile-container.tsx
   import { Card, Button } from "@/components/ui/card"
   ```

## Tips y Mejores Prácticas

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

### 2. Tema Centralizado

```typescript
// lib/theme.ts
export const colors = {
  primary: "#0070f3",
  secondary: "#7928ca"
}
```

### 3. Componentes Compartidos

```bash
# Crear módulo para componentes compartidos
avangcli module ui-components --store none

# Estructura:
modules/ui-components/
├── components/
│   ├── custom-button.tsx
│   ├── custom-card.tsx
│   └── custom-input.tsx
```

## Recursos Relacionados

- [Comando init](./init.md)
- [Comando module](./module.md)
- [Mejores Prácticas](../08-guias/mejores-practicas.md)
- [Proyecto Completo](../08-guias/proyecto-completo-paso-a-paso.md)
