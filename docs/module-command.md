# Module Command Documentation

## Overview

The `module` command is a scaffolding tool for Next.js applications that automatically generates a complete module structure with boilerplate code, following best practices and architectural patterns similar to Angular or NestJS.

## Features

- **Next.js Validation**: Automatically validates that you're in a valid Next.js project before proceeding
- **Automatic Structure Creation**: Creates a consistent folder structure for each module
- **Boilerplate Generation**: Generates functional TypeScript/React code with best practices
- **Naming Conventions**: Enforces kebab-case for file names and proper PascalCase/camelCase conversions
- **Singleton Pattern**: Services implement the singleton pattern for consistent state management
- **TypeScript Support**: All generated code is TypeScript with proper type definitions
- **Barrel Exports**: Includes index.ts file for clean module imports

## Usage

### Basic Usage

```bash
avangcli module <module-name>
```

### Examples

```bash
# Create a user module
avangcli module user

# Create a shopping cart module
avangcli module shopping-cart

# Create a user profile module
avangcli module user-profile

# Skip Next.js validation (use with caution)
avangcli module my-module --skip-validation
```

## Module Structure

Each generated module includes the following folder structure:

```
modules/
└── <module-name>/
    ├── components/      # React components specific to this module
    ├── containers/      # Container components (generated with boilerplate)
    ├── adapters/        # API adapters and data transformation
    ├── types/          # TypeScript type definitions (generated with boilerplate)
    ├── services/       # Business logic services (generated with boilerplate)
    ├── hooks/          # Custom React hooks
    ├── store/          # State management (Redux, Zustand, etc.)
    ├── lib/            # Utility libraries specific to this module
    ├── helpers/        # Helper functions
    └── index.ts        # Barrel export file (generated)
```

## Generated Files

### 1. Container Component

**Location**: `containers/<module-name>-container.tsx`

The container component is a React functional component that serves as the main entry point for the module's UI logic.

**Features**:
- TypeScript interface for props
- JSDoc documentation
- 'use client' directive for Next.js App Router
- displayName for better debugging
- Basic structure with example content

**Example**:
```typescript
'use client'

import React from 'react'

interface UserProfileContainerProps {
  // Add your props here
}

export const UserProfileContainer: React.FC<UserProfileContainerProps> = (props) => {
  return (
    <div className="user-profile-container">
      <h1>UserProfile Module</h1>
      <p>This is the main container for the user-profile module.</p>
    </div>
  )
}
```

### 2. Service Class

**Location**: `services/<module-name>.service.ts`

The service class implements business logic using the singleton pattern.

**Features**:
- Singleton pattern implementation
- Private constructor to prevent direct instantiation
- Static getInstance() method
- Example methods for data fetching and processing
- Proper error handling
- JSDoc documentation
- Exported instance for immediate use

**Example**:
```typescript
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

  public async fetchData(): Promise<any> {
    // Implementation
  }
}

export const userProfileService = UserProfileService.getInstance()
```

### 3. Type Definitions

**Location**: `types/<module-name>.types.ts`

TypeScript type definitions for the module.

**Includes**:
- Data interface
- State interface
- Actions interface
- Status type

**Example**:
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

export type UserProfileStatus = 'idle' | 'loading' | 'success' | 'error'
```

### 4. Barrel Export (index.ts)

**Location**: `index.ts`

Provides a clean public API for the module through barrel exports.

**Example**:
```typescript
// Containers
export { UserProfileContainer } from './containers/user-profile-container'

// Services
export { UserProfileService, userProfileService } from './services/user-profile.service'

// Types
export type {
  UserProfileData,
  UserProfileState,
  UserProfileActions,
  UserProfileStatus
} from './types/user-profile.types'
```

## Next.js Validation

The command performs the following validations before creating a module:

1. **package.json exists**: Checks for the presence of package.json in the current directory
2. **Next.js dependency**: Verifies that Next.js is listed in dependencies or devDependencies
3. **Project structure** (warning only): Checks for next.config.{js,mjs,ts} and app/pages directories
4. **node_modules** (warning only): Warns if node_modules is not present

### Validation Output

```
✓ Next.js ^14.0.0
⚠ Warning: No next.config.{js,mjs,ts} file found (this is optional)
⚠ Warning: node_modules not found. Run npm/yarn/pnpm/bun install first
```

## Working with src/ Directory

The command automatically detects if your Next.js project uses a `src/` directory and creates modules accordingly:

- **Without src/**: `modules/<module-name>/...`
- **With src/**: `src/modules/<module-name>/...`

## Naming Conventions

### Module Names

Module names must follow kebab-case format:

✅ Valid:
- `user`
- `shopping-cart`
- `user-profile`
- `product-catalog`

❌ Invalid:
- `User` (must start with lowercase)
- `shopping_cart` (use hyphens, not underscores)
- `shoppingCart` (use kebab-case, not camelCase)
- `Shopping-Cart` (must start with lowercase)

### Code Conventions

- **Files**: kebab-case (e.g., `user-profile-container.tsx`)
- **Components**: PascalCase (e.g., `UserProfileContainer`)
- **Service Classes**: PascalCase (e.g., `UserProfileService`)
- **Service Instances**: camelCase (e.g., `userProfileService`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfileData`)

