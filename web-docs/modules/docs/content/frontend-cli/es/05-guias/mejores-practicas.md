# Mejores Prácticas con AvangCLI

## Organización de Proyecto

En este módulo se explicarán cuales son las mejores prácticas para el desarrollo de módulos con AvangCLI, para ello se mostrará la forma correcta y la incorrecta en cada caso.

### 1. Estructura de Módulos

#### ✅ BIEN: Organizar por Característica

```
modules/
├── authentication/
│   ├── components/
│   ├── services/
│   └── store/
├── user-profile/
│   ├── components/
│   ├── services/
│   └── store/
└── products/
    ├── components/
    ├── services/
    └── store/
```

#### ❌ MAL: Organizar por Tipo

```
components/
├── AuthForm.tsx
├── UserCard.tsx
└── ProductList.tsx
services/
├── authService.ts
├── userService.ts
└── productService.ts
```

### 2. Scope Rule (Regla de Alcance)

**Principio:** El código debe vivir lo más cerca posible de donde se usa.

#### Componente Usado en 1 Módulo

```
modules/user-profile/
└── components/
    └── Avatar.tsx  ← Solo aquí
```

#### Componente Usado en 2+ Módulos

```
shared/
└── components/
    └── Button.tsx  ← Compartido
```

### 3. Convenciones de Nombres

#### Módulos: kebab-case

```bash
✅ avangcli module user-profile
✅ avangcli module shopping-cart
✅ avangcli module product-catalog

❌ avangcli module UserProfile
❌ avangcli module user_profile
❌ avangcli module userprofile
```

#### Archivos: kebab-case

```
✅ user-profile-container.tsx
✅ user-profile.service.ts
✅ use-user-profile.ts

❌ UserProfileContainer.tsx
❌ user_profile_service.ts
```

#### Clases y Componentes: PascalCase

```typescript
✅ export class UserProfileService
✅ export const UserProfileContainer
✅ export interface UserProfileData

❌ export class userProfileService
❌ export const userProfilecontainer
```

#### Variables y Funciones: camelCase

```typescript
✅ const userProfileService = UserProfileService.getInstance()
✅ function getUserProfile()
✅ const isLoading = true

❌ const UserProfileService = ...
❌ function GetUserProfile()
```

## Gestión de Estado

### 1. Cuándo Usar Zustand vs Redux

#### Usa Zustand Si

- ✅ Proyecto pequeño a mediano
- ✅ Estado simple
- ✅ Equipo pequeño
- ✅ Valoras simplicidad

```bash
avangcli module user-profile --store zustand -p
```

#### Usa Redux Si

- ✅ Proyecto grande/complejo
- ✅ Estado complejo con muchas interacciones
- ✅ Equipo grande
- ✅ Necesitas DevTools avanzadas
- ✅ Patrones establecidos (thunks, sagas)

```bash
avangcli module analytics --store redux -p
```

### 2. Configurar Default al Inicio

```bash
# Establece el estándar para todo el proyecto
avangcli module auth --store zustand -p

# Todos los demás módulos usarán Zustand
avangcli module products
avangcli module orders
```

### 3. Organización del Store

#### Por Módulo (Recomendado)

```
modules/user-profile/
└── store/
    └── user-profile.store.ts  # Estado del módulo
```

#### Store Global (Para Estado Compartido)

```
store/
├── auth.store.ts      # Autenticación global
├── theme.store.ts     # Tema de la app
└── config.store.ts    # Configuración global
```

## Servicios

### 1. Patrón Singleton

**SIEMPRE** usa el patrón singleton para servicios:

```typescript
// ✅ BIEN: Singleton
export class UserProfileService {
  private static instance: UserProfileService

  private constructor() {}

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService()
    }
    return UserProfileService.instance
  }
}

export const userProfileService = UserProfileService.getInstance()
```

```typescript
// ❌ MAL: Múltiples instancias
export class UserProfileService {
  constructor() {} // public constructor
}

export const userProfileService = new UserProfileService()
```

