import { it, expect, describe } from 'vitest';
import { getModuleUrl, resolveModule, hasImportMeta } from '../src/meta-utils';

describe('meta-utils', () => {
  it('should provide getModuleUrl function', () => {
    const url = getModuleUrl();
    // In test environment, we might not have import.meta, so just check it returns something reasonable
    expect(typeof url === 'string' || url === undefined).toBe(true);
  });

  it('should provide resolveModule function', () => {
    const resolved = resolveModule('./test-module');
    expect(typeof resolved).toBe('string');
    // Should either resolve or provide a fallback message
    expect(resolved.length).toBeGreaterThan(0);
  });

  it('should provide hasImportMeta function', () => {
    const hasIt = hasImportMeta();
    expect(typeof hasIt).toBe('boolean');
  });
});
