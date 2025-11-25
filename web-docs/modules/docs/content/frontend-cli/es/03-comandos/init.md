# Comando: init

## Descripción

El comando `init` crea e inicializa un nuevo proyecto Next.js con configuraciones personalizadas y herramientas de desarrollo preconfiguradas.

## Sintaxis

```bash
avangcli init [project-name] [options]
```

## Modo Interactivo

Si ejecutas el comando sin argumentos, AvangCLI te guiará a través de un asistente interactivo:

```bash
avangcli init
```

El CLI te preguntará:

1. Nombre del proyecto
2. Gestor de paquetes (npm, yarn, pnpm, bun)
3. ¿Usar Tailwind CSS?
4. Configuración de linter/formatter
5. Configuración de Docker
6. Librería UI
7. Configuración de Git (hooks, commitlint, etc.)

## Opciones

### `[project-name]`

- **Tipo:** Posicional
- **Descripción:** Nombre del proyecto a crear
- **Ejemplo:** `avangcli init my-awesome-app`

### `--package-manager, --pm`

- **Tipo:** String
- **Opciones:** `npm`, `yarn`, `pnpm`, `bun`
- **Descripción:** Gestor de paquetes a utilizar
- **Ejemplo:** `--pm bun`

### `--tailwind, -t`

- **Tipo:** Boolean
- **Descripción:** Incluir Tailwind CSS en el proyecto
- **Ejemplo:** `--tailwind` o `-t`

### `--linter-formatter, --lf`

- **Tipo:** String
- **Opciones:** `eslint-prettier`, `biome`, `none`
- **Descripción:** Configuración de linter y formatter
- **Ejemplo:** `--lf eslint-prettier`

### `--docker, -d`

- **Tipo:** String
- **Opciones:** `dev`, `prod`, `both`, `none`
- **Descripción:** Configuración de Docker
- **Ejemplo:** `--docker both`

### `--ui-library, --ui`

- **Tipo:** String
- **Opciones:** `mui`, `shadcn`, `heroui`, `none`
- **Descripción:** Librería de componentes UI
- **Ejemplo:** `--ui shadcn`

### `--git-setup, --git`

- **Tipo:** Boolean
- **Descripción:** Configurar Git con Commitizen, Commitlint, Husky y Lint-staged
- **Ejemplo:** `--git-setup`

## Ejemplos de Uso

### Ejemplo 1: Modo Interactivo

```bash
avangcli init
```

El CLI te guiará paso a paso.

### Ejemplo 2: Proyecto Básico con Tailwind

```bash
avangcli init my-app --pm bun --tailwind
```

Crea un proyecto con Bun y Tailwind CSS.

### Ejemplo 3: Proyecto Completo con Todas las Herramientas

```bash
avangcli init my-app --pm bun --tailwind --lf eslint-prettier --docker both --ui shadcn --git-setup
```

Configura:

- Bun como gestor de paquetes
- Tailwind CSS
- ESLint + Prettier
- Docker para dev y producción
- shadcn/ui
- Git hooks y commit conventions

### Ejemplo 4: Proyecto Empresarial con Material UI

```bash
avangcli init company-dashboard --pm pnpm --lf biome --docker prod --ui mui --git-setup
```

### Ejemplo 5: Proyecto Minimalista

```bash
avangcli init simple-app --pm npm --lf none --docker none --ui none
```

## ¿Qué Hace el Comando?

### 1. Crea el Proyecto Next.js Base

```bash
# Internamente ejecuta
create-next-app project-name --typescript --app --no-src-dir
```

**Nota:** Los proyectos se crean **sin** el directorio `src/` por defecto para mantener una estructura raíz más limpia.

### 2. Configura el Linter/Formatter

#### ESLint + Prettier

- Instala dependencias
- Crea `.eslintrc.json`
- Crea `.prettierrc`
- Crea `.prettierignore`
- Configura scripts en `package.json`

#### Biome

- Instala @biomejs/biome
- Crea `biome.json`
- Configura formato y lint

### 3. Configura Docker (si se solicita)

#### Dev

- Crea `docker-compose.dev.yml`
- Dockerfile optimizado para desarrollo
- Hot reload habilitado

#### Prod

- Crea `docker-compose.prod.yml`
- Dockerfile multi-stage para producción
- Optimizado para tamaño y rendimiento

#### Both

- Ambas configuraciones incluidas

### 4. Instala UI Library (si se solicita)

#### Material UI

```bash
# Instala
@mui/material @emotion/react @emotion/styled
```

#### shadcn/ui

```bash
# Requiere Tailwind CSS
# Configura components.json
# Listo para: npx shadcn@latest add button
```

#### HeroUI

```bash
# Requiere Tailwind CSS
# Configura heroui
# Instala @heroui/react
```

### 5. Configura Git Setup (si se solicita)

- Inicializa repositorio Git
- Instala Husky
- Configura pre-commit hooks
- Configura Commitizen
- Configura Commitlint
- Configura Lint-staged

## Estructura del Proyecto Generado

### Proyecto Básico

```
my-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

### Proyecto con Todas las Configuraciones

```
my-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .husky/              ← Git hooks
├── components/
│   └── ui/              ← shadcn components
├── lib/
│   └── utils.ts         ← shadcn utils
├── .eslintrc.json       ← ESLint config
├── .prettierrc          ← Prettier config
├── biome.json           ← Biome config (si se usa)
├── components.json      ← shadcn config
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile
├── .gitignore
├── commitlint.config.js ← Commitlint
├── next.config.js
├── package.json
├── postcss.config.js    ← PostCSS (Tailwind)
├── tailwind.config.ts   ← Tailwind
└── tsconfig.json
```

## Siguientes Pasos Después de Init

Una vez completada la inicialización:

```bash
# Navegar al proyecto
cd my-app

# Iniciar servidor de desarrollo
bun dev          # si usas bun
npm run dev      # si usas npm
yarn dev         # si usas yarn
pnpm dev         # si usas pnpm

# (Opcional) Iniciar con Docker
docker-compose -f docker-compose.dev.yml up
```

## Generar Módulos

```bash
# Crear tu primer módulo
avangcli module authentication --store zustand
```

## Configuración de CI/CD

El comando `init` con `--git-setup` configura todo lo necesario para:

```bash
# Commits con formato estándar
npx cz

# Pre-commit hooks ejecutan automáticamente:
# - Linting
# - Formatting
# - Type checking
```

## Tips y Notas

### Nota sobre Tailwind CSS

Las librerías `shadcn` y `heroui` **requieren Tailwind CSS**. Si no lo incluiste al inicio, el CLI lo instalará automáticamente.

```bash
# shadcn sin Tailwind
avangcli init my-app --ui shadcn
# ⚠️ CLI instalará Tailwind automáticamente
```

## Troubleshooting

### Error: "create-next-app failed"

**Causa:** Problemas de red o versión de Node.js

**Solución:**

```bash
# Verificar versión de Node.js
node --version  # Debe ser >= 20

# Limpiar caché
npm cache clean --force

# Intentar nuevamente
avangcli init my-app
```

### Error: "Permission denied"

**Solución:**

```bash
# Linux/Mac
sudo chown -R $USER:$USER my-app

# O ejecutar sin sudo
avangcli init my-app
```

### Proyecto Creado Pero Sin Dependencias

**Solución:**

```bash
cd my-app
bun install  # o npm install
```

## Recursos Relacionados

- [Comando module](./module.md)
- [Comando ui-library](./ui-library.md)
- [Configuración](../02-primeros-pasos/configuracion.md)
- [Proyecto completo](../08-guias/proyecto-completo-paso-a-paso.md)
