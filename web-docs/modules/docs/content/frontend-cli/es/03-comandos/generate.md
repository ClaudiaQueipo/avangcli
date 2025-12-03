# Comando: generate

## Descripción

El comando `generate` genera clientes TypeScript desde especificaciones OpenAPI. Escanea un directorio en busca de archivos JSON de OpenAPI y crea automáticamente código de cliente con tipos seguros para el consumo de APIs.

## Sintaxis

```bash
avangcli generate [opciones]
```

## Opciones

| Opción                | Alias | Descripción                                      | Predeterminado |
| --------------------- | ----- | ------------------------------------------------ | -------------- |
| `--docs-dir <ruta>`   | `-d`  | Directorio que contiene archivos JSON de OpenAPI | `./docs`       |
| `--output-dir <ruta>` | `-o`  | Directorio de salida para los clientes generados | `./generated`  |

## ¿Qué Hace el Comando?

El comando realiza los siguientes pasos:

### 1. Verificación de Configuración

- Verifica si existe la configuración del proyecto (`avangclirc.json`)
- Si no se encuentra, ejecuta automáticamente el comando `config`

### 2. Escaneo de Directorio

- Busca archivos JSON de OpenAPI en el directorio de documentos especificado
- Solo soporta archivos `.json`
- Valida que exista al menos un archivo OpenAPI

### 3. Generación de Clientes

- Procesa cada archivo de especificación OpenAPI
- Genera interfaces TypeScript y funciones de cliente
- Crea clientes API con tipos seguros para todos los endpoints

### 4. Organización de Salida

- Crea el directorio de salida si no existe
- Organiza los archivos generados por especificación de API
- Proporciona retroalimentación de progreso durante la generación

## Ejemplos de Uso

### Ejemplo 1: Generar con Configuraciones Predeterminadas

```bash
cd my-nextjs-project
avangcli generate
```

Esto hará:

- Buscar archivos OpenAPI en `./docs/`
- Generar clientes en `./generated/`

### Ejemplo 2: Directorios Personalizados

```bash
avangcli generate --docs-dir ./api-specs --output-dir ./src/clients
```

Esto hará:

- Escanear `./api-specs/` en busca de archivos OpenAPI
- Generar clientes en `./src/clients/`

### Ejemplo 3: Usando Opciones Cortas

```bash
avangcli generate -d ./openapi -o ./lib/api
```

## Salida Generada

El comando genera archivos TypeScript para cada especificación OpenAPI, organizados en subdirectorios:

- **types.ts**: Interfaces y tipos TypeScript para todos los esquemas definidos en la especificación OpenAPI
- **service.ts**: Clase de servicio singleton con métodos con tipos seguros para todos los endpoints de la API

### Estructura de Directorios

```
generated/
├── nombre-carpeta-api/
│   ├── types.ts       # Interfaces y tipos generados
│   └── service.ts     # Clase de servicio API con métodos
├── otra-carpeta-api/
│   ├── types.ts
│   └── service.ts
```

### Nomenclatura de Carpetas

El nombre de la carpeta se determina por:

1. Etiquetas de operaciones OpenAPI (primera etiqueta no "default")
2. Título de la API de la sección info de OpenAPI
3. Retrocede a "api-client" si no hay ninguno disponible

### Archivos Generados

**types.ts** contiene:

- Interfaces TypeScript para todos los `components.schemas`
- Tipos enum para enums de esquemas
- Definiciones de tipos apropiadas con nulabilidad y opcionalidad

**service.ts** contiene:

- Clase de servicio singleton con URL base configurable
- Métodos con tipos seguros para cada operación HTTP (GET, POST, PUT, DELETE, PATCH)
- Manejo automático de parámetros (path, query, body)
- Manejo de errores y análisis de respuestas

## Requisitos

- Proyecto Next.js válido con `avangclirc.json`
- Archivos JSON de OpenAPI en el directorio especificado
- Permisos de escritura para el directorio de salida

## Integración con Tu Proyecto

Después de la generación, puedes importar y usar los servicios generados:

```typescript
import { UsersService } from "@/generated/users-api/service"
import { ProductsService } from "@/generated/products-api/service"

// Obtener instancias singleton
const usersService = UsersService.getInstance({ baseURL: "https://api.example.com" })
const productsService = ProductsService.getInstance()

// Llamadas API con tipos seguros
const users = await usersService.getUsers()
const product = await productsService.createProduct(productData)
```

## Tips y Notas

### Formato de Especificación OpenAPI

Asegúrate de que tus archivos OpenAPI sigan la especificación OpenAPI 3.0+. La herramienta soporta:

- Formato JSON únicamente (YAML no soportado)
- Estructura OpenAPI estándar
- Esquemas de autenticación
- Esquemas de solicitud/respuesta

### Nomenclatura de Archivos

- Usa nombres descriptivos para tus archivos OpenAPI
- Los nombres de los clientes generados se derivan de los nombres de archivo
- Ejemplo: `users-api.json` → clase `UsersApi`

### Manejo de Errores

El comando omitirá archivos que fallen al procesarse pero continuará con otros. Revisa la salida para advertencias sobre errores de procesamiento de archivos individuales.

## Troubleshooting

### Error: "No OpenAPI JSON files found"

**Causa:** No hay archivos `.json` en el directorio de documentos

**Solución:**

```bash
# Verificar contenido del directorio
ls -la docs/

# Asegurar que los archivos tengan extensión .json
# Mover o renombrar archivos si es necesario
mv api-spec.yaml docs/api-spec.json
avangcli generate
```

### Error: "Docs directory not found"

**Causa:** El directorio de documentos especificado no existe

**Solución:**

```bash
# Crear directorio
mkdir -p docs

# O usar directorio existente
avangcli generate --docs-dir ./existing-api-docs
```

### Error: "Failed to process OpenAPI file"

**Causa:** Especificación OpenAPI inválida

**Solución:**

```bash
# Validar tu archivo OpenAPI
npx @apidevtools/swagger-parser validate docs/api.json

# Corregir errores de validación
# Luego regenerar
avangcli generate
```

### Errores de Permisos

**Causa:** No se puede escribir en el directorio de salida

**Solución:**

```bash
# Verificar permisos
ls -ld generated/

# Corregir permisos
chmod 755 generated/
avangcli generate
```

## Recursos Relacionados

- [Comando config](./config.md)
- [Comando init](./init.md)
- [Especificación OpenAPI](https://swagger.io/specification/)
