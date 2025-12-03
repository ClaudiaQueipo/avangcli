# Command: generate

## Description

The `generate` command generates TypeScript clients from OpenAPI specifications. It scans a directory for OpenAPI JSON files and automatically creates type-safe client code for API consumption.

## Syntax

```bash
avangcli generate [options]
```

## Options

| Option                | Alias | Description                             | Default       |
| --------------------- | ----- | --------------------------------------- | ------------- |
| `--docs-dir <path>`   | `-d`  | Directory containing OpenAPI JSON files | `./docs`      |
| `--output-dir <path>` | `-o`  | Output directory for generated clients  | `./generated` |

## What Does the Command Do?

The command performs the following steps:

### 1. Configuration Check

- Verifies if project configuration exists (`avangclirc.json`)
- If not found, runs the `config` command automatically

### 2. Directory Scanning

- Searches for OpenAPI JSON files in the specified docs directory
- Supports `.json` files only
- Validates that at least one OpenAPI file exists

### 3. Client Generation

- Processes each OpenAPI specification file
- Generates TypeScript interfaces and client functions
- Creates type-safe API clients for all endpoints

### 4. Output Organization

- Creates the output directory if it doesn't exist
- Organizes generated files by API specification
- Provides progress feedback during generation

## Usage Examples

### Example 1: Generate with Default Settings

```bash
cd my-nextjs-project
avangcli generate
```

This will:

- Look for OpenAPI files in `./docs/`
- Generate clients in `./generated/`

### Example 2: Custom Directories

```bash
avangcli generate --docs-dir ./api-specs --output-dir ./src/clients
```

This will:

- Scan `./api-specs/` for OpenAPI files
- Output generated clients to `./src/clients/`

### Example 3: Using Short Options

```bash
avangcli generate -d ./openapi -o ./lib/api
```

## Generated Output

The command generates TypeScript files for each OpenAPI specification, organized in subdirectories:

- **types.ts**: TypeScript interfaces and types for all schemas defined in the OpenAPI spec
- **service.ts**: Singleton service class with type-safe methods for all API endpoints

### Directory Structure

```
generated/
├── api-folder-name/
│   ├── types.ts       # Generated interfaces and types
│   └── service.ts     # API service class with methods
├── another-api-folder/
│   ├── types.ts
│   └── service.ts
```

### Folder Naming

The folder name is determined by:

1. OpenAPI operation tags (first non-"default" tag)
2. API title from the OpenAPI info section
3. Falls back to "api-client" if none available

### Generated Files

**types.ts** contains:

- TypeScript interfaces for all `components.schemas`
- Enum types for schema enums
- Proper type definitions with nullability and optionality

**service.ts** contains:

- Singleton service class with configurable base URL
- Type-safe methods for each HTTP operation (GET, POST, PUT, DELETE, PATCH)
- Automatic parameter handling (path, query, body)
- Error handling and response parsing

## Requirements

- Valid Next.js project with `avangclirc.json`
- OpenAPI JSON files in the specified directory
- Write permissions for the output directory

## Integration with Your Project

After generation, you can import and use the generated services:

```typescript
import { UsersService } from "@/generated/users-api/service"
import { ProductsService } from "@/generated/products-api/service"

// Get singleton instances
const usersService = UsersService.getInstance({ baseURL: "https://api.example.com" })
const productsService = ProductsService.getInstance()

// Type-safe API calls
const users = await usersService.getUsers()
const product = await productsService.createProduct(productData)
```

## Tips and Notes

### OpenAPI Specification Format

Ensure your OpenAPI files follow the OpenAPI 3.0+ specification. The tool supports:

- JSON format only (YAML not supported)
- Standard OpenAPI structure
- Authentication schemes
- Request/response schemas

### File Naming

- Use descriptive names for your OpenAPI files
- The generated client names are derived from the file names
- Example: `users-api.json` → `UsersApi` class

### Error Handling

The command will skip files that fail to process but continue with others. Check the output for warnings about individual file processing errors.

## Troubleshooting

### Error: "No OpenAPI JSON files found"

**Cause:** No `.json` files in the docs directory

**Solution:**

```bash
# Check directory contents
ls -la docs/

# Ensure files have .json extension
# Move or rename files if needed
mv api-spec.yaml docs/api-spec.json
avangcli generate
```

### Error: "Docs directory not found"

**Cause:** Specified docs directory doesn't exist

**Solution:**

```bash
# Create directory
mkdir -p docs

# Or use existing directory
avangcli generate --docs-dir ./existing-api-docs
```

### Error: "Failed to process OpenAPI file"

**Cause:** Invalid OpenAPI specification

**Solution:**

```bash
# Validate your OpenAPI file
npx @apidevtools/swagger-parser validate docs/api.json

# Fix validation errors
# Then regenerate
avangcli generate
```

### Permission Errors

**Cause:** Cannot write to output directory

**Solution:**

```bash
# Check permissions
ls -ld generated/

# Fix permissions
chmod 755 generated/
avangcli generate
```

## Related Resources

- [Config command](./config.md)
- [Init command](./init.md)
- [OpenAPI Specification](https://swagger.io/specification/)
