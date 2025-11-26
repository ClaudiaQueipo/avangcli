# Proyecto Completo Paso a Paso

Esta guía te lleva desde cero hasta tener una aplicación Next.js completa con autenticación, catálogo de productos, carrito de compras y checkout usando AvangCLI.

## Proyecto: E-commerce "TechStore"

Vamos a crear una tienda online con las siguientes características:

- ✅ Autenticación de usuarios
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Proceso de checkout
- ✅ Panel de administración
- ✅ Gestión de estado con Zustand
- ✅ UI con shadcn/ui
- ✅ Linting y formatting
- ✅ Docker setup

**Tiempo estimado:** 45-60 minutos

---

## Paso 1: Inicializar el Proyecto

### 1.1 Crear el Proyecto Base

```bash
avangcli init techstore \
  --pm bun \
  --tailwind \
  --lf eslint-prettier \
  --docker both \
  --ui shadcn \
  --git-setup
```

**Explicación de las opciones:**

- `--pm bun`: Gestor de paquetes rápido
- `--tailwind`: Necesario para shadcn/ui
- `--lf eslint-prettier`: Quality tools estándar
- `--docker both`: Dev y producción
- `--ui shadcn`: Componentes UI modernos
- `--git-setup`: Git hooks y conventional commits

### 1.2 Navegar al Proyecto

```bash
cd techstore
```

### 1.3 Verificar la Instalación

```bash
# Iniciar servidor de desarrollo
bun dev

# Abrir http://localhost:3000
```

**Resultado Esperado:** Página de bienvenida de Next.js

---

## Paso 2: Crear Módulo de Autenticación

### 2.1 Generar el Módulo

```bash
avangcli module authentication --store zustand -p
```

**Nota:** El flag `-p` establece Zustand como default para todos los módulos futuros.

### 2.2 Estructura Generada

```
app/modules/authentication/
├── components/
├── containers/
│   └── authentication-container.tsx
├── services/
│   └── authentication.service.ts
├── types/
│   └── authentication.types.ts
├── store/
│   └── authentication.store.ts
└── index.ts
```

### 2.3 Implementar Tipos

Edita `app/modules/authentication/types/authentication.types.ts`:

```typescript
export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

export interface AuthenticationData {
  user: User | null
  token: string | null
}

export interface AuthenticationState {
  isLoading: boolean
  error: string | null
  data: AuthenticationData | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}

export type AuthenticationStatus = "idle" | "loading" | "success" | "error"
```

### 2.4 Implementar Service

Edita `app/modules/authentication/services/authentication.service.ts`:

```typescript
import type { LoginCredentials, RegisterData, User } from "../types/authentication.types"

export class AuthenticationService {
  private static instance: AuthenticationService
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

  private constructor() {
    this.initialize()
  }

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService()
    }
    return AuthenticationService.instance
  }

  private initialize(): void {
    // Verificar token en localStorage al iniciar
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        this.validateToken(token)
      }
    }
  }

  public async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      this.saveToken(data.token)
      return data
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    }
  }

  public async register(data: RegisterData): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const result = await response.json()
      this.saveToken(result.token)
      return result
    } catch (error) {
      console.error("Error registering:", error)
      throw error
    }
  }

  public logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.ok
    } catch {
      return false
    }
  }

  public getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }
}

export const authenticationService = AuthenticationService.getInstance()
```

### 2.5 Actualizar Store

Edita `app/modules/authentication/store/authentication.store.ts`:

