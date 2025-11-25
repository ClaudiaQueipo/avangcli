# Command: module

## Description

The `module` command generates a complete module in an existing Next.js project, following the **Screaming Architecture** pattern. It automatically creates the entire folder structure, boilerplate files, services, types, hooks, and optionally store configuration (Zustand or Redux).

## Syntax

```bash
avangcli module <module-name> [options]
```

## Prerequisites

- Be in a valid Next.js project
- Project must have `package.json`
- (Optional) Tailwind CSS installed if using store managers with UI

## Interactive Mode

If you don't specify all options, the CLI will ask you:

```bash
avangcli module user-profile
```

The CLI will ask:

1. Which store manager do you want to use? (zustand, redux, none)

## Options

### `<module-name>`

- **Type:** Positional (required)
- **Format:** kebab-case (e.g., `user-profile`, `shopping-cart`)
- **Description:** Name of the module to create
- **Example:** `avangcli module user-profile`

### `--store, --st`

- **Type:** String
- **Options:** `zustand`, `redux`, `none`
- **Description:** State manager to use
- **Example:** `--store zustand`

### `--set-default-global, -g`

- **Type:** Boolean
- **Description:** Sets the chosen store manager as the global default
- **Example:** `-g`

### `--set-default-project, -p`

- **Type:** Boolean
- **Description:** Sets the store manager as default for the current project
- **Example:** `-p`

### `--skip-validation, -s`

- **Type:** Boolean
- **Description:** Skips Next.js project validation (use with caution)
- **Example:** `--skip-validation`

## Usage Examples

### Example 1: Basic Module (Interactive Mode)

```bash
avangcli module user-profile
```

The CLI will ask which store manager to use.

### Example 2: Module with Zustand

```bash
avangcli module shopping-cart --store zustand
```

Creates the module with Zustand store configured.

### Example 3: Module with Redux and Global Default

```bash
avangcli module authentication --store redux -g
```

Creates module with Redux and sets it as global default for future modules.

### Example 4: Module with Project Default

```bash
avangcli module products --store zustand -p
```

Uses Zustand and saves it as default for this project.

### Example 5: Without Store Manager

```bash
avangcli module blog-posts --store none
```

Creates the module without state configuration.

### Example 6: Multiple Modules with Saved Config

```bash
# First module: set Zustand as default
avangcli module user --store zustand -p

# Following modules use Zustand automatically
avangcli module products
avangcli module orders
avangcli module reviews
```

## Generated Module Structure

### Complete Structure

```
app/modules/user-profile/
├── components/          # Reusable UI components
├── containers/          # Container components
│   └── user-profile-container.tsx
├── services/            # Business logic
│   └── user-profile.service.ts
├── types/               # TypeScript definitions
│   └── user-profile.types.ts
├── hooks/               # Custom React hooks
├── store/               # Module state
│   ├── user-profile.store.ts  (Zustand)
│   └── user-profile.slice.ts  (Redux)
├── adapters/            # Adapters for external APIs
├── helpers/             # Utility functions
├── lib/                 # Specific utilities
└── index.ts             # Barrel export
```

### If `src/` directory exists

The CLI automatically detects if the project uses `src/`:

```
src/modules/user-profile/
└── ... (same structure)
```

## Generated Files

### 1. Container (`user-profile-container.tsx`)

```typescript
'use client'

import React from 'react'

interface UserProfileContainerProps {
  // Add your props here
}

/**
 * UserProfileContainer
 *
 * Main container component for the user-profile module.
 * Handles the main logic and state management for this feature.
 */
export const UserProfileContainer: React.FC<UserProfileContainerProps> = (props) => {
  // Add your logic here

  return (
    <div className="user-profile-container">
      <h1>UserProfile Module</h1>
      <p>This is the main container for the user-profile module.</p>
    </div>
  )
}

UserProfileContainer.displayName = 'UserProfileContainer'
```

### 2. Service (`user-profile.service.ts`)

