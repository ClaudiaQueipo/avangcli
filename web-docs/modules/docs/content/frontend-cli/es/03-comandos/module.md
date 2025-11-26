# Comando: module

## Descripción

El comando `module` genera un módulo completo en un proyecto Next.js existente, siguiendo el patrón de **Screaming Architecture**. Crea automáticamente toda la estructura de carpetas, archivos boilerplate, servicios, tipos, hooks, y opcionalmente configuración de store (Zustand o Redux).

## Sintaxis

```bash
avangcli module <nombre-modulo> [opciones]
```

## Prerrequisitos

- Estar en un proyecto Next.js válido
- El proyecto debe tener `package.json`
- (Opcional) Tailwind CSS instalado si usas gestores de estado con UI

## Modo Interactivo

Si no especificas todas las opciones, la CLI te preguntará:

```bash
avangcli module perfil-usuario
```

La CLI preguntará:

1. ¿Qué gestor de estado quieres usar? (zustand, redux, none)

## Opciones

### `<nombre-modulo>`

- **Tipo:** Posicional (requerido)
- **Formato:** kebab-case (ej: `perfil-usuario`, `carrito-compras`)
- **Descripción:** Nombre del módulo a crear
- **Ejemplo:** `avangcli module perfil-usuario`

### `--store, --st`

- **Tipo:** String
- **Opciones:** `zustand`, `redux`, `none`
- **Descripción:** Gestor de estado a utilizar
- **Ejemplo:** `--store zustand`

### `--set-default-global, -g`

- **Tipo:** Boolean
- **Descripción:** Establece el gestor de estado elegido como predeterminado global
- **Ejemplo:** `-g`

### `--set-default-project, -p`

- **Tipo:** Boolean
- **Descripción:** Establece el gestor de estado como predeterminado para el proyecto actual
- **Ejemplo:** `-p`

### `--skip-validation, -s`

- **Tipo:** Boolean
- **Descripción:** Omite la validación del proyecto Next.js (usar con precaución)
- **Ejemplo:** `--skip-validation`

## Ejemplos de Uso

### Ejemplo 1: Módulo Básico (Modo Interactivo)

```bash
avangcli module perfil-usuario
```

La CLI preguntará qué gestor de estado usar.

### Ejemplo 2: Módulo con Zustand

```bash
avangcli module carrito-compras --store zustand
```

Crea el módulo con Zustand configurado.

### Ejemplo 3: Módulo con Redux y Predeterminado Global

```bash
avangcli module autenticacion --store redux -g
```

Crea módulo con Redux y lo establece como predeterminado global para módulos futuros.

### Ejemplo 4: Módulo con Predeterminado de Proyecto

```bash
avangcli module productos --store zustand -p
```

Usa Zustand y lo guarda como predeterminado para este proyecto.

### Ejemplo 5: Sin Gestor de Estado

```bash
avangcli module entradas-blog --store none
```

Crea el módulo sin configuración de estado.

### Ejemplo 6: Múltiples Módulos con Configuración Guardada

```bash
# Primer módulo: establece Zustand como predeterminado
avangcli module usuario --store zustand -p

# Siguientes módulos usan Zustand automáticamente
avangcli module productos
avangcli module pedidos
avangcli module reseñas
```

## Estructura del Módulo Generado

### Estructura Completa

```
app/modules/perfil-usuario/
├── components/          # Componentes UI reutilizables
├── containers/          # Componentes contenedor
│   └── perfil-usuario-container.tsx
├── services/            # Lógica de negocio
│   └── perfil-usuario.service.ts
├── types/               # Definiciones TypeScript
│   └── perfil-usuario.types.ts
├── hooks/               # Hooks personalizados de React
├── store/               # Estado del módulo
│   ├── perfil-usuario.store.ts  (Zustand)
│   └── perfil-usuario.slice.ts  (Redux)
├── adapters/            # Adaptadores para APIs externas
├── helpers/             # Funciones utilitarias
├── lib/                 # Utilidades específicas
└── index.ts             # Exportación barril
```

