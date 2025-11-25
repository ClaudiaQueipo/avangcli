# Screaming Architecture

## ¿Qué es Screaming Architecture?

**Screaming Architecture** es un principio de diseño de software acuñado por Robert C. Martin (Uncle Bob) que establece que:

> "La arquitectura de un sistema debe gritar sobre los casos de uso del sistema, no sobre los frameworks que usa."

En otras palabras: **Al mirar la estructura de carpetas de tu proyecto, deberías entender inmediatamente QUÉ HACE tu aplicación, no CON QUÉ está construida.**

## Ejemplo Visual

### ❌ Arquitectura Tradicional (Framework-centric)

```
app/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── UserForm.tsx
│   ├── ProductList.tsx
│   └── ShoppingCart.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── useCart.ts
└── services/
    ├── authService.ts
    ├── productService.ts
    └── cartService.ts
```

**Problema:** No se puede saber qué hace la aplicación sin abrir archivos.

### ✅ Screaming Architecture (Feature-centric)

```
app/
├── modules/
│   ├── authentication/      ← "¡Tengo autenticación!"
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   ├── products/            ← "¡Manejo productos!"
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   └── shopping-cart/       ← "¡Tengo carrito de compras!"
│       ├── components/
│       ├── services/
│       └── hooks/
```

**Beneficio:** La estructura "grita" que es una aplicación de e-commerce.

## Implementación en AvangCLI

### Estructura de un Módulo Generado

Cuando ejecutas:

```bash
avangcli module user-profile --store zustand
```

Se crea esta estructura:

```
modules/
└── user-profile/
    ├── components/          # Componentes UI reutilizables del módulo
    ├── containers/          # Componentes contenedores (lógica + UI)
    │   └── user-profile-container.tsx
    ├── services/            # Lógica de negocio
    │   └── user-profile.service.ts
    ├── types/               # Definiciones TypeScript
    │   └── user-profile.types.ts
    ├── hooks/               # Custom React hooks
    ├── store/               # Estado del módulo
    │   └── user-profile.store.ts
    ├── adapters/            # Adaptadores para APIs externas
    ├── helpers/             # Funciones auxiliares
    ├── lib/                 # Utilidades específicas del módulo
    └── index.ts             # Barrel export
```

## Principios de Diseño

### 1. **Organización por Características, no por Tipo**

#### ❌ MAL: Por tipo de archivo

```
components/
  UserCard.tsx
  UserList.tsx
  ProductCard.tsx
  ProductList.tsx
services/
  userService.ts
  productService.ts
```

#### ✅ BIEN: Por característica

```
modules/
  user/
    components/
      UserCard.tsx
      UserList.tsx
    services/
      user.service.ts
  product/
    components/
      ProductCard.tsx
      ProductList.tsx
    services/
      product.service.ts
```

**Razón:** Cuando trabajas en "users", todos los archivos relacionados están juntos.

### 2. **Cohesión Alta, Acoplamiento Bajo**

**Cohesión Alta:**

- Todo lo relacionado con "user-profile" está en `modules/user-profile/`
- Fácil de encontrar y modificar

**Acoplamiento Bajo:**

- Cada módulo es independiente
- Se comunican a través de interfaces bien definidas
- Fácil de testear en aislamiento

### 3. **Scope Rule (Regla de Alcance)**

**Principio:** El código debe vivir lo más cerca posible de donde se usa.

```
modules/
  user-profile/
    components/
      Avatar.tsx              ← Solo usado en user-profile
    services/
      user-profile.service.ts ← Solo para este módulo
```

Si un componente se usa en **2+ módulos**, entonces debe moverse a `shared/`:

```
shared/
  components/
    Button.tsx               ← Usado en múltiples módulos
```

### 4. **Jerarquía Clara**

```
modules/
  user-profile/
    containers/              ← Nivel más alto: Orquesta todo
      user-profile-container.tsx
    components/              ← Nivel medio: UI components
      ProfileHeader.tsx
    services/                ← Nivel bajo: Lógica de negocio
      user-profile.service.ts
    types/                   ← Fundación: Contratos
      user-profile.types.ts
```

## Ventajas de esta Arquitectura

### 1. **Navegación Intuitiva**

**Escenario:** Necesitas modificar el perfil de usuario.

```bash
# Sabes exactamente dónde ir:
modules/user-profile/
```

No necesitas buscar en:

- `components/` → ¿Cuál componente?
- `services/` → ¿Cuál servicio?
- `types/` → ¿Cuáles tipos?

### 2. **Escalabilidad Natural**

