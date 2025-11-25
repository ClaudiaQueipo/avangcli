# Best Practices with AvangCLI

## Project Organization

In this module, the best practices for developing modules with AvangCLI will be explained. The correct and incorrect approaches for each case will be shown.

### 1. Module Structure

#### ✅ GOOD: Organize by Feature

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

#### ❌ BAD: Organize by Type

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

### 2. Scope Rule

**Principle:** Code should live as close as possible to where it's used.

#### Component Used in 1 Module

```
modules/user-profile/
└── components/
    └── Avatar.tsx  ← Only here
```

#### Component Used in 2+ Modules

```
shared/
└── components/
    └── Button.tsx  ← Shared
```

### 3. Naming Conventions

#### Modules: kebab-case

```bash
✅ avangcli module user-profile
✅ avangcli module shopping-cart
✅ avangcli module product-catalog

❌ avangcli module UserProfile
❌ avangcli module user_profile
❌ avangcli module userprofile
```

#### Files: kebab-case

```
✅ user-profile-container.tsx
✅ user-profile.service.ts
✅ use-user-profile.ts

❌ UserProfileContainer.tsx
❌ user_profile_service.ts
```

#### Classes and Components: PascalCase

```typescript
✅ export class UserProfileService
✅ export const UserProfileContainer
✅ export interface UserProfileData

❌ export class userProfileService
❌ export const userProfilecontainer
```

#### Variables and Functions: camelCase

```typescript
✅ const userProfileService = UserProfileService.getInstance()
✅ function getUserProfile()
✅ const isLoading = true

❌ const UserProfileService = ...
❌ function GetUserProfile()
```

## State Management

### 1. When to Use Zustand vs Redux

#### Use Zustand If

- ✅ Small to medium project
- ✅ Simple state
- ✅ Small team
- ✅ You value simplicity

```bash
avangcli module user-profile --store zustand -p
```

#### Use Redux If

- ✅ Large/complex project
- ✅ Complex state with many interactions
- ✅ Large team
- ✅ Need advanced DevTools
- ✅ Established patterns (thunks, sagas)

```bash
avangcli module analytics --store redux -p
```

### 2. Set Default at Start

```bash
# Set the standard for the whole project
avangcli module auth --store zustand -p

# All other modules will use Zustand
avangcli module products
avangcli module orders
```

### 3. Store Organization

#### By Module (Recommended)

```
modules/user-profile/
└── store/
    └── user-profile.store.ts  # Module state
```

#### Global Store (For Shared State)

```
store/
├── auth.store.ts      # Global authentication
├── theme.store.ts     # App theme
└── config.store.ts    # Global configuration
```

## Services

### 1. Singleton Pattern

**ALWAYS** use the singleton pattern for services:

```typescript
// ✅ GOOD: Singleton
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
// ❌ BAD: Multiple instances
export class UserProfileService {
  constructor() {} // public constructor
}

export const userProfileService = new UserProfileService()
```

### 2. Separation of Concerns

```typescript
// ✅ GOOD: Service handles business logic
export class UserProfileService {
  async fetchProfile(userId: string) {
    const data = await apiClient.get(`/users/${userId}`)
    return this.transformData(data)
  }

  private transformData(data: any) {
    // Transformation logic
  }
}
```

```typescript
// ❌ BAD: Component handles business logic
export function UserProfile() {
  const [user, setUser] = useState()

  useEffect(() => {
    fetch("/api/users/123")
      .then((r) => r.json())
      .then((data) => {
        // Transformation in component
        setUser(data)
      })
  }, [])
}
```

## Components

### 1. Containers vs Components

#### Container (Smart Component)

```typescript
// ✅ Handles logic and state
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
// ✅ Only renders UI
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

#### Use Props For

- ✅ Data coming from parent
- ✅ Callbacks and events
- ✅ Component configuration

```typescript
<UserCard
  user={user}
  onEdit={handleEdit}
  size="large"
/>
```

#### Use Store For

- ✅ State shared between modules
- ✅ Global app state
- ✅ Data from backend

```typescript
function UserCard() {
  const { currentUser } = useAuthStore()
  return <div>{currentUser.name}</div>
}
```

## TypeScript

### 1. Define Types in `types/`

```typescript
// ✅ GOOD: Centralized types
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