### Si existe directorio `src/`

La CLI detecta automáticamente si el proyecto usa `src/`:

```
src/modules/perfil-usuario/
└── ... (misma estructura)
```

## Archivos Creados

### 1. Contenedor (`perfil-usuario-container.tsx`)

```typescript
'use client'

import React from 'react'

interface PerfilUsuarioContainerProps {
  // Agrega tus props aquí
}

/**
 * PerfilUsuarioContainer
 *
 * Componente contenedor principal para el módulo perfil-usuario.
 * Maneja la lógica principal y gestión de estado para esta funcionalidad.
 */
export const PerfilUsuarioContainer: React.FC<PerfilUsuarioContainerProps> = (props) => {
  // Agrega tu lógica aquí

  return (
    <div className="perfil-usuario-container">
      <h1>Módulo PerfilUsuario</h1>
      <p>Este es el contenedor principal para el módulo perfil-usuario.</p>
    </div>
  )
}

PerfilUsuarioContainer.displayName = 'PerfilUsuarioContainer'
```

### 2. Servicio (`perfil-usuario.service.ts`)

```typescript
/**
 * PerfilUsuarioService
 *
 * Clase de servicio para manejar la lógica de negocio del módulo perfil-usuario.
 * Implementa el patrón singleton para gestión de estado consistente.
 */
export class PerfilUsuarioService {
  private static instance: PerfilUsuarioService

  private constructor() {
    this.initialize()
  }

  public static getInstance(): PerfilUsuarioService {
    if (!PerfilUsuarioService.instance) {
      PerfilUsuarioService.instance = new PerfilUsuarioService()
    }
    return PerfilUsuarioService.instance
  }

  private initialize(): void {
    // Agrega lógica de inicialización aquí
  }

  public async fetchData(): Promise<any> {
    try {
      return { message: "Datos de perfil-usuario" }
    } catch (error) {
      console.error("Error obteniendo datos de perfil-usuario:", error)
      throw error
    }
  }

  public processData(data: any): any {
    return data
  }
}

export const perfilUsuarioService = PerfilUsuarioService.getInstance()
```

### 3. Tipos (`perfil-usuario.types.ts`)

```typescript
export interface PerfilUsuarioData {
  id: string
  // Agrega tus propiedades de datos aquí
}

export interface PerfilUsuarioState {
  isLoading: boolean
  error: string | null
  data: PerfilUsuarioData | null
}

export interface PerfilUsuarioActions {
  fetch: () => Promise<void>
  reset: () => void
}

export type PerfilUsuarioStatus = "idle" | "loading" | "success" | "error"
```

### 4. Store Zustand (`perfil-usuario.store.ts`)

```typescript
import { create } from "zustand"
import type { PerfilUsuarioData, PerfilUsuarioState } from "../types/perfil-usuario.types"

interface PerfilUsuarioStore extends PerfilUsuarioState {
  setData: (data: PerfilUsuarioData | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: PerfilUsuarioState = {
  isLoading: false,
  error: null,
  data: null
}

export const usePerfilUsuarioStore = create<PerfilUsuarioStore>((set) => ({
  ...initialState,
  setData: (data) => set({ data, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set(initialState)
}))
```

### 5. Slice Redux (`perfil-usuario.slice.ts`)

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { PerfilUsuarioData, PerfilUsuarioState } from "../types/perfil-usuario.types"

const initialState: PerfilUsuarioState = {
  isLoading: false,
  error: null,
  data: null
}

const perfilUsuarioSlice = createSlice({
  name: "perfil-usuario",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<PerfilUsuarioData | null>) => {
      state.data = action.payload
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    reset: (state) => {
      Object.assign(state, initialState)
    }
  }
})

