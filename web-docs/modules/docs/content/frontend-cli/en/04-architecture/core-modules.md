# Core Modules

## Introduction

Modules are the fundamental unit of organization in AvangCLI's architecture. Each module represents a specific feature or domain of your application. This guide explains in detail how modules work and how to leverage them to the fullest.

## Module Anatomy

### Complete Structure

```
modules/user-profile/
├── components/              # Module UI components
│   ├── avatar.tsx
│   ├── profile-card.tsx
│   └── edit-form.tsx
├── containers/              # Container components
│   └── user-profile-container.tsx
├── services/                # Business logic
│   └── user-profile.service.ts
├── types/                   # TypeScript definitions
│   └── user-profile.types.ts
├── hooks/                   # Custom React hooks
│   └── use-user-profile.ts
├── store/                   # State management
│   └── user-profile.store.ts    (Zustand)
│   └── user-profile.slice.ts    (Redux)
├── adapters/                # API adapters
│   └── user-api.adapter.ts
├── helpers/                 # Helper functions
│   └── format-username.ts
├── lib/                     # Module utilities
│   └── validators.ts
└── index.ts                 # Barrel export
```

## Folder Responsibilities

### 1. `components/`

**Purpose:** Reusable UI components specific to the module.

**Characteristics:**

- Pure presentational components
- Receive data via props
- No business logic
- Reusable within the module

**Example:**

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

**When to create a component:**

- ✅ Used 2+ times within the module
- ✅ Has reusable UI logic
- ✅ Can be tested in isolation

**When NOT to:**

- ❌ Used only once
- ❌ Very specific to a container
- ❌ No reusable logic

### 2. `containers/`

**Purpose:** Components that orchestrate logic and UI.

**Characteristics:**

- Handles local and global state
- Contains presentation logic
- Coordinates services and stores
- Module entry point

**Example:**

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

**Responsibilities:**

- ✅ Effect handling (useEffect)
- ✅ Component coordination
- ✅ Store interaction
- ✅ Loading/error state handling

### 3. `services/`

**Purpose:** Implement business logic.

**Characteristics:**

- Singleton pattern
- Reusable methods
- React-independent
- Easy to test

**Example:**

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

**Best practices:**

- ✅ Use singleton pattern
- ✅ Export default instance
- ✅ Handle errors appropriately
- ✅ Transform API data
- ✅ Validate inputs

### 4. `types/`

**Purpose:** Define contracts and data structures.

**Characteristics:**

- Interfaces and types
- Enums and typed constants
- No implementation logic

**Example:**

```typescript
// types/user-profile.types.ts

// Main entities
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

// Module state
export interface UserProfileState {
  data: UserProfile | null
  isLoading: boolean
  error: string | null
}

// Actions
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

**Organization:**

- ✅ Domain interfaces at top
- ✅ State and actions after
- ✅ DTOs and helper types at bottom
- ✅ Explicit exports

### 5. `store/`

**Purpose:** Manage module state.

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
        partialize: (state) => ({ data: state.data }) // Only persist data
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

**Purpose:** Isolate external dependencies.

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
    // Get token from auth store or localStorage
    return localStorage.getItem("auth_token") || ""
  }
}
```

**Advantages:**

- ✅ Easy to switch from REST to GraphQL
- ✅ Mockable for tests
- ✅ Centralizes HTTP configuration
- ✅ Consistent error handling

### 7. `hooks/`

**Purpose:** Module-specific custom hooks.

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

**Purpose:** Pure helper functions.

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

**Purpose:** Module-specific utilities.

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

**Purpose:** Public API of the module.

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

**Best practices:**

- ✅ Group by type (containers, components, etc.)
- ✅ Comment sections
- ✅ Export only what's necessary
- ✅ Separate type exports

## Inter-Module Communication

### ✅ GOOD: Through Props and Interfaces

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

### ❌ BAD: Direct Dependencies

```typescript
// ❌ Don't import services from other modules directly
import { userService } from "@/modules/user/services/user.service"
```

### Event Pattern

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

## Conclusion

Modules are the backbone of AvangCLI's architecture. Each folder has a specific purpose that promotes:

1. ✅ **High cohesion** - Everything related is together
2. ✅ **Low coupling** - Independent modules
3. ✅ **Maintainability** - Easy to modify
4. ✅ **Scalability** - Grows without chaos
5. ✅ **Testability** - Each part is testable

## Additional Resources

- [Screaming Architecture](./screaming-architecture.md)
- [Architecture Overview](./overview.md)
- [Best Practices](../08-guides/best-practices.md)
