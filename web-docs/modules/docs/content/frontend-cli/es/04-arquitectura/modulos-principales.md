# Módulos Principales

## Introducción

Los módulos son la unidad fundamental de organización en la arquitectura de AvangCLI. Cada módulo representa una característica o dominio específico de tu aplicación. Esta guía explica en detalle cómo funcionan los módulos y cómo aprovecharlos al máximo.

## Anatomía de un Módulo

### Estructura Completa

```
modules/user-profile/
├── components/              # Componentes UI del módulo
│   ├── avatar.tsx
│   ├── profile-card.tsx
│   └── edit-form.tsx
├── containers/              # Componentes contenedores
│   └── user-profile-container.tsx
├── services/                # Lógica de negocio
│   └── user-profile.service.ts
├── types/                   # Definiciones TypeScript
│   └── user-profile.types.ts
├── hooks/                   # Custom React hooks
│   └── use-user-profile.ts
├── store/                   # Gestión de estado
│   └── user-profile.store.ts    (Zustand)
│   └── user-profile.slice.ts    (Redux)
├── adapters/                # Adaptadores de API
│   └── user-api.adapter.ts
├── helpers/                 # Funciones auxiliares
│   └── format-username.ts
├── lib/                     # Utilidades del módulo
│   └── validators.ts
└── index.ts                 # Barrel export
```

## Responsabilidades por Carpeta

### 1. `components/`

**Propósito:** Componentes UI reutilizables específicos del módulo.

**Características:**

- Componentes presentacionales puros
- Reciben datos vía props
- Sin lógica de negocio
- Reutilizables dentro del módulo

**Ejemplo:**

```typescript
// components/profile-card.tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import type { UserProfile } from '../types/user-profile.types'

interface ProfileCardProps {
  profile: UserProfile
  onEdit?: () => void
}

export const ProfileCard = ({ profile, onEdit }: ProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <h2>{profile.name}</h2>
      </CardHeader>
      <CardContent>
        <p>{profile.email}</p>
        <p>{profile.bio}</p>
        {onEdit && <button onClick={onEdit}>Edit</button>}
      </CardContent>
    </Card>
  )
}
```

**Cuándo crear un componente:**

- ✅ Se usa 2+ veces dentro del módulo
- ✅ Tiene lógica UI reutilizable
- ✅ Puede ser testeado de forma aislada

**Cuándo NO:**

- ❌ Se usa solo una vez
- ❌ Es muy específico de un container
- ❌ No tiene lógica reutilizable

### 2. `containers/`

**Propósito:** Componentes que orquestan lógica y UI.

**Características:**

- Maneja estado local y global
- Contiene lógica de presentación
- Coordina servicios y stores
- Entry point del módulo

**Ejemplo:**

```typescript
// containers/user-profile-container.tsx
'use client'

import { useEffect, useState } from 'react'
import { useUserProfileStore } from '../store/user-profile.store'
import { ProfileCard } from '../components/profile-card'
import { EditForm } from '../components/edit-form'

export const UserProfileContainer = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { profile, isLoading, fetchProfile, updateProfile } = useUserProfileStore()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSave = async (data: Partial<UserProfile>) => {
    await updateProfile(data)
    setIsEditing(false)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {isEditing ? (
        <EditForm profile={profile} onSave={handleSave} />
      ) : (
        <ProfileCard profile={profile} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  )
}
```

**Responsabilidades:**

- ✅ Manejo de efectos (useEffect)
- ✅ Coordinación de componentes
- ✅ Interacción con stores
- ✅ Manejo de loading/error states

### 3. `services/`

**Propósito:** Implementar lógica de negocio.

**Características:**

- Singleton pattern
- Métodos reutilizables
- Independiente de React
- Fácil de testear

**Ejemplo:**

```typescript
// services/user-profile.service.ts
import type { UserProfile } from "../types/user-profile.types"
import { UserApiAdapter } from "../adapters/user-api.adapter"

export class UserProfileService {
  private static instance: UserProfileService
  private apiAdapter: UserApiAdapter

  private constructor() {
    this.apiAdapter = new UserApiAdapter(process.env.NEXT_PUBLIC_API_URL!)
  }

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService()
    }
    return UserProfileService.instance
  }

  public async fetchProfile(userId: string): Promise<UserProfile> {
    try {
      const rawData = await this.apiAdapter.fetchUser(userId)
      return this.transformUserData(rawData)
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw new Error("Failed to fetch user profile")
    }
  }

  public async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    this.validateProfileData(data)
    const rawData = await this.apiAdapter.updateUser(userId, data)
    return this.transformUserData(rawData)
  }

  private transformUserData(raw: any): UserProfile {
    return {
      id: raw.id,
      name: raw.full_name,
      email: raw.email_address,
      bio: raw.biography || "",
      avatar: raw.profile_picture
    }
  }

  private validateProfileData(data: Partial<UserProfile>): void {
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error("Invalid email format")
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}

export const userProfileService = UserProfileService.getInstance()
```

