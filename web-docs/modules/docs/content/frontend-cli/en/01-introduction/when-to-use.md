# When to Use AvangCLI Frontend?

## Project Stages

### 1. 🚀 Starting New Projects

**Ideal scenario:** You're starting a new Next.js project from scratch.

**Benefits:**

- Complete setup in minutes
- All development tools already configured
- Scalable architecture from day 1
- No initial technical debt

**Typical commands:**

```bash
avangcli init my-new-project --pm bun --tailwind --lf eslint-prettier --docker both --ui shadcn --git-setup
```

**Result:**

- Configured Next.js project
- ESLint + Prettier working
- Docker ready for dev and prod
- Git hooks configured
- shadcn/ui installed and ready

---

### 2. 📈 Active Development Projects

**Scenario:** You already have a Next.js project and need to add new functionalities.

**Benefits:**

- Generate consistent modules quickly
- Maintain uniform architecture
- Accelerate feature development

**Typical commands:**

```bash
# Add a new module
avangcli module user-profile --store zustand

# Add another module
avangcli module shopping-cart --store zustand -p

# Add UI library if you don't have it
avangcli ui-library shadcn
```

**Result:**

- Complete modules with consistent structure
- Services, types, hooks already configured
- Integrated store management

---

### 3. 🔄 Refactoring and Improvement

**Scenario:** Existing project that needs better organization.

**Recommended use:**

- Generate new modules with modular architecture
- Gradually migrate existing components
- Establish a standard for the team

**Strategy:**

1. Generate new modules with AvangCLI
2. Migrate existing code to the new structure
3. Maintain consistency in new features

---

### 4. 👥 Onboarding New Developers

**Scenario:** Growing team that needs clear standards.

**Benefits:**

- Predictable and documented structure
- New devs become productive faster
- Fewer questions about "where to put the code"

**Advantage:** Junior developers can generate professional-quality code from day one.

---

### 5. 🏢 Multiple Next.js Projects

**Scenario:** Company or agency with several projects.

**Benefits:**

- Same architecture across all projects
- Developers can move between projects easily
- Simplified maintenance

**Result:** Portfolio of projects with consistent and maintainable code.

---

## Specific Use Cases

### ✅ When to YES use AvangCLI

#### 1. Projects with scalable architecture

```bash
# You need the project to grow in an organized way
avangcli module authentication --store redux
avangcli module products --store redux -p
avangcli module checkout --store redux
```

#### 2. Teams that value consistency

- Multiple developers working
- Frequent code reviews
- Need for clear standards

#### 3. Prototypes that can become production

- Want to iterate quickly but with quality
- Don't want technical debt from the start

#### 4. Projects with strict quality requirements

- Need linting, formatting, testing configured
- Git hooks and commit conventions required
- Docker for consistent deployment

#### 5. Projects with complex state

- Applications with multiple modules
- Need for robust state management
- Redux or Zustand as requirement

---

### ❌ When NOT to use AvangCLI

#### 1. Extremely simple projects

- Static landing pages
- Single-page sites without state
- Disposable proof-of-concept projects

**Alternative:** `create-next-app` is sufficient

#### 2. Completely custom architecture

- You already have a very specific architecture
- Need completely different structure
- Very specific design patterns

**Note:** Although you can use only some AvangCLI commands and adapt

#### 3. Non-Next.js projects

- Pure React with Vite
- Remix, Gatsby, or other frameworks
- Not using TypeScript

**Reason:** AvangCLI is specifically optimized for Next.js + TypeScript

#### 4. Team with very established setup process

- Already have their own scripts and tools
- Use another architecture (e.g., clean architecture)
- Setup process works perfectly
- Don't need to change their workflow

---

## Next Steps

- [Installation](../02-getting-started/installation.md)
- [Available commands](../03-commands/init.md)
- [Complete tutorial](../08-guides/complete-project-walkthrough.md)
