/**
 * Utility functions for handling import.meta in dual ESM/CJS environments
 * 
 * These functions provide safe access to import.meta properties while
 * maintaining compatibility with both ESM and CommonJS output formats.
 */

/**
 * Helper function to safely access import.meta
 * Uses dynamic evaluation to avoid TypeScript compilation issues
 * when targeting CommonJS output
 */
function getImportMeta(): ImportMeta | undefined {
  try {
    // Use indirect eval to avoid compilation issues in CJS builds
    return (0, eval)('import.meta');
  } catch {
    return undefined;
  }
}

/**
 * Get the current module URL
 * 
 * @returns The module URL in ESM environments, or a fallback in CJS
 */
export function getModuleUrl(): string | undefined {
  const meta = getImportMeta();
  if (meta && meta.url) {
    return meta.url;
  }
  
  // Fallback for CJS environments
  if (typeof __filename !== 'undefined') {
    return `file://${__filename}`;
  }
  
  return undefined;
}

/**
 * Resolve a module specifier relative to the current module
 * 
 * @param specifier - The module specifier to resolve
 * @returns The resolved URL in ESM environments, or an error message in CJS
 */
export function resolveModule(specifier: string): string {
  const meta = getImportMeta();
  if (meta && meta.resolve) {
    try {
      return meta.resolve(specifier);
    } catch (error) {
      return `Failed to resolve ${specifier}: ${error}`;
    }
  }
  
  // Fallback for CJS environments
  return `Module resolution not available in CJS environment for: ${specifier}`;
}

/**
 * Check if the current environment supports import.meta
 * 
 * @returns true if import.meta is available, false otherwise
 */
export function hasImportMeta(): boolean {
  return getImportMeta() !== undefined;
}