**Mejores prácticas:**

- ✅ Usar singleton pattern
- ✅ Exportar instancia por defecto
- ✅ Manejar errores apropiadamente
- ✅ Transformar datos de API
- ✅ Validar inputs

### 4. `types/`

**Propósito:** Definir contratos y estructuras de datos.

**Características:**

- Interfaces y types
- Enums y constantes tipadas
- Sin lógica de implementación

**Ejemplo:**

```typescript
// types/user-profile.types.ts

// Entidades principales
export interface UserProfile {
  id: string
  name: string
  email: string
  bio: string
  avatar?: string
  role: UserRole
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark"
  language: "es" | "en"
  notifications: boolean
}

// Enums
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest"
}

// Estado del módulo
export interface UserProfileState {
  data: UserProfile | null
  isLoading: boolean
  error: string | null
}

// Acciones
export interface UserProfileActions {
  fetchProfile: (userId: string) => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  reset: () => void
}

// DTOs (Data Transfer Objects)
export interface UpdateProfileDTO {
  name?: string
  bio?: string
  preferences?: Partial<UserPreferences>
}

// Status types
export type UserProfileStatus = "idle" | "loading" | "success" | "error"

// Form types
export interface ProfileFormData {
  name: string
  email: string
  bio: string
}
```

**Organización:**

- ✅ Interfaces de dominio arriba
- ✅ Estado y acciones después
- ✅ DTOs y tipos auxiliares al final
- ✅ Exports explícitos

### 5. `store/`

**Propósito:** Gestionar estado del módulo.

#### Zustand Store

```typescript
// store/user-profile.store.ts
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { UserProfile, UserProfileState } from "../types/user-profile.types"
import { userProfileService } from "../services/user-profile.service"

interface UserProfileStore extends UserProfileState {
  // Actions
  setData: (data: UserProfile | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  fetchProfile: (userId: string) => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  reset: () => void
}

const initialState: UserProfileState = {
  data: null,
  isLoading: false,
  error: null
}

export const useUserProfileStore = create<UserProfileStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setData: (data) => set({ data, error: null }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error, isLoading: false }),

        fetchProfile: async (userId) => {
          set({ isLoading: true, error: null })
          try {
            const data = await userProfileService.fetchProfile(userId)
            set({ data, isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Unknown error",
              isLoading: false
            })
          }
        },

        updateProfile: async (profileData) => {
          const currentProfile = get().data
          if (!currentProfile) return

          set({ isLoading: true, error: null })
          try {
            const updated = await userProfileService.updateProfile(currentProfile.id, profileData)
            set({ data: updated, isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Update failed",
              isLoading: false
            })
          }
        },

        reset: () => set(initialState)
      }),
      {
        name: "user-profile-storage",
        partialize: (state) => ({ data: state.data }) // Solo persistir data
      }
    ),
    { name: "UserProfileStore" }
  )
)

// Selectors
export const selectProfile = (state: UserProfileStore) => state.data
export const selectIsLoading = (state: UserProfileStore) => state.isLoading
export const selectError = (state: UserProfileStore) => state.error
```

#### Redux Slice

```typescript
// store/user-profile.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import type { UserProfile, UserProfileState } from "../types/user-profile.types"
import { userProfileService } from "../services/user-profile.service"

const initialState: UserProfileState = {
  data: null,
  isLoading: false,
  error: null
}

// Async thunks
export const fetchProfile = createAsyncThunk("userProfile/fetchProfile", async (userId: string) => {
  return await userProfileService.fetchProfile(userId)
})

export const updateProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async ({ userId, data }: { userId: string; data: Partial<UserProfile> }) => {
    return await userProfileService.updateProfile(userId, data)
  }
)

// Slice
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    reset: (state) => {
      Object.assign(state, initialState)
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload
        state.isLoading = false
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch profile"
        state.isLoading = false
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload
        state.isLoading = false
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update profile"
        state.isLoading = false
      })
  }
})

export const userProfileActions = userProfileSlice.actions
export const userProfileReducer = userProfileSlice.reducer

// Selectors
export const selectUserProfile = (state: { userProfile: UserProfileState }) => state.userProfile.data
export const selectUserProfileLoading = (state: { userProfile: UserProfileState }) => state.userProfile.isLoading
export const selectUserProfileError = (state: { userProfile: UserProfileState }) => state.userProfile.error
```

### 6. `adapters/`

**Propósito:** Aislar dependencias externas.

```typescript
// adapters/user-api.adapter.ts
import type { UserProfile } from "../types/user-profile.types"

export class UserApiAdapter {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async fetchUser(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      headers: this.getHeaders()
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async updateUser(id: string, data: Partial<UserProfile>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  private getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.getToken()}`
    }
  }

  private getToken(): string {
    // Obtener token de auth store o localStorage
    return localStorage.getItem("auth_token") || ""
  }
}
```

**Ventajas:**

- ✅ Fácil cambiar de REST a GraphQL
- ✅ Mockeable para tests
- ✅ Centraliza configuración HTTP
- ✅ Manejo consistente de errores

### 7. `hooks/`

**Propósito:** Custom hooks específicos del módulo.

```typescript
// hooks/use-user-profile.ts
import { useEffect } from "react"
import { useUserProfileStore } from "../store/user-profile.store"