## Error Handling

### Common Errors

#### 1. Module Already Exists
```bash
❌ Module "user-profile" already exists
```
**Solution**: Use a different module name or delete the existing module

#### 2. Invalid Module Name
```bash
❌ Module name must be in kebab-case format (e.g., user, shopping-cart, user-profile)
```
**Solution**: Use kebab-case format for module names

#### 3. Not a Valid Next.js Project
```bash
❌ Not a valid Next.js project:
  ✗ package.json not found
```
**Solution**: Run the command from the root of your Next.js project, or use `--skip-validation` if you're certain you're in the right place

#### 4. Next.js Dependency Not Found
```bash
❌ Not a valid Next.js project:
  ✗ Next.js dependency not found in package.json
```
**Solution**: Install Next.js (`npm install next react react-dom`) or run from a valid Next.js project

## Integration with Next.js

### Using the Generated Container

```typescript
// In your page or component
import { UserProfileContainer } from '@/modules/user-profile/containers/user-profile-container'

export default function UserProfilePage() {
  return <UserProfileContainer />
}
```

### Using the Generated Service

```typescript
// In any component or server action
import { userProfileService } from '@/modules/user-profile/services/user-profile.service'

async function fetchUserData() {
  const data = await userProfileService.fetchData()
  return data
}
```

### Using Module Types

```typescript
import type { UserProfileData, UserProfileState } from '@/modules/user-profile'

const [state, setState] = useState<UserProfileState>({
  isLoading: false,
  error: null,
  data: null
})
```

## Best Practices

1. **Keep modules focused**: Each module should represent a single feature or domain
2. **Use barrel exports**: Import from the module's index.ts for cleaner imports
3. **Follow the structure**: Keep components in `components/`, services in `services/`, etc.
4. **Type everything**: Use the generated types and add more as needed
5. **Service layer**: Keep business logic in services, not in components
6. **Container pattern**: Use containers for stateful logic, components for presentation

## Next Steps After Generation

After generating a module, you should:

1. **Implement business logic**: Update the service methods with actual functionality
2. **Add types**: Extend the generated types with your domain-specific types
3. **Create components**: Add presentational components in the `components/` folder
4. **Add hooks**: Create custom hooks in the `hooks/` folder
5. **State management**: Set up state management in the `store/` folder if needed
6. **Write tests**: Add tests for your services and components

## Command Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--skip-validation` | `-s` | Skip Next.js project validation | `false` |

## Examples

### Creating Multiple Modules

```bash
# Create modules for an e-commerce application
avangcli module product-catalog
avangcli module shopping-cart
avangcli module checkout
avangcli module user-account
avangcli module order-history
```

### Working with TypeScript Path Aliases

Make sure your `tsconfig.json` includes the modules path:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/modules/*": ["./modules/*"],
      "@/*": ["./*"]
    }
  }
}
```

Or for projects with `src/`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/modules/*": ["./src/modules/*"],
      "@/*": ["./src/*"]
    }
  }
}
```

## Troubleshooting

### Issue: Module created but imports don't work

**Solution**: Check your TypeScript path aliases in `tsconfig.json` or use relative imports

### Issue: Cannot find module error

**Solution**: Restart your TypeScript server in your IDE or run `npm run build` to regenerate types

### Issue: Service singleton not working

**Solution**: Make sure you're importing the instance (`userProfileService`) not the class (`UserProfileService`)

## Architecture Benefits

This module structure provides several benefits:

1. **Scalability**: Easy to add new modules without affecting existing ones
2. **Maintainability**: Clear separation of concerns and consistent structure
3. **Reusability**: Modules can be moved or shared between projects
4. **Testability**: Services and components are easily testable in isolation
5. **Type Safety**: TypeScript throughout ensures compile-time type checking
6. **Best Practices**: Enforces architectural patterns and coding standards