```typescript
/**
 * UserProfileService
 *
 * Service class for handling user-profile module business logic.
 * Implements the singleton pattern for consistent state management.
 */
export class UserProfileService {
  private static instance: UserProfileService

  private constructor() {
    this.initialize()
  }

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService()
    }
    return UserProfileService.instance
  }

  private initialize(): void {
    // Add initialization logic here
  }

  public async fetchData(): Promise<any> {
    try {
      return { message: "UserProfile data" }
    } catch (error) {
      console.error("Error fetching user-profile data:", error)
      throw error
    }
  }

  public processData(data: any): any {
    return data
  }
}

export const userProfileService = UserProfileService.getInstance()
```

### 3. Types (`user-profile.types.ts`)

```typescript
export interface UserProfileData {
  id: string
  // Add your data properties here
}

export interface UserProfileState {
  isLoading: boolean
  error: string | null
  data: UserProfileData | null
}

export interface UserProfileActions {
  fetch: () => Promise<void>
  reset: () => void
}

export type UserProfileStatus = "idle" | "loading" | "success" | "error"
```

### 4. Zustand Store (`user-profile.store.ts`)

```typescript
import { create } from "zustand"
import type { UserProfileData, UserProfileState } from "../types/user-profile.types"

interface UserProfileStore extends UserProfileState {
  setData: (data: UserProfileData | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: UserProfileState = {
  isLoading: false,
  error: null,
  data: null
}

export const useUserProfileStore = create<UserProfileStore>((set) => ({
  ...initialState,
  setData: (data) => set({ data, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set(initialState)
}))
```

### 5. Redux Slice (`user-profile.slice.ts`)

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { UserProfileData, UserProfileState } from "../types/user-profile.types"

const initialState: UserProfileState = {
  isLoading: false,
  error: null,
  data: null
}