export function useUserProfile(userId: string) {
  const { data: profile, isLoading, error, fetchProfile } = useUserProfileStore()

  useEffect(() => {
    if (userId) {
      fetchProfile(userId)
    }
  }, [userId, fetchProfile])

  return {
    profile,
    isLoading,
    error,
    refetch: () => fetchProfile(userId)
  }
}

// hooks/use-profile-form.ts
import { useState } from "react"
import type { ProfileFormData } from "../types/user-profile.types"

export function useProfileForm(initialData: ProfileFormData) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return {
    formData,
    errors,
    handleChange,
    validate,
    reset: () => setFormData(initialData)
  }
}
```

### 8. `helpers/`

**Propósito:** Funciones auxiliares puras.

```typescript
// helpers/format-username.ts
export function formatUsername(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2)
}

export function truncateBio(bio: string, maxLength: number = 100): string {
  if (bio.length <= maxLength) return bio
  return bio.slice(0, maxLength).trim() + "..."
}
```

### 9. `lib/`

**Propósito:** Utilidades específicas del módulo.

```typescript
// lib/validators.ts
export const validators = {
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },

  isValidUsername: (username: string): boolean => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username)
  },

  isStrongPassword: (password: string): boolean => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
  }
}

// lib/constants.ts
export const USER_PROFILE_CONSTANTS = {
  MAX_BIO_LENGTH: 500,
  MAX_NAME_LENGTH: 100,
  AVATAR_SIZE: {
    SMALL: 40,
    MEDIUM: 80,
    LARGE: 120
  }
} as const
```

### 10. `index.ts` (Barrel Export)

**Propósito:** API pública del módulo.

```typescript
// index.ts

/**
 * User Profile Module
 *
 * Provides user profile management functionality including
 * viewing, editing, and persisting user profile data.
 */

// Containers
export { UserProfileContainer } from "./containers/user-profile-container"

// Components
export { ProfileCard } from "./components/profile-card"
export { EditForm } from "./components/edit-form"

// Services
export { UserProfileService, userProfileService } from "./services/user-profile.service"

// Store
export { useUserProfileStore, selectProfile, selectIsLoading, selectError } from "./store/user-profile.store"

// Hooks
export { useUserProfile } from "./hooks/use-user-profile"
export { useProfileForm } from "./hooks/use-profile-form"

// Types
export type {
  UserProfile,
  UserProfileState,
  UserProfileActions,
  UserPreferences,
  ProfileFormData,
  UpdateProfileDTO
} from "./types/user-profile.types"

export { UserRole } from "./types/user-profile.types"

// Helpers
export { formatUsername, getInitials, truncateBio } from "./helpers/format-username"

// Constants
export { USER_PROFILE_CONSTANTS } from "./lib/constants"
```

**Mejores prácticas:**

- ✅ Agrupar por tipo (containers, components, etc.)
- ✅ Comentar secciones
- ✅ Exportar solo lo necesario
- ✅ Type exports separados

## Comunicación entre Módulos

### ✅ BIEN: A través de Props e Interfaces

```typescript
// modules/products/containers/product-list.tsx
import { useShoppingCartStore } from '@/modules/shopping-cart'

export const ProductList = () => {
  const { addItem } = useShoppingCartStore()

  return (
    <ProductCard onAddToCart={(product) => addItem(product)} />
  )
}
```

### ❌ MAL: Dependencias directas

```typescript
// ❌ No importar servicios de otros módulos directamente
import { userService } from "@/modules/user/services/user.service"
```

### Patrón de Eventos

```typescript
// shared/events/event-bus.ts
export const eventBus = {
  emit: (event: string, data: any) => {
    window.dispatchEvent(new CustomEvent(event, { detail: data }))
  },
  on: (event: string, handler: (data: any) => void) => {
    window.addEventListener(event, (e: any) => handler(e.detail))
  }
}

// modules/products/
eventBus.emit("product:added", { productId: "123" })

// modules/shopping-cart/
eventBus.on("product:added", (data) => {
  console.log("Product added:", data.productId)
})
```

## Conclusión

Los módulos son la columna vertebral de la arquitectura de AvangCLI. Cada carpeta tiene un propósito específico que promueve:

1. ✅ **Cohesión alta** - Todo lo relacionado está junto
2. ✅ **Acoplamiento bajo** - Módulos independientes
3. ✅ **Mantenibilidad** - Fácil de modificar
4. ✅ **Escalabilidad** - Crece sin caos
5. ✅ **Testabilidad** - Cada parte es testeable

## Recursos Adicionales

- [Screaming Architecture](./screaming-architecture.md)
- [Visión General](./vision-general.md)
- [Mejores Prácticas](../08-guias/mejores-practicas.md)