export const perfilUsuarioActions = perfilUsuarioSlice.actions
export const perfilUsuarioReducer = perfilUsuarioSlice.reducer

// Selectores
export const selectPerfilUsuarioData = (state: { perfilUsuario: PerfilUsuarioState }) => state.perfilUsuario.data
export const selectPerfilUsuarioLoading = (state: { perfilUsuario: PerfilUsuarioState }) =>
  state.perfilUsuario.isLoading
export const selectPerfilUsuarioError = (state: { perfilUsuario: PerfilUsuarioState }) => state.perfilUsuario.error
```

### 6. Exportación Barril (`index.ts`)

```typescript
/**
 * Módulo PerfilUsuario
 *
 * Archivo de exportación barril para el módulo perfil-usuario.
 */

// Contenedores
export { PerfilUsuarioContainer } from "./containers/perfil-usuario-container"

// Servicios
export { PerfilUsuarioService, perfilUsuarioService } from "./services/perfil-usuario.service"

// Tipos
export type {
  PerfilUsuarioData,
  PerfilUsuarioState,
  PerfilUsuarioActions,
  PerfilUsuarioStatus
} from "./types/perfil-usuario.types"

// Store Zustand (si se usó)
export { usePerfilUsuarioStore } from "./store/perfil-usuario.store"

// Store Redux (si se usó)
export { perfilUsuarioActions, perfilUsuarioReducer } from "./store/perfil-usuario.slice"
export {
  selectPerfilUsuarioData,
  selectPerfilUsuarioLoading,
  selectPerfilUsuarioError
} from "./store/perfil-usuario.slice"
```

## ¿Qué Hace el Comando?

### 1. Valida el Proyecto Next.js

```bash
# Verifica:
- ✅ Existe package.json
- ✅ Existe next.config.js
- ✅ Existe app/ o pages/
- ✅ Detecta versión de Next.js
- ✅ Detecta si usa src/
```

### 2. Verifica que el Módulo No Exista

```bash
# Previene sobrescribir módulos existentes
❌ Error: El módulo "perfil-usuario" ya existe
```

### 3. Crea la Estructura de Carpetas

```bash
# Crea 9 carpetas:
✓ components/
✓ containers/
✓ adapters/
✓ types/
✓ services/
✓ hooks/
✓ store/
✓ lib/
✓ helpers/
```

### 4. Genera Archivos Boilerplate

```bash
✓ containers/perfil-usuario-container.tsx
✓ services/perfil-usuario.service.ts
✓ types/perfil-usuario.types.ts
✓ store/perfil-usuario.store.ts (si Zustand)
✓ store/perfil-usuario.slice.ts (si Redux)
✓ index.ts
```

### 5. Instala Dependencias (si es necesario)

```bash
# Si usas Zustand y no está instalado
📦 Instalando zustand...

# Si usas Redux y no está instalado
📦 Instalando @reduxjs/toolkit...
```

## Convenciones de Nombres

### Entrada (kebab-case)

```bash
avangcli module perfil-usuario
avangcli module carrito-compras
avangcli module revisiones-producto
```

### Archivos Generados

```
perfil-usuario-container.tsx    # kebab-case
perfil-usuario.service.ts        # kebab-case
perfil-usuario.types.ts          # kebab-case
perfil-usuario.store.ts          # kebab-case
```

### Clases y Componentes (PascalCase)

```typescript
PerfilUsuarioContainer
PerfilUsuarioService
PerfilUsuarioData
```

### Instancias y Hooks (camelCase)

```typescript
perfilUsuarioService
usePerfilUsuarioStore
```

## Usando el Módulo Generado

### En una Página

```typescript
// app/perfil/page.tsx
import { PerfilUsuarioContainer } from '@/modules/perfil-usuario'

export default function PaginaPerfil() {
  return <PerfilUsuarioContainer />
}
```

### Usando el Servicio

```typescript
import { perfilUsuarioService } from "@/modules/perfil-usuario"

