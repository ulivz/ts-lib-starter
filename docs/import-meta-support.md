# Import.meta Support in Dual ESM/CJS Libraries

This document explains how to use `import.meta` in TypeScript libraries that target both ESM and CommonJS output formats.

## Problem

When building libraries that output both ESM and CJS formats, using `import.meta` directly causes TypeScript compilation errors:

1. **TS1343**: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', 'node18', or 'nodenext'
2. **TS1470**: 'import.meta' meta-property is not allowed in files which will build into CommonJS output

## Solution

This template provides a complete solution that:

1. **Updates TypeScript Configuration**: Uses `"module": "es2022"` to support `import.meta`
2. **Provides Safe Utilities**: Uses dynamic evaluation to avoid compilation issues
3. **Maintains Dual Output**: Works with both ESM and CJS builds

### TypeScript Configuration Changes

```json
{
  "compilerOptions": {
    "module": "es2022",
    "target": "ES2022",
    "lib": ["es2022", "dom"]
  }
}
```

### Safe Import.meta Usage

The `meta-utils.ts` module provides safe functions for accessing `import.meta`:

```typescript
import { getModuleUrl, resolveModule, hasImportMeta } from './meta-utils';

// Get current module URL
const moduleUrl = getModuleUrl();
console.log('Module URL:', moduleUrl);

// Resolve module specifiers
const resolved = resolveModule('./relative-module');
console.log('Resolved:', resolved);

// Check if import.meta is available
if (hasImportMeta()) {
  console.log('Running in ESM environment');
} else {
  console.log('Running in CJS environment');
}
```

## How It Works

### Dynamic Evaluation Technique

The key technique is using indirect `eval` to access `import.meta`:

```typescript
function getImportMeta(): ImportMeta | undefined {
  try {
    // Use indirect eval to avoid compilation issues in CJS builds
    return (0, eval)('import.meta');
  } catch {
    return undefined;
  }
}
```

This approach:
- Avoids TypeScript compilation errors
- Works in both ESM and CJS environments
- Provides graceful fallbacks

### Build Output

- **ESM Build**: `import.meta` works natively
- **CJS Build**: Falls back to alternative approaches (e.g., `__filename`)

## Best Practices

1. **Always Use Utilities**: Don't use `import.meta` directly in library code
2. **Provide Fallbacks**: Ensure CJS environments have reasonable alternatives
3. **Test Both Formats**: Verify functionality in both ESM and CJS builds
4. **Document Behavior**: Make it clear how functions behave in different environments

## Migration Guide

If you have existing code using `import.meta`:

1. Replace direct `import.meta.url` with `getModuleUrl()`
2. Replace direct `import.meta.resolve()` with `resolveModule()`
3. Add conditional logic using `hasImportMeta()` if needed
4. Update your TypeScript configuration as shown above

## Testing

The solution includes comprehensive tests that verify:
- Functions work in test environments
- Proper fallback behavior
- Type safety

Run tests with:
```bash
npm test
```

## Build Verification

Verify both formats build correctly:
```bash
npm run build
```

This should generate both `dist/index.mjs` (ESM) and `dist/index.js` (CJS) without errors.
