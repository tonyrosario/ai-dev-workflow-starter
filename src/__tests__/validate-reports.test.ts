import { describe, it, expect } from 'vitest';
import {
  parseFrontmatter,
  validateFrontmatter,
  type Frontmatter,
  type ValidationError,
} from '../../scripts/validate-reports.js';

describe('parseFrontmatter', () => {
  it('returns null when file content has no frontmatter delimiters', () => {
    const content = '# My Report\n\nSome content here.';
    expect(parseFrontmatter(content)).toBeNull();
  });

  it('returns null when content starts with text before the opening ---', () => {
    const content = 'Some text\n---\ntaskId: TASK-001\n---\n# Report';
    expect(parseFrontmatter(content)).toBeNull();
  });

  it('returns parsed object when valid YAML frontmatter is present', () => {
    const content = [
      '---',
      'taskId: TASK-001',
      'completedAt: "2026-03-04"',
      'testsRun: 5',
      'filesModified:',
      '  - src/foo.ts',
      '---',
      '# Report body',
    ].join('\n');
    const result = parseFrontmatter(content);
    expect(result).not.toBeNull();
    expect(result?.taskId).toBe('TASK-001');
    expect(result?.completedAt).toBe('2026-03-04');
    expect(result?.testsRun).toBe(5);
    expect(result?.filesModified).toEqual(['src/foo.ts']);
  });

  it('returns null when closing --- delimiter is missing', () => {
    const content = '---\ntaskId: TASK-001\n# Report body';
    expect(parseFrontmatter(content)).toBeNull();
  });

  it('parses inline array notation for filesModified', () => {
    const content = [
      '---',
      'taskId: TASK-017',
      'completedAt: "2026-03-04"',
      'testsRun: 0',
      'filesModified: [".lintstagedrc"]',
      'justification: Config-only task.',
      '---',
      '# Report body',
    ].join('\n');
    const result = parseFrontmatter(content);
    expect(result).not.toBeNull();
    expect(result?.filesModified).toEqual(['.lintstagedrc']);
  });

  it('parses inline array with multiple items', () => {
    const content = [
      '---',
      'taskId: TASK-001',
      'completedAt: "2026-03-04"',
      'testsRun: 2',
      'filesModified: ["src/foo.ts", "src/bar.ts"]',
      '---',
      '# Report body',
    ].join('\n');
    const result = parseFrontmatter(content);
    expect(result?.filesModified).toEqual(['src/foo.ts', 'src/bar.ts']);
  });
});

describe('validateFrontmatter', () => {
  function getMockFrontmatter(overrides: Partial<Frontmatter> = {}): Frontmatter {
    return {
      taskId: 'TASK-018',
      completedAt: '2026-03-04',
      testsRun: 3,
      filesModified: ['scripts/validate-reports.js'],
      ...overrides,
    };
  }

  function getErrors(fm: Partial<Frontmatter>): ValidationError[] {
    return validateFrontmatter(fm as Frontmatter);
  }

  describe('valid frontmatter', () => {
    it('returns empty array when all required fields are present and valid', () => {
      const errors = validateFrontmatter(getMockFrontmatter());
      expect(errors).toHaveLength(0);
    });

    it('returns empty array when testsRun is 0 and justification is provided', () => {
      const errors = validateFrontmatter(
        getMockFrontmatter({ testsRun: 0, justification: 'Config-only task, no logic to test.' }),
      );
      expect(errors).toHaveLength(0);
    });

    it('returns empty array when testsRun > 0 and no justification is present', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ testsRun: 5 }));
      expect(errors).toHaveLength(0);
    });
  });

  describe('missing required fields', () => {
    it('returns error for missing taskId', () => {
      const errors = getErrors({ ...getMockFrontmatter(), taskId: undefined as unknown as string });
      expect(errors.some((e) => e.field === 'taskId')).toBe(true);
    });

    it('returns error for empty taskId string', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ taskId: '' }));
      expect(errors.some((e) => e.field === 'taskId')).toBe(true);
    });

    it('returns error for missing completedAt', () => {
      const errors = getErrors({
        ...getMockFrontmatter(),
        completedAt: undefined as unknown as string,
      });
      expect(errors.some((e) => e.field === 'completedAt')).toBe(true);
    });

    it('returns error for empty completedAt string', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ completedAt: '' }));
      expect(errors.some((e) => e.field === 'completedAt')).toBe(true);
    });

    it('returns error when testsRun is missing', () => {
      const errors = getErrors({
        ...getMockFrontmatter(),
        testsRun: undefined as unknown as number,
      });
      expect(errors.some((e) => e.field === 'testsRun')).toBe(true);
    });

    it('returns error when testsRun is negative', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ testsRun: -1 }));
      expect(errors.some((e) => e.field === 'testsRun')).toBe(true);
    });

    it('returns error when filesModified is missing', () => {
      const errors = getErrors({
        ...getMockFrontmatter(),
        filesModified: undefined as unknown as string[],
      });
      expect(errors.some((e) => e.field === 'filesModified')).toBe(true);
    });

    it('returns error when filesModified is an empty array', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ filesModified: [] }));
      expect(errors.some((e) => e.field === 'filesModified')).toBe(true);
    });
  });

  describe('testsRun: 0 justification rule', () => {
    it('returns error when testsRun is 0 and justification is absent', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ testsRun: 0 }));
      expect(errors.some((e) => e.field === 'justification')).toBe(true);
    });

    it('returns error when testsRun is 0 and justification is an empty string', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ testsRun: 0, justification: '' }));
      expect(errors.some((e) => e.field === 'justification')).toBe(true);
    });

    it('returns error when testsRun is 0 and justification is whitespace only', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ testsRun: 0, justification: '   ' }));
      expect(errors.some((e) => e.field === 'justification')).toBe(true);
    });

    it('passes when testsRun is 0 and justification is a non-empty string', () => {
      const errors = validateFrontmatter(
        getMockFrontmatter({ testsRun: 0, justification: 'No testable logic in this task.' }),
      );
      expect(errors.some((e) => e.field === 'justification')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns multiple errors when multiple fields are invalid', () => {
      const errors = getErrors({
        taskId: '',
        completedAt: '',
        testsRun: undefined as unknown as number,
        filesModified: [],
      });
      expect(errors.length).toBeGreaterThan(1);
    });

    it('does not require justification when testsRun is greater than 0', () => {
      const errors = validateFrontmatter(getMockFrontmatter({ testsRun: 1 }));
      expect(errors.some((e) => e.field === 'justification')).toBe(false);
    });
  });
});
