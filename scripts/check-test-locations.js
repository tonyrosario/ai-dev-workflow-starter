// @ts-check
import { readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

/**
 * Recursively collect all files under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function collectFiles(dir) {
  const entries = readdirSync(dir);
  const results = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Determine whether a file path is inside a `__tests__` directory segment.
 * @param {string} filePath
 * @returns {boolean}
 */
function isInsideTestsDir(filePath) {
  const parts = filePath.split(sep);
  return parts.includes('__tests__');
}

/**
 * Find test files that violate location conventions:
 * - `*.test.ts` files not inside a `__tests__/` directory
 * - `*.spec.ts` files anywhere (spec extension is not allowed)
 *
 * @param {string[]} filePaths - List of absolute or relative file paths to check
 * @returns {string[]} Offending file paths
 */
export function findViolations(filePaths) {
  const violations = [];
  for (const filePath of filePaths) {
    const normalized = filePath.split('/').join(sep);
    if (normalized.endsWith('.spec.ts')) {
      violations.push(filePath);
    } else if (normalized.endsWith('.test.ts') && !isInsideTestsDir(normalized)) {
      violations.push(filePath);
    }
  }
  return violations;
}

/**
 * Scan `srcDir` recursively and return all test file violations.
 * @param {string} srcDir
 * @returns {string[]}
 */
export function checkTestLocations(srcDir) {
  const files = collectFiles(srcDir);
  return findViolations(files);
}

// CLI entry point — only runs when this file is executed directly.
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const srcDir = join(process.cwd(), 'src');
  const violations = checkTestLocations(srcDir);
  if (violations.length > 0) {
    for (const v of violations) {
      process.stderr.write(`Misplaced test file: ${v}\n`);
    }
    process.exit(1);
  }
  process.exit(0);
}