```typescript
import { create } from "zustand"
import type {
  AuthenticationData,
  AuthenticationState,
  LoginCredentials,
  RegisterData
} from "../types/authentication.types"
import { authenticationService } from "../services/authentication.service"

interface AuthenticationStore extends AuthenticationState {
  setData: (data: AuthenticationData | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  reset: () => void
}

const initialState: AuthenticationState = {
  isLoading: false,
  error: null,
  data: null,
  isAuthenticated: false
}

export const useAuthenticationStore = create<AuthenticationStore>((set) => ({
  ...initialState,

  setData: (data) =>
    set({
      data,
      error: null,
      isAuthenticated: !!data?.user
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authenticationService.login(credentials)
      set({
        data,
        isLoading: false,
        isAuthenticated: true
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false
      })
      throw error
    }
  },

  register: async (registerData) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authenticationService.register(registerData)
      set({
        data,
        isLoading: false,
        isAuthenticated: true
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Registration failed",
        isLoading: false
      })
      throw error
    }
  },

  logout: () => {
    authenticationService.logout()
    set({ ...initialState })
  },

  reset: () => set(initialState)
}))
```

---

## Paso 3: Crear Módulo de Productos

### 3.1 Generar el Módulo

```bash
avangcli module products
```

**Nota:** Usa automáticamente Zustand porque lo establecimos como default.

### 3.2 Implementar Tipos

Edita `app/modules/products/types/products.types.ts`:

```typescript
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export interface ProductsData {
  products: Product[]
  total: number
}

export interface ProductsState {
  isLoading: boolean
  error: string | null
  data: ProductsData | null
  selectedProduct: Product | null
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}
```

### 3.3 Implementar Service

```typescript
import type { Product, ProductFilters, ProductsData } from "../types/products.types"

export class ProductsService {
  private static instance: ProductsService
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

  private constructor() {}

  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService()
    }
    return ProductsService.instance
  }

  public async fetchProducts(filters?: ProductFilters): Promise<ProductsData> {
    try {
      const params = new URLSearchParams()
      if (filters?.category) params.append("category", filters.category)
      if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString())
      if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
      if (filters?.search) params.append("search", filters.search)

      const response = await fetch(`${this.apiUrl}/products?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  }

  public async fetchProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${this.apiUrl}/products/${id}`)

      if (!response.ok) {
        throw new Error("Product not found")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  }
}

export const productsService = ProductsService.getInstance()
```

### 3.4 Actualizar Store

```typescript
import { create } from "zustand"
import type { Product, ProductsData, ProductsState, ProductFilters } from "../types/products.types"
import { productsService } from "../services/products.service"

interface ProductsStore extends ProductsState {
  setData: (data: ProductsData | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setSelectedProduct: (product: Product | null) => void
  fetchProducts: (filters?: ProductFilters) => Promise<void>
  fetchProductById: (id: string) => Promise<void>
  reset: () => void
}

const initialState: ProductsState = {
  isLoading: false,
  error: null,
  data: null,
  selectedProduct: null
}

export const useProductsStore = create<ProductsStore>((set) => ({
  ...initialState,

  setData: (data) => set({ data, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      const data = await productsService.fetchProducts(filters)
      set({ data, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch products",
        isLoading: false
      })
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const product = await productsService.fetchProductById(id)
      set({ selectedProduct: product, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch product",
        isLoading: false
      })
    }
  },

  reset: () => set(initialState)
}))
```

---

## Paso 4: Crear Módulo de Carrito

### 4.1 Generar el Módulo

```bash
avangcli module shopping-cart
```

### 4.2 Implementar Tipos

```typescript
export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface ShoppingCartData {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface ShoppingCartState {
  isLoading: boolean
  error: string | null
  data: ShoppingCartData
}
```

### 4.3 Implementar Store

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, ShoppingCartData, ShoppingCartState } from "../types/shopping-cart.types"

interface ShoppingCartStore extends ShoppingCartState {
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  reset: () => void
}

const initialState: ShoppingCartState = {
  isLoading: false,
  error: null,
  data: {
    items: [],
    total: 0,
    itemCount: 0
  }
}

const calculateTotals = (items: CartItem[]): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