const userProfileSlice = createSlice({
  name: "user-profile",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<UserProfileData | null>) => {
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

export const userProfileActions = userProfileSlice.actions
export const userProfileReducer = userProfileSlice.reducer

// Selectors
export const selectUserProfileData = (state: { userProfile: UserProfileState }) => state.userProfile.data
export const selectUserProfileLoading = (state: { userProfile: UserProfileState }) => state.userProfile.isLoading
export const selectUserProfileError = (state: { userProfile: UserProfileState }) => state.userProfile.error
```

### 6. Barrel Export (`index.ts`)

```typescript
/**
 * UserProfile Module
 *
 * Barrel export file for the user-profile module.
 */

// Containers
export { UserProfileContainer } from "./containers/user-profile-container"

// Services
export { UserProfileService, userProfileService } from "./services/user-profile.service"

// Types
export type {
  UserProfileData,
  UserProfileState,
  UserProfileActions,
  UserProfileStatus
} from "./types/user-profile.types"

// Zustand Store (if used)
export { useUserProfileStore } from "./store/user-profile.store"

// Redux Store (if used)
export { userProfileActions, userProfileReducer } from "./store/user-profile.slice"
export { selectUserProfileData, selectUserProfileLoading, selectUserProfileError } from "./store/user-profile.slice"
```

## What Does the Command Do?

### 1. Validates Next.js Project

```bash
# Verifies:
- ✅ package.json exists
- ✅ next.config.js exists
- ✅ app/ or pages/ exists
- ✅ Detects Next.js version
- ✅ Detects if using src/
```

### 2. Checks that Module Doesn't Exist

```bash
# Prevents overwriting existing modules
❌ Error: Module "user-profile" already exists
```

### 3. Creates Folder Structure

```bash
# Creates 9 folders:
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

### 4. Generates Boilerplate Files

```bash
✓ containers/user-profile-container.tsx
✓ services/user-profile.service.ts
✓ types/user-profile.types.ts
✓ store/user-profile.store.ts (if Zustand)
✓ store/user-profile.slice.ts (if Redux)
✓ index.ts
```

### 5. Installs Dependencies (if necessary)

```bash
# If using Zustand and it's not installed
📦 Installing zustand...

# If using Redux and it's not installed
📦 Installing @reduxjs/toolkit...
```

## Naming Conventions

### Input (kebab-case)

```bash
avangcli module user-profile
avangcli module shopping-cart
avangcli module product-reviews
```

### Generated Files

```
user-profile-container.tsx    # kebab-case
user-profile.service.ts        # kebab-case
user-profile.types.ts          # kebab-case
user-profile.store.ts          # kebab-case
```

### Classes and Components (PascalCase)

```typescript
UserProfileContainer
UserProfileService
UserProfileData
```

### Instances and Hooks (camelCase)

```typescript
userProfileService
useUserProfileStore
```

## Using the Generated Module

### In a Page

```typescript
// app/profile/page.tsx
import { UserProfileContainer } from '@/modules/user-profile'

export default function ProfilePage() {
  return <UserProfileContainer />
}
```

### Using the Service

```typescript
import { userProfileService } from "@/modules/user-profile"

async function loadProfile() {
  const data = await userProfileService.fetchData()
  console.log(data)
}
```

### Using Zustand Store

```typescript
'use client'

import { useUserProfileStore } from '@/modules/user-profile'

export function ProfileComponent() {
  const { data, setData, setLoading } = useUserProfileStore()

  return <div>{data?.name}</div>
}
```

### Using Redux Store

```typescript
// 1. Add to store
import { userProfileReducer } from '@/modules/user-profile'

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
  },
})

// 2. Use in components
import { useSelector, useDispatch } from 'react-redux'
import { userProfileActions, selectUserProfileData } from '@/modules/user-profile'

export function ProfileComponent() {
  const data = useSelector(selectUserProfileData)
  const dispatch = useDispatch()

  const handleLoad = () => {
    dispatch(userProfileActions.setLoading(true))
  }

  return <div>{data?.name}</div>
}
```

## Default Configuration

### Global Default

```bash
# Saved in ~/.avangcli/config.json
avangcli module auth --store zustand -g

# All future modules will use Zustand
avangcli module products  # Uses Zustand automatically
```

### Project Default

```bash
# Saved in .avangcli.json at project root
avangcli module auth --store redux -p

# Only in this project will use Redux
avangcli module products  # Uses Redux automatically
```

### Default Priority

1. CLI argument (`--store zustand`)
2. Project default (`.avangcli.json`)
3. Global default (`~/.avangcli/config.json`)
4. Interactive prompt

## Tips and Best Practices

### 1. Use Defaults for Large Projects

```bash
# At project start
avangcli module users --store zustand -p

# All other modules will be consistent
avangcli module products
avangcli module orders
avangcli module analytics
```

### 2. Organize by Domain

```bash
# E-commerce
avangcli module products
avangcli module shopping-cart
avangcli module checkout
avangcli module orders

# Dashboard
avangcli module analytics
avangcli module reports
avangcli module settings
```

### 3. Descriptive Names

✅ **GOOD:**

```bash
avangcli module user-authentication
avangcli module product-catalog
avangcli module order-history
```

❌ **BAD:**

```bash
avangcli module auth  # Too short
avangcli module prods  # Confusing abbreviation
avangcli module module1  # Not descriptive
```

## Troubleshooting

### Error: "Not a valid Next.js project"

**Cause:** You're not in a Next.js project or key files are missing.

**Solution:**

```bash
# Verify these exist:
ls package.json
ls next.config.js
ls app/  # or pages/

# Or use skip-validation (not recommended)
avangcli module my-module --skip-validation
```

### Error: "Module already exists"

**Cause:** A module with that name already exists.

**Solution:**

```bash
# Choose another name
avangcli module user-profile-v2

# Or delete existing module
rm -rf app/modules/user-profile
```

### Error: "Invalid module name"

**Cause:** Name with invalid characters.

**Solution:**

```bash
# Use kebab-case
avangcli module user-profile  ✅
avangcli module UserProfile   ❌
avangcli module user_profile  ❌
```

### Store Manager Not Installing

**Solution:**

```bash
# Install manually
npm install zustand
# or
npm install @reduxjs/toolkit
```

## Next Steps

After generating a module:

1. **Customize the Container**
   - Add necessary props
   - Implement UI logic

2. **Implement the Service**
   - Add business methods
   - Connect with APIs

3. **Define Types**
   - Add specific interfaces
   - Extend base types

4. **Configure the Store**
   - Add necessary actions
   - Implement selectors

5. **Add Tests**
   ```bash
   # Create test files
   touch app/modules/user-profile/__tests__/user-profile.test.ts
   ```

## Related Resources

- [Screaming Architecture](../04-architecture/screaming-architecture.md)
- [Store Managers](../05-integrations/store-managers.md)
- [UI-library command](./ui-library.md)
- [Best Practices](../08-guides/best-practices.md)