### 2. Use Type Exports

```typescript
// modules/user-profile/index.ts
export type { UserProfileData, UserProfileState, UserProfileActions } from "./types/user-profile.types"
```

### 3. Avoid `any`

```typescript
// ❌ BAD
function processData(data: any) {
  return data.name
}

// ✅ GOOD
interface Data {
  name: string
}

function processData(data: Data) {
  return data.name
}
```

## Imports and Exports

### 1. Barrel Exports

**ALWAYS** use `index.ts` for exports:

```typescript
// modules/user-profile/index.ts
export { UserProfileContainer } from "./containers/user-profile-container"
export { UserProfileService, userProfileService } from "./services/user-profile.service"
export { useUserProfileStore } from "./store/user-profile.store"
export type * from "./types/user-profile.types"
```

### 2. Import from Barrel

```typescript
// ✅ GOOD
import { UserProfileContainer, userProfileService, type UserProfileData } from "@/modules/user-profile"

// ❌ BAD
import { UserProfileContainer } from "@/modules/user-profile/containers/user-profile-container"
import { userProfileService } from "@/modules/user-profile/services/user-profile.service"
```

### 3. Import Aliases

Configure in `tsconfig.json`:

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

## Error Handling

### 1. Try-Catch in Services

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
      throw error // Re-throw for caller to handle
    }
  }
}
```

### 2. Error Boundaries in React

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
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```

## Testing

### 1. Test Structure

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

### 2. Service Tests

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

### 1. Conventional Commits

If you configured `--git-setup`:

```bash
# Use Commitizen
npx cz

# Select type:
# feat: New feature
# fix: Bug fix
# docs: Documentation
# refactor: Refactoring
# test: Tests
```

### 2. Commit Structure

```bash
# ✅ GOOD
git commit -m "feat(user-profile): add profile edit functionality"
git commit -m "fix(shopping-cart): resolve quantity update bug"

# ❌ BAD
git commit -m "changes"
git commit -m "fixed stuff"
```

### 3. Pre-commit Hooks

Hooks run automatically:

```bash
git commit
# → lint-staged executes
# → eslint --fix
# → prettier --write
# → type-check
```

## Performance

### 1. Code Splitting by Module

```typescript
// app/profile/page.tsx
import dynamic from 'next/dynamic'

const UserProfileContainer = dynamic(
  () => import('@/modules/user-profile').then(mod => mod.UserProfileContainer),
  { loading: () => <LoadingSpinner /> }
)
```

### 2. Lazy Loading Stores

```typescript
// Only load store when needed
const useUserProfileStore = lazy(() =>
  import("@/modules/user-profile").then((mod) => ({ default: mod.useUserProfileStore }))
)
```

## Documentation

### 1. JSDoc on Key Functions

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

### 2. README per Module (Optional)

```markdown
# User Profile Module

## Description

Handles everything related to user profiles.

## Usage

\`\`\`typescript
import { UserProfileContainer } from '@/modules/user-profile'
\`\`\`

## API

- `fetchProfile(id)` - Gets profile
- `updateProfile(data)` - Updates profile
```

## Best Practices Checklist

### When Creating a Project

- [ ] Use `--git-setup` to configure quality tools
- [ ] Set store manager default `-p`
- [ ] Configure UI library from the start
- [ ] Configure Tailwind if needed

### When Creating a Module

- [ ] Use descriptive name in kebab-case
- [ ] Choose consistent store manager
- [ ] Implement logic in service, not component
- [ ] Define types in `types/`
- [ ] Use barrel exports in `index.ts`

### During Development

- [ ] Follow Scope Rule
- [ ] Separate containers and components
- [ ] Use strict TypeScript
- [ ] Write tests for services
- [ ] Document complex functions

### Before Commit

- [ ] Run linter
- [ ] Verify types
- [ ] Review unused imports
- [ ] Use conventional commits

## Additional Resources

- [Screaming Architecture](../04-architecture/screaming-architecture.md)
- [Module command](../03-commands/module.md)
- [Store Managers](../05-integrations/store-managers.md)
- [Complete Project](./complete-project-walkthrough.md)