export const useShoppingCartStore = create<ShoppingCartStore>()(
  persist(
    (set) => ({
      ...initialState,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingItem = state.data.items.find((i) => i.productId === item.productId)

          let newItems: CartItem[]
          if (existingItem) {
            newItems = state.data.items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
            )
          } else {
            newItems = [...state.data.items, { ...item, quantity }]
          }

          const { total, itemCount } = calculateTotals(newItems)

          return {
            data: {
              items: newItems,
              total,
              itemCount
            }
          }
        }),

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.data.items.filter((i) => i.productId !== productId)
          const { total, itemCount } = calculateTotals(newItems)

          return {
            data: {
              items: newItems,
              total,
              itemCount
            }
          }
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.data.items.filter((i) => i.productId !== productId)
            const { total, itemCount } = calculateTotals(newItems)
            return {
              data: { items: newItems, total, itemCount }
            }
          }

          const newItems = state.data.items.map((i) => (i.productId === productId ? { ...i, quantity } : i))
          const { total, itemCount } = calculateTotals(newItems)

          return {
            data: { items: newItems, total, itemCount }
          }
        }),

      clearCart: () => set({ data: initialState.data }),

      reset: () => set(initialState)
    }),
    {
      name: "shopping-cart-storage"
    }
  )
)
```

---

## Paso 5: Crear Módulo de Checkout

### 5.1 Generar el Módulo

```bash
avangcli module checkout
```

### 5.2 Implementar Tipos

```typescript
export interface CheckoutData {
  shippingAddress: Address | null
  billingAddress: Address | null
  paymentMethod: PaymentMethod | null
  orderId: string | null
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentMethod {
  type: "card" | "paypal" | "cash"
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
}

export interface CheckoutState {
  isLoading: boolean
  error: string | null
  data: CheckoutData
  step: CheckoutStep
}

export type CheckoutStep = "shipping" | "payment" | "review" | "complete"
```

### 5.3 Implementar Store

```typescript
import { create } from "zustand"
import type { Address, CheckoutData, CheckoutState, CheckoutStep, PaymentMethod } from "../types/checkout.types"

interface CheckoutStore extends CheckoutState {
  setShippingAddress: (address: Address) => void
  setBillingAddress: (address: Address) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setStep: (step: CheckoutStep) => void
  completeOrder: () => Promise<void>
  reset: () => void
}

const initialState: CheckoutState = {
  isLoading: false,
  error: null,
  data: {
    shippingAddress: null,
    billingAddress: null,
    paymentMethod: null,
    orderId: null
  },
  step: "shipping"
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  ...initialState,

  setShippingAddress: (address) =>
    set((state) => ({
      data: { ...state.data, shippingAddress: address }
    })),

  setBillingAddress: (address) =>
    set((state) => ({
      data: { ...state.data, billingAddress: address }
    })),

  setPaymentMethod: (method) =>
    set((state) => ({
      data: { ...state.data, paymentMethod: method }
    })),

  setStep: (step) => set({ step }),

  completeOrder: async () => {
    set({ isLoading: true, error: null })
    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const orderId = `ORDER-${Date.now()}`
      set({
        data: { ...initialState.data, orderId },
        step: "complete",
        isLoading: false
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Order failed",
        isLoading: false
      })
    }
  },

  reset: () => set(initialState)
}))
```

---

## Paso 6: Crear Componentes UI con shadcn

### 6.1 Instalar Componentes Necesarios

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add toast
```

### 6.2 Crear Componente de Login

Crea `app/modules/authentication/components/login-form.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useAuthenticationStore } from '../store/authentication.store'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAuthenticationStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
    } catch (error) {
      console.error('Login failed', error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login to TechStore</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
```

### 6.3 Crear Componente de Producto

Crea `app/modules/products/components/product-card.tsx`:

```typescript
'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Product } from '../types/products.types'
import { useShoppingCartStore } from '@/modules/shopping-cart'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useShoppingCartStore()

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">${product.price}</span>
          <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

## Paso 7: Crear Páginas

### 7.1 Página de Inicio

Edita `app/page.tsx`:

```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold mb-4">Welcome to TechStore</h1>
      <p className="text-xl text-gray-600 mb-8">
        Your one-stop shop for all tech products
      </p>
      <div className="flex gap-4">
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline">Login</Button>
        </Link>
      </div>
    </div>
  )
}
```

### 7.2 Página de Productos

Crea `app/products/page.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { useProductsStore } from '@/modules/products'
import { ProductCard } from '@/modules/products/components/product-card'