### 2. Separación de Responsabilidades

```typescript
// ✅ BIEN: Service maneja lógica de negocio
export class UserProfileService {
  async fetchProfile(userId: string) {
    const data = await apiClient.get(`/users/${userId}`)
    return this.transformData(data)
  }

  private transformData(data: any) {
    // Lógica de transformación
  }
}
```

```typescript
// ❌ MAL: Component maneja lógica de negocio
export function UserProfile() {
  const [user, setUser] = useState()

  useEffect(() => {
    fetch("/api/users/123")
      .then((r) => r.json())
      .then((data) => {
        // Transformación en el component
        setUser(data)
      })
  }, [])
}
```

## Componentes

### 1. Containers vs Components

#### Container (Smart Component)

```typescript
// ✅ Maneja lógica y estado
'use client'

export const UserProfileContainer = () => {
  const { data, loading } = useUserProfileStore()
  const service = userProfileService

  useEffect(() => {
    service.fetchData()
  }, [])

  if (loading) return <LoadingSpinner />

  return <UserProfileView data={data} />
}
```

#### Component (Presentational)

```typescript
// ✅ Solo renderiza UI
interface UserProfileViewProps {
  data: UserProfileData
}

export const UserProfileView = ({ data }: UserProfileViewProps) => {
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  )
}
```

### 2. Props vs Store

#### Usa Props Para

- ✅ Datos que vienen del padre
- ✅ Callbacks y eventos
- ✅ Configuración del componente

```typescript
<UserCard
  user={user}
  onEdit={handleEdit}
  size="large"
/>
```

#### Usa Store Para

- ✅ Estado compartido entre módulos
- ✅ Estado global de la app
- ✅ Datos que vienen del backend

```typescript
function UserCard() {
  const { currentUser } = useAuthStore()
  return <div>{currentUser.name}</div>
}
```

## TypeScript

### 1. Define Tipos en `types/`

```typescript
// ✅ BIEN: Tipos centralizados
// modules/user-profile/types/user-profile.types.ts
export interface UserProfileData {
  id: string
  name: string
  email: string
}

export interface UserProfileState {
  data: UserProfileData | null
  loading: boolean
  error: string | null
}
```

### 2. Usa Type Exports

```typescript
// modules/user-profile/index.ts
export type { UserProfileData, UserProfileState, UserProfileActions } from "./types/user-profile.types"
```

### 3. Evita `any`

```typescript
// ❌ MAL
function processData(data: any) {
  return data.name
}

// ✅ BIEN
interface Data {
  name: string
}

function processData(data: Data) {
  return data.name
}
```

## Imports y Exports

### 1. Barrel Exports

**SIEMPRE** usa `index.ts` para exports:

```typescript
// modules/user-profile/index.ts
export { UserProfileContainer } from "./containers/user-profile-container"
export { UserProfileService, userProfileService } from "./services/user-profile.service"
export { useUserProfileStore } from "./store/user-profile.store"
export type * from "./types/user-profile.types"
```

### 2. Import desde Barrel

```typescript
// ✅ BIEN
import { UserProfileContainer, userProfileService, type UserProfileData } from "@/modules/user-profile"

// ❌ MAL
import { UserProfileContainer } from "@/modules/user-profile/containers/user-profile-container"
import { userProfileService } from "@/modules/user-profile/services/user-profile.service"
```

### 3. Alias de Imports

