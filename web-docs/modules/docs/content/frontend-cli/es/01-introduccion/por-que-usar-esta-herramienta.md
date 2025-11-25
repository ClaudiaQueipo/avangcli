# ¿Por Qué Usar AvangCLI Frontend?

## Ventajas Clave

### ⚡ Velocidad de Desarrollo

**Ahorro de tiempo significativo:**

- Configura un proyecto Next.js completo en minutos en lugar de horas
- Proyecto preconfigurado con git hooks, linter, formatter, configuración de docker, librería de componentes, tailwind.
- Genera módulos enteros con estructura completa en segundos (basado en screaming architecture)
- Elimina la necesidad de copiar y pegar código boilerplate

**Ejemplo:** Un proyecto que normalmente tomaría 2-3 horas para configurar (Next.js + ESLint + Prettier + Docker + Git hooks + UI library) se reduce a 2-5 minutos con AvangCLI.

### 🎯 Consistencia y Estandarización

**Código homogéneo en todo el proyecto:**

- Todos los módulos siguen la misma estructura arquitectónica
- Convenciones de nombres consistentes (kebab-case, PascalCase, camelCase)

**Beneficio:** Un nuevo desarrollador puede entender rápidamente cualquier módulo del proyecto porque todos siguen la misma estructura.

### 🏗️ Arquitectura Probada

**Screaming Architecture implementada:**

- Estructura que comunica visualmente el propósito del código
- Separación clara de responsabilidades
- Escalabilidad incorporada desde el inicio

**Ventaja:** Tu proyecto crece de forma organizada sin necesidad de refactorizar la estructura.

### 🛡️ Menos Errores

**Validaciones integradas:**

- Verificación de proyectos Next.js antes de generar módulos
- Detección automática de dependencias faltantes
- Prevención de conflictos de nombres

**Resultado:** Menos tiempo depurando problemas de configuración.

### 🔧 Configuración Inteligente

**Detección automática:**

- Identifica el gestor de paquetes utilizado (npm, yarn, pnpm, bun)
- Detecta si existe configuración de Tailwind CSS

**Beneficio:** El CLI se adapta a tu proyecto existente en lugar de forzarte a una estructura específica.

### 📚 Best Practices Incluidas

**Patrones de diseño modernos:**

- Singleton pattern en servicios
- Barrel exports para imports limpios
- Container / Presentational pattern
- Componentes funcionales con React hooks

**Documentación inline:**

- Explicaciones claras del propósito de cada archivo
- Ejemplos de uso incluidos

## Comparación con Otras Herramientas

### vs. create-next-app

**create-next-app** es excelente para iniciar un proyecto básico, pero AvangCLI va más allá:

- ✅ **create-next-app**: Crea el proyecto inicial
- ✅ **AvangCLI**: Crea el proyecto + configura todas las herramientas + genera módulos escalables

**Ejemplo:**

```bash
# create-next-app
npx create-next-app my-app
# Luego necesitas configurar manualmente: Docker, Git hooks, etc.

# AvangCLI
avangcli init my-app --pm bun --lf eslint-prettier --docker both --git-setup --ui shadcn
# Todo configurado en un solo comando
```

### vs. Otros Scaffolding Tools

**Características distintivas de AvangCLI:**

1. **Arquitectura opinada pero flexible**: Implementa Screaming Architecture pero permite personalización
2. **Soporte de múltiples gestores de estado**: Zustand y Redux con configuración predefinida
3. **Validación de proyectos Next.js**: Verifica que estás en un proyecto válido antes de generar código
4. **Configuración de calidad de código**: Git hooks, commitlint, lint-staged todo integrado

## ¿Qué Hace a AvangCLI Distintivo?

### 1. Enfoque en Next.js

Específicamente diseñado para Next.js con conocimiento profundo de:

- App Router (Next.js 14+)
- Server Components y Client Components
- Estructura de directorios moderna
- Mejores prácticas de Next.js

### 2. Generación de Módulos Completos

No solo genera componentes individuales, sino **módulos completos** con:

- Componentes
- Contenedores
- Servicios con patrón Singleton
- Types y interfaces TypeScript
- Hooks personalizados
- Store (Zustand/Redux)
- Adaptadores
- Helpers y utilidades
- Barrel exports organizados

### 3. Configuración Integral de Herramientas

**Un solo comando para configurar:**

- Linters (ESLint, Biome)
- Formatters (Prettier)
- Git hooks (Husky)
- Commit conventions (Commitizen, Commitlint)
- Pre-commit checks (Lint-staged)
- Containerization (Docker)
- UI Libraries (MUI, shadcn, HeroUI)

### 4. Developer Experience Superior

**Interfaz interactiva con @clack/prompts:**

- Prompts claros y visuales
- Feedback en tiempo real
- Manejo elegante de errores
- Mensajes informativos de progreso

### 5. Flexibilidad y Control

**Modo interactivo o con argumentos:**

```bash
# Modo interactivo
avangcli init

# Modo con argumentos (CI/CD friendly)
avangcli init my-app --pm bun --tailwind --lf biome --docker prod
```

## Próximos Pasos

- [Cuándo usar esta herramienta](./cuando-usar.md)
- [Guía de instalación](../02-primeros-pasos/instalacion.md)
- [Tutorial: Proyecto completo](../08-guias/proyecto-completo-paso-a-paso.md)
