/**
 * Agent report validation script.
 *
 * Validates YAML frontmatter in report files under reports/agents/.
 * Files without frontmatter (legacy reports) are skipped.
 *
 * Usage: node scripts/validate-reports.js
 * Exit 0: all files valid or all legacy (no frontmatter)
 * Exit 1: one or more validation errors found
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * @typedef {Object} Frontmatter
 * @property {string} taskId
 * @property {string} completedAt
 * @property {number} testsRun
 * @property {string[]} filesModified
 * @property {string} [justification]
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} field
 * @property {string} message
 */

const FRONTMATTER_OPEN = '---';

/**
 * Parses YAML frontmatter from file content.
 * Returns null if no frontmatter delimiters are found.
 *
 * @param {string} content
 * @returns {Frontmatter | null}
 */
export function parseFrontmatter(content) {
  const lines = content.split('\n');

  if (lines[0].trim() !== FRONTMATTER_OPEN) {
    return null;
  }

  const closingIndex = lines.findIndex((line, idx) => idx > 0 && line.trim() === FRONTMATTER_OPEN);

  if (closingIndex === -1) {
    return null;
  }

  const yamlLines = lines.slice(1, closingIndex);
  return parseSimpleYaml(yamlLines);
}

/**
 * Parses a minimal YAML subset sufficient for frontmatter.
 * Supports: string values, quoted strings, numbers, and
 * block sequences (arrays using "- item" notation).
 *
 * @param {string[]} lines
 * @returns {Record<string, unknown>}
 */
function parseSimpleYaml(lines) {
  /** @type {Record<string, unknown>} */
  const result = {};
  let currentKey = null;
  /** @type {string[] | null} */
  let currentArray = null;

  for (const line of lines) {
    const arrayItemMatch = line.match(/^(\s+)-\s+(.*)/);
    if (arrayItemMatch && currentKey !== null && currentArray !== null) {
      currentArray.push(arrayItemMatch[2].trim());
      continue;
    }

    if (currentKey !== null && currentArray !== null) {
      result[currentKey] = currentArray;
      currentKey = null;
      currentArray = null;
    }

    const kvMatch = line.match(/^([^:]+):\s*(.*)/);
    if (!kvMatch) {
      continue;
    }

    const key = kvMatch[1].trim();
    const rawValue = kvMatch[2].trim();

    if (rawValue === '') {
      currentKey = key;
      currentArray = [];
      continue;
    }

    result[key] = parseScalar(rawValue);
  }

  if (currentKey !== null && currentArray !== null) {
    result[currentKey] = currentArray;
  }

  return /** @type {Frontmatter} */ (result);
}

/**
 * Parses a scalar YAML value into a JS primitive.
 *
 * @param {string} raw
 * @returns {string | number | boolean | string[]}
 */
function parseScalar(raw) {
  if (raw.startsWith('[') && raw.endsWith(']')) {
    return parseInlineArray(raw);
  }

  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }

  const num = Number(raw);
  if (!isNaN(num) && raw !== '') {
    return num;
  }

  if (raw === 'true') return true;
  if (raw === 'false') return false;

  return raw;
}

/**
 * Parses a YAML inline array like `["foo", "bar"]` or `[foo, bar]`.
 *
 * @param {string} raw  The full bracket-wrapped string, e.g. `["a","b"]`
 * @returns {string[]}
 */
function parseInlineArray(raw) {
  const inner = raw.slice(1, -1).trim();
  if (inner === '') return [];
  return inner.split(',').map((item) => {
    const trimmed = item.trim();
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  });
}

/**
 * Validates a parsed frontmatter object and returns a list of errors.
 *
 * @param {Frontmatter} fm
 * @returns {ValidationError[]}
 */
export function validateFrontmatter(fm) {
  /** @type {ValidationError[]} */
  const errors = [];

  if (!fm.taskId || typeof fm.taskId !== 'string' || fm.taskId.trim() === '') {
    errors.push({ field: 'taskId', message: 'taskId must be a non-empty string' });
  }

  if (!fm.completedAt || typeof fm.completedAt !== 'string' || fm.completedAt.trim() === '') {
    errors.push({ field: 'completedAt', message: 'completedAt must be a non-empty string' });
  }

  if (fm.testsRun === undefined || fm.testsRun === null || typeof fm.testsRun !== 'number') {
    errors.push({ field: 'testsRun', message: 'testsRun must be a number >= 0' });
  } else if (fm.testsRun < 0) {
    errors.push({ field: 'testsRun', message: 'testsRun must be >= 0' });
  } else if (fm.testsRun === 0) {
    const justification = fm.justification;
    if (
      justification === undefined ||
      justification === null ||
      typeof justification !== 'string' ||
      justification.trim() === ''
    ) {
      errors.push({
        field: 'justification',
        message: 'justification is required (non-empty string) when testsRun is 0',
      });
    }
  }

  if (!Array.isArray(fm.filesModified) || fm.filesModified.length === 0) {
    errors.push({
      field: 'filesModified',
      message: 'filesModified must be a non-empty array',
    });
  }

  return errors;
}

/**
 * Reads all .md files from the given directory and validates those
 * that contain YAML frontmatter. Returns total error count.
 *
 * @param {string} reportsDir
 * @returns {number} number of validation errors found
 */
export function validateReportsDir(reportsDir) {
  let errorCount = 0;

  /** @type {string[]} */
  let files;
  try {
    files = readdirSync(reportsDir).filter((f) => f.endsWith('.md'));
  } catch {
    process.stderr.write(`Warning: could not read directory ${reportsDir}\n`);
    return 0;
  }

  for (const file of files) {
    const filePath = join(reportsDir, file);
    const content = readFileSync(filePath, 'utf8');
    const fm = parseFrontmatter(content);

    if (fm === null) {
      continue;
    }

    const errors = validateFrontmatter(fm);
    for (const err of errors) {
      process.stderr.write(`${filePath}: [${err.field}] ${err.message}\n`);
      errorCount++;
    }
  }

  return errorCount;
}

const REPORTS_DIR = resolve('reports/agents');

const isMain =
  process.argv[1] !== undefined &&
  (process.argv[1] === resolve('scripts/validate-reports.js') ||
    process.argv[1].endsWith('/scripts/validate-reports.js'));

if (isMain) {
  const totalErrors = validateReportsDir(REPORTS_DIR);
  if (totalErrors > 0) {
    process.stderr.write(`\nValidation failed: ${totalErrors} error(s) found.\n`);
    process.exit(1);
  } else {
    process.stdout.write('All agent reports are valid.\n');
    process.exit(0);
  }
}
