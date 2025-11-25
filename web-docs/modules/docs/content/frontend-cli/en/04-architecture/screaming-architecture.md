# Screaming Architecture

## What is Screaming Architecture?

**Screaming Architecture** is a software design principle coined by Robert C. Martin (Uncle Bob) that establishes:

> "The architecture of a system should scream about the use cases of the system, not about the frameworks it uses."

In other words: **When looking at your project's folder structure, you should immediately understand WHAT your application does, not WHAT it's built with.**

## Visual Example

### ❌ Traditional Architecture (Framework-centric)

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

**Problem:** You can't tell what the application does without opening files.

### ✅ Screaming Architecture (Feature-centric)

```
app/
├── modules/
│   ├── authentication/      ← "I have authentication!"
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   ├── products/            ← "I handle products!"
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   └── shopping-cart/       ← "I have a shopping cart!"
│       ├── components/
│       ├── services/
│       └── hooks/
```

**Benefit:** The structure "screams" that it's an e-commerce application.

## Implementation in AvangCLI

### Generated Module Structure

When you run:

```bash
avangcli module user-profile --store zustand
```

This structure is created:

```
modules/
└── user-profile/
    ├── components/          # Reusable UI components of the module
    ├── containers/          # Container components (logic + UI)
    │   └── user-profile-container.tsx
    ├── services/            # Business logic
    │   └── user-profile.service.ts
    ├── types/               # TypeScript definitions
    │   └── user-profile.types.ts
    ├── hooks/               # Custom React hooks
    ├── store/               # Module state
    │   └── user-profile.store.ts
    ├── adapters/            # Adapters for external APIs
    ├── helpers/             # Helper functions
    ├── lib/                 # Module-specific utilities
    └── index.ts             # Barrel export
```

## Design Principles

### 1. **Organization by Feature, not by Type**

#### ❌ BAD: By file type

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

#### ✅ GOOD: By feature

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

**Reason:** When working on "users", all related files are together.

### 2. **High Cohesion, Low Coupling**

**High Cohesion:**

- Everything related to "user-profile" is in `modules/user-profile/`
- Easy to find and modify

**Low Coupling:**

- Each module is independent
- They communicate through well-defined interfaces
- Easy to test in isolation

### 3. **Scope Rule**

**Principle:** Code should live as close as possible to where it's used.

```
modules/
  user-profile/
    components/
      Avatar.tsx              ← Only used in user-profile
    services/
      user-profile.service.ts ← Only for this module
```

If a component is used in **2+ modules**, then it should be moved to `shared/`:

```
shared/
  components/
    Button.tsx               ← Used in multiple modules
```

### 4. **Clear Hierarchy**

```
modules/
  user-profile/
    containers/              ← Highest level: Orchestrates everything
      user-profile-container.tsx
    components/              ← Middle level: UI components
      ProfileHeader.tsx
    services/                ← Low level: Business logic
      user-profile.service.ts
    types/                   ← Foundation: Contracts
      user-profile.types.ts
```

## Advantages of this Architecture

### 1. **Intuitive Navigation**

**Scenario:** You need to modify the user profile.

```bash
# You know exactly where to go:
modules/user-profile/
```

You don't need to search through:

- `components/` → Which component?
- `services/` → Which service?
- `types/` → Which types?

### 2. **Natural Scalability**

**New feature = New module**

```bash
# Add product reviews
avangcli module product-reviews --store zustand

# Add wishlist
avangcli module wishlist --store zustand
```

The structure grows without becoming chaotic.

### 3. **Efficient Teamwork**

**Without Screaming Architecture:**

- Developer A works on `components/UserForm.tsx`
- Developer B works on `components/ProductForm.tsx`
- **Merge conflict** in the same folder

**With Screaming Architecture:**

- Developer A works on `modules/user/`
- Developer B works on `modules/product/`
- **No conflicts** - different modules

### 4. **Fast Onboarding**

**New developer:**

```
"What does this app do?"
→ Looks at `modules/`
→ "Ah, it handles users, products, shopping-cart and orders"
```

**vs.**

```
"What does this app do?"
→ Looks at `components/`, `hooks/`, `services/`
→ "Uh... I don't know, let me review each file"
```

### 5. **Simplified Testing**

Each module is a testable unit:

```typescript
// user-profile.test.ts
import { userProfileService } from "@/modules/user-profile"

describe("UserProfile Module", () => {
  // Test the entire module in isolation
})
```

### 6. **Easy Code Removal**

**Deprecated feature:**

```bash
# Simply delete the entire module
rm -rf modules/deprecated-feature
```

Without worrying about:

- Which components were from this feature?
- Which hooks did it use?
- Which services?

Everything is in one place.

## Rationale for Each Folder

### `containers/`

**Why:** Separate **logic** from **presentation**.

**Container:** Handles state, side effects, business logic.
**Component:** Only renders UI.

```typescript
// Container
export const UserProfileContainer = () => {
  const [user, setUser] = useState()
  const loadUser = async () => { /* logic */ }

  return <UserProfileView user={user} />
}

// Component (presentational)
export const UserProfileView = ({ user }) => {
  return <div>{user.name}</div>
}
```

### `services/`

**Why:** Centralize **business logic**.

- Singleton pattern for single instance
- Reusable methods
- Easy to mock in tests

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

**Why:** **Clear contracts** between layers.

```typescript
export interface UserProfile {
  id: string
  name: string
  email: string
}
```

### `store/`

**Why:** **Isolated state** per module.

```typescript
// Zustand store
export const useUserProfileStore = create((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile })
}))
```

### `adapters/`

**Why:** **Isolate external dependencies**.

```typescript
// If you change from REST to GraphQL, only modify the adapter
export class UserApiAdapter {
  async fetchUser(id: string) {
    // REST implementation
    return fetch(`/api/users/${id}`)
  }
}
```

### `hooks/`

**Why:** **Reusable logic** specific to the module.

```typescript
export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState()

  useEffect(() => {
    // Loading logic
  }, [userId])

  return { profile }
}
```

## When to Break the Rules

### Shared Modules

If something is used in **2+ modules**:

```
shared/
  components/
    Button.tsx        ← Used everywhere
    Modal.tsx
  hooks/
    useAuth.ts        ← Global authentication
  types/
    common.types.ts   ← Shared types
```

### Global Configuration

```
config/
  api.config.ts
  theme.config.ts
```

### General Utilities

```
utils/
  formatDate.ts
  validators.ts
```

## Comparison with Other Architectures

| Architecture       | Organization | Scalability | Learning curve |
| ------------------ | ------------ | ----------- | -------------- |
| **Screaming**      | By feature   | ⭐⭐⭐⭐⭐  | Medium         |
| **Traditional**    | By type      | ⭐⭐        | Low            |
| **Atomic Design**  | By UI        | ⭐⭐⭐      | High           |
| **Feature-Sliced** | By slice     | ⭐⭐⭐⭐    | High           |

## Conclusion

**Screaming Architecture is not just folder organization.**

It's a **design philosophy** that:

1. ✅ Communicates the system's purpose
2. ✅ Facilitates maintenance
3. ✅ Accelerates development
4. ✅ Improves collaboration
5. ✅ Reduces complexity

**AvangCLI implements these principles automatically**, so you can focus on solving business problems, not deciding where to put each file.

## Additional Resources

- [CLI Architecture](./overview.md)
- [Core modules](./core-modules.md)
- [Complete project](../08-guides/complete-project-walkthrough.md)