**Nuevo feature = Nuevo módulo**

```bash
# Agregar reviews de productos
avangcli module product-reviews --store zustand

# Agregar wishlist
avangcli module wishlist --store zustand
```

La estructura crece sin volverse caótica.

### 3. **Trabajo en Equipo Eficiente**

**Sin Screaming Architecture:**

- Developer A trabaja en `components/UserForm.tsx`
- Developer B trabaja en `components/ProductForm.tsx`
- **Conflicto de merge** en la misma carpeta

**Con Screaming Architecture:**

- Developer A trabaja en `modules/user/`
- Developer B trabaja en `modules/product/`
- **Sin conflictos** - diferentes módulos

### 4. **Onboarding Rápido**

**Nuevo desarrollador:**

```
"¿Qué hace esta app?"
→ Mira `modules/`
→ "Ah, maneja users, products, shopping-cart y orders"
```

**vs.**

```
"¿Qué hace esta app?"
→ Mira `components/`, `hooks/`, `services/`
→ "Eh... no sé, déjame revisar cada archivo"
```

### 5. **Testing Simplificado**

Cada módulo es una unidad testeable:

```typescript
// user-profile.test.ts
import { userProfileService } from "@/modules/user-profile"

describe("UserProfile Module", () => {
  // Test todo el módulo de forma aislada
})
```

### 6. **Eliminación de Código Fácil**

**Feature deprecada:**

```bash
# Simplemente elimina el módulo completo
rm -rf modules/deprecated-feature
```

Sin preocuparte por:

- ¿Qué componentes eran de este feature?
- ¿Qué hooks usaba?
- ¿Qué servicios?

Todo está en un solo lugar.

## Razones de Cada Carpeta

### `containers/`

**Por qué:** Separar **lógica** de **presentación**.

**Contenedor:** Maneja estado, side effects, lógica de negocio.
**Componente:** Solo renderiza UI.

```typescript
// Container
export const UserProfileContainer = () => {
  const [user, setUser] = useState()
  const loadUser = async () => { /* lógica */ }

  return <UserProfileView user={user} />
}

// Component (presentational)
export const UserProfileView = ({ user }) => {
  return <div>{user.name}</div>
}
```

### `services/`

**Por qué:** Centralizar **lógica de negocio**.

- Singleton pattern para instancia única
- Métodos reutilizables
- Fácil de mockear en tests

```typescript
export class UserProfileService {
  private static instance: UserProfileService

  async fetchProfile() {
    /* ... */
  }
  async updateProfile() {
    /* ... */
  }
}
```

### `types/`

**Por qué:** **Contratos claros** entre capas.

```typescript
export interface UserProfile {
  id: string
  name: string
  email: string
}
```

### `store/`

**Por qué:** **Estado aislado** por módulo.

```typescript
// Zustand store
export const useUserProfileStore = create((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile })
}))
```

### `adapters/`

**Por qué:** **Aislar dependencias externas**.

```typescript
// Si cambias de REST a GraphQL, solo modificas el adapter
export class UserApiAdapter {
  async fetchUser(id: string) {
    // REST implementation
    return fetch(`/api/users/${id}`)
  }
}
```

### `hooks/`

**Por qué:** **Lógica reutilizable** específica del módulo.

```typescript
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState()

  useEffect(() => {
    // Lógica de carga
  }, [userId])

  return { profile }
}
```

## Cuándo Romper las Reglas

### Módulos Compartidos

Si algo se usa en **2+ módulos**:

```
shared/
  components/
    Button.tsx        ← Usado en todos lados
    Modal.tsx
  hooks/
    useAuth.ts        ← Autenticación global
  types/
    common.types.ts   ← Tipos compartidos
```

### Configuración Global

```
config/
  api.config.ts
  theme.config.ts
```

### Utilidades Generales

```
utils/
  formatDate.ts
  validators.ts
```

## Notas finales

**Screaming Architecture no es solo organización de carpetas.**

Es una **filosofía de diseño** que:

1. ✅ Comunica el propósito del sistema
2. ✅ Facilita el mantenimiento
3. ✅ Acelera el desarrollo
4. ✅ Mejora la colaboración
5. ✅ Reduce la complejidad

**AvangCLI implementa estos principios automáticamente**, para que puedas enfocarte en resolver problemas de negocio, no en decidir dónde poner cada archivo.

## Recursos Adicionales

- [Arquitectura del CLI](./vision-general.md)
- [Módulos principales](./modulos-principales.md)
- [Proyecto completo](../08-guias/proyecto-completo-paso-a-paso.md)
