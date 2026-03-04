import { describe, it, expect } from 'vitest';
import { findViolations } from '../check-test-locations.js';

describe('findViolations', () => {
  describe('correctly placed test files', () => {
    it('returns no violations for a .test.ts file inside __tests__/', () => {
      const files = ['src/__tests__/foo.test.ts'];
      expect(findViolations(files)).toEqual([]);
    });

    it('returns no violations for a .test.ts file in a nested __tests__/ directory', () => {
      const files = ['src/lib/__tests__/bar.test.ts'];
      expect(findViolations(files)).toEqual([]);
    });

    it('returns no violations for ordinary source files', () => {
      const files = ['src/users.ts', 'src/utils.ts'];
      expect(findViolations(files)).toEqual([]);
    });

    it('returns no violations for an empty file list', () => {
      expect(findViolations([])).toEqual([]);
    });
  });

  describe('misplaced .test.ts files', () => {
    it('flags a .test.ts file directly in src/', () => {
      const files = ['src/foo.test.ts'];
      expect(findViolations(files)).toEqual(['src/foo.test.ts']);
    });

    it('flags a .test.ts file in a non-__tests__ subdirectory', () => {
      const files = ['src/lib/foo.test.ts'];
      expect(findViolations(files)).toEqual(['src/lib/foo.test.ts']);
    });
  });

  describe('.spec.ts files are always violations', () => {
    it('flags a .spec.ts file directly in src/', () => {
      const files = ['src/foo.spec.ts'];
      expect(findViolations(files)).toEqual(['src/foo.spec.ts']);
    });

    it('flags a .spec.ts file even when inside __tests__/', () => {
      const files = ['src/__tests__/foo.spec.ts'];
      expect(findViolations(files)).toEqual(['src/__tests__/foo.spec.ts']);
    });
  });

  describe('multiple files', () => {
    it('returns all violations when multiple files are misplaced', () => {
      const files = [
        'src/__tests__/ok.test.ts',
        'src/bad.test.ts',
        'src/also-bad.spec.ts',
        'src/__tests__/spec-bad.spec.ts',
      ];
      const violations = findViolations(files);
      expect(violations).toContain('src/bad.test.ts');
      expect(violations).toContain('src/also-bad.spec.ts');
      expect(violations).toContain('src/__tests__/spec-bad.spec.ts');
      expect(violations).not.toContain('src/__tests__/ok.test.ts');
      expect(violations).toHaveLength(3);
    });
  });
});