Configura en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/modules/*": ["./modules/*"],
      "@/shared/*": ["./shared/*"]
    }
  }
}
```

## Manejo de Errores

### 1. Try-Catch en Services

```typescript
export class UserProfileService {
  async fetchProfile(id: string) {
    try {
      const response = await fetch(`/api/users/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw error // Re-throw para que el caller lo maneje
    }
  }
}
```

### 2. Error Boundaries en React

```typescript
// shared/components/ErrorBoundary.tsx
'use client'

export class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal.</h1>
    }

    return this.props.children
  }
}
```

## Testing

### 1. Estructura de Tests

```
modules/user-profile/
├── __tests__/
│   ├── user-profile.service.test.ts
│   ├── user-profile-container.test.tsx
│   └── user-profile.store.test.ts
├── components/
├── services/
└── store/
```

### 2. Test del Service

```typescript
// __tests__/user-profile.service.test.ts
import { userProfileService } from "../services/user-profile.service"

describe("UserProfileService", () => {
  it("should fetch profile data", async () => {
    const data = await userProfileService.fetchProfile("123")
    expect(data).toBeDefined()
    expect(data.id).toBe("123")
  })
})
```

## Git Workflow

### 1. Commits Convencionales

Si configuraste `--git-setup`:

```bash
# Usar Commitizen
npx cz

# Seleccionar tipo:
# feat: Nueva funcionalidad
# fix: Corrección de bug
# docs: Documentación
# refactor: Refactorización
# test: Tests
```

### 2. Estructura de Commits

```bash
# ✅ BIEN
git commit -m "feat(user-profile): add profile edit functionality"
git commit -m "fix(shopping-cart): resolve quantity update bug"

# ❌ MAL
git commit -m "changes"
git commit -m "fixed stuff"
```

### 3. Pre-commit Hooks

Los hooks se ejecutan automáticamente:

```bash
git commit
# → lint-staged ejecuta
# → eslint --fix
# → prettier --write
# → type-check
```

## Performance

### 1. Code Splitting por Módulo

```typescript
// app/profile/page.tsx
import dynamic from 'next/dynamic'

const UserProfileContainer = dynamic(
  () => import('@/modules/user-profile').then(mod => mod.UserProfileContainer),
  { loading: () => <LoadingSpinner /> }
)
```

### 2. Lazy Loading de Stores

```typescript
// Solo cargar el store cuando se necesite
const useUserProfileStore = lazy(() =>
  import("@/modules/user-profile").then((mod) => ({ default: mod.useUserProfileStore }))
)
```

## Documentación

### 1. JSDoc en Funciones Clave

```typescript
/**
 * Fetches user profile data from the API
 * @param userId - The ID of the user to fetch
 * @returns Promise with user profile data
 * @throws Error if the user is not found
 */
async fetchProfile(userId: string): Promise<UserProfileData> {
  // ...
}
```

### 2. README por Módulo (Opcional)

```markdown
# User Profile Module

## Descripción

Maneja todo lo relacionado con perfiles de usuario.

## Uso

\`\`\`typescript
import { UserProfileContainer } from '@/modules/user-profile'
\`\`\`

## API

- `fetchProfile(id)` - Obtiene perfil
- `updateProfile(data)` - Actualiza perfil
```

## Checklist de Mejores Prácticas

### Al Crear un Proyecto

- [ ] Usar `--git-setup` para configurar quality tools
- [ ] Establecer store manager default `-p`
- [ ] Configurar UI library desde el inicio
- [ ] Configurar Tailwind si es necesario

### Al Crear un Módulo

- [ ] Usar nombre descriptivo en kebab-case
- [ ] Elegir store manager consistente
- [ ] Implementar lógica en service, no en component
- [ ] Definir tipos en `types/`
- [ ] Usar barrel exports en `index.ts`

### Durante el Desarrollo

- [ ] Seguir Scope Rule
- [ ] Separar containers y components
- [ ] Usar TypeScript estricto
- [ ] Escribir tests para servicios
- [ ] Documentar funciones complejas

### Antes de Commit

- [ ] Ejecutar linter
- [ ] Verificar tipos
- [ ] Revisar imports no usados
- [ ] Usar commits convencionales

## Recursos Adicionales

- [Screaming Architecture](../04-arquitectura/screaming-architecture.md)
- [Comando module](../03-comandos/module.md)
- [Store Managers](../05-integraciones/store-managers.md)
- [Proyecto Completo](./proyecto-completo-paso-a-paso.md)