export default function ProductsPage() {
  const { data, isLoading, fetchProducts } = useProductsStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (isLoading) {
    return <div className="p-8">Loading products...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### 7.3 Página de Login

Crea `app/login/page.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/modules/authentication/components/login-form'
import { useAuthenticationStore } from '@/modules/authentication'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthenticationStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/products')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <LoginForm />
    </div>
  )
}
```

---

## Paso 8: Configurar Layout Global

Edita `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechStore - E-commerce',
  description: 'Your one-stop shop for tech products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">TechStore</h1>
            <div className="flex gap-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/products" className="hover:underline">Products</a>
              <a href="/cart" className="hover:underline">Cart</a>
              <a href="/login" className="hover:underline">Login</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

---

## Paso 9: Testing

### 9.1 Ejecutar el Proyecto

```bash
bun dev
```

### 9.2 Verificar Funcionalidades

1. ✅ Navegar a <http://localhost:3000>
2. ✅ Ver página de inicio
3. ✅ Ir a /products
4. ✅ Agregar productos al carrito
5. ✅ Ir a /login y probar login

---

## Paso 10: Build y Docker

### 10.1 Build de Producción

```bash
bun run build
```

### 10.2 Ejecutar con Docker Dev

```bash
docker-compose -f docker-compose.dev.yml up
```

### 10.3 Build para Producción con Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Estructura Final del Proyecto

```
techstore/
├── app/
│   ├── modules/
│   │   ├── authentication/
│   │   │   ├── components/
│   │   │   │   └── login-form.tsx
│   │   │   ├── containers/
│   │   │   ├── services/
│   │   │   │   └── authentication.service.ts
│   │   │   ├── store/
│   │   │   │   └── authentication.store.ts
│   │   │   ├── types/
│   │   │   │   └── authentication.types.ts
│   │   │   └── index.ts
│   │   ├── products/
│   │   │   ├── components/
│   │   │   │   └── product-card.tsx
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── shopping-cart/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   └── checkout/
│   │       ├── store/
│   │       ├── types/
│   │       └── index.ts
│   ├── products/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/           ← shadcn components
├── lib/
├── public/
├── .husky/           ← Git hooks
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Próximos Pasos

### Mejoras Recomendadas

1. **Agregar Tests**

   ```bash
   # Instalar Vitest
   bun add -D vitest @testing-library/react @testing-library/jest-dom

   # Crear tests para servicios
   touch app/modules/authentication/__tests__/authentication.service.test.ts
   ```

2. **Agregar Validación de Formularios**

   ```bash
   npx shadcn@latest add form
   bun add react-hook-form zod @hookform/resolvers
   ```

3. **Agregar Notificaciones**

   ```bash
   npx shadcn@latest add toast
   npx shadcn@latest add sonner
   ```

4. **Configurar Variables de Entorno**

   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_STRIPE_KEY=pk_test_...
   ```

5. **Deploy**
   - Vercel: `vercel deploy`
   - Docker: Push a registry y deploy en servidor

---

## Troubleshooting

### Error: Module not found

```bash
# Verificar que los paths están correctos en tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: Zustand not installed

```bash
bun add zustand
```

### Error: shadcn components not found

```bash
npx shadcn@latest init
```

---

## Recursos Adicionales

- [Screaming Architecture](../04-arquitectura/screaming-architecture.md)
- [Mejores Prácticas](./mejores-practicas.md)
- [Comando init](../03-comandos/init.md)
- [Comando module](../03-comandos/module.md)

---

**Felicitaciones!** Has creado una aplicación e-commerce completa usando AvangCLI. Ahora puedes extenderla con más módulos, agregar tests, y deployar a producción.