async function cargarPerfil() {
  const data = await perfilUsuarioService.fetchData()
  console.log(data)
}
```

### Usando Store Zustand

```typescript
'use client'

import { usePerfilUsuarioStore } from '@/modules/perfil-usuario'

export function ComponentePerfil() {
  const { data, setData, setLoading } = usePerfilUsuarioStore()

  return <div>{data?.name}</div>
}
```

### Usando Store Redux

```typescript
// 1. Agregar al store
import { perfilUsuarioReducer } from '@/modules/perfil-usuario'

export const store = configureStore({
  reducer: {
    perfilUsuario: perfilUsuarioReducer,
  },
})

// 2. Usar en componentes
import { useSelector, useDispatch } from 'react-redux'
import { perfilUsuarioActions, selectPerfilUsuarioData } from '@/modules/perfil-usuario'

export function ComponentePerfil() {
  const data = useSelector(selectPerfilUsuarioData)
  const dispatch = useDispatch()

  const handleLoad = () => {
    dispatch(perfilUsuarioActions.setLoading(true))
  }

  return <div>{data?.name}</div>
}
```

## Configuración Predeterminada

### Predeterminado Global

```bash
# Se guarda en ~/.avangcli/config.json
avangcli module auth --store zustand -g

# Todos los módulos futuros usarán Zustand
avangcli module productos  # Usa Zustand automáticamente
```

### Predeterminado de Proyecto

```bash
# Se guarda en .avangcli.json en la raíz del proyecto
avangcli module auth --store redux -p

# Solo en este proyecto usará Redux
avangcli module productos  # Usa Redux automáticamente
```

### Prioridad de Predeterminados

1. Argumento CLI (`--store zustand`)
2. Predeterminado de proyecto (`.avangcli.json`)
3. Predeterminado global (`~/.avangcli/config.json`)
4. Pregunta interactiva

## Solución de Problemas

### Error: "No es un proyecto Next.js válido"

**Causa:** No estás en un proyecto Next.js o faltan archivos clave.

**Solución:**

```bash
# Verifica que existan:
ls package.json
ls next.config.js
ls app/  # o pages/

# O usa skip-validation (no recomendado)
avangcli module mi-modulo --skip-validation
```

### Error: "El módulo ya existe"

**Causa:** Ya existe un módulo con ese nombre.

**Solución:**

```bash
# Elige otro nombre
avangcli module perfil-usuario-v2

# O elimina el módulo existente
rm -rf app/modules/perfil-usuario
```

### Error: "Nombre de módulo inválido"

**Causa:** Nombre con caracteres inválidos.

**Solución:**

```bash
# Usa kebab-case
avangcli module perfil-usuario  ✅
avangcli module PerfilUsuario   ❌
avangcli module perfil_usuario  ❌
```

### Gestor de Estado no se Instala

**Solución:**

```bash
# Instalar manualmente
npm install zustand
# o
npm install @reduxjs/toolkit
```

## Próximos Pasos

Después de generar un módulo:

1. **Personaliza el Contenedor**
   - Agrega props necesarias
   - Implementa la lógica del UI

2. **Implementa el Servicio**
   - Agrega métodos de negocio
   - Conecta con APIs

3. **Define Tipos**
   - Agrega interfaces específicas
   - Extiende tipos base

4. **Configura el Store**
   - Agrega acciones necesarias
   - Implementa selectores

5. **Agrega Pruebas**

   ```bash
   # Crea archivos de test
   touch app/modules/perfil-usuario/__tests__/perfil-usuario.test.ts
   ```

## Recursos Relacionados

- [Arquitectura Gritando](../04-arquitectura/screaming-architecture.md)
- [Gestores de Estado](../05-integraciones/store-managers.md)
- [Comando ui-library](./ui-library.md)
- [Mejores Prácticas](../08-guias/mejores-practicas.md)
