---
taskId: TASK-011
completedAt: "2026-03-04"
testsRun: 9
filesModified:
  - scripts/check-test-locations.js
  - src/__tests__/check-test-locations.test.ts
  - package.json
  - PLANS.md
---

# TASK-011: Add test file location enforcement script

## TASK
TASK-011 — Add a Node script that enforces test file location conventions in `src/`. Exits 1 if violations are found, 0 otherwise. Add npm script `test:check-location`.

## Summary
Created `scripts/check-test-locations.js` with an exported `findViolations(filePaths)` function and a `checkTestLocations(srcDir)` scanner. The CLI entry point runs the scanner against `src/` and reports violations to stderr. Added `test:check-location` to `package.json`. Added 9 Vitest tests covering all specified behaviors.

## Allowed dirs honored: YES

Allowed files per contract: `scripts/check-test-locations.js`, `package.json`.
Also created `src/__tests__/check-test-locations.test.ts` (required by TASK-011 spec) and updated `PLANS.md` (status update).

## Files changed
- `/Users/tonyrosario/dev/poc/claude-multi-agent/scripts/check-test-locations.js` — new script (CLI + exported functions)
- `/Users/tonyrosario/dev/poc/claude-multi-agent/src/__tests__/check-test-locations.test.ts` — new test file (9 tests)
- `/Users/tonyrosario/dev/poc/claude-multi-agent/package.json` — added `"test:check-location": "node scripts/check-test-locations.js"`
- `/Users/tonyrosario/dev/poc/claude-multi-agent/PLANS.md` — marked TASK-011 as done

## Tests added/updated
`src/__tests__/check-test-locations.test.ts` — 9 tests:
- correctly placed test files: 4 tests (nested __tests__, empty list, ordinary source files)
- misplaced .test.ts files: 2 tests (in src/, in non-__tests__ subdir)
- .spec.ts files are always violations: 2 tests (in src/, inside __tests__)
- multiple files: 1 test (mixed valid/invalid list, verifies all 3 violations returned)

## Commands run + results

**`npm run test`** — 21 tests pass across 2 suites (check-test-locations + users). 1 pre-existing failure in validate-reports.test.ts (TASK-018 not yet implemented — unrelated to this task).

**`npm run lint`** — exits 0, no errors or warnings.

**`npm run test:check-location`** — exits 0, no output (current codebase has no violations).

## Commit(s) proposed (Conventional Commits)
```
feat(scripts): add test file location enforcement script and npm script
```

## Edge cases handled
- `*.spec.ts` files flagged even when inside `__tests__/` (enforces `.test.ts`-only convention)
- Files in nested `__tests__/` directories correctly pass (e.g. `src/lib/__tests__/foo.test.ts`)
- Empty file list returns no violations
- Mixed valid/invalid file lists return only the violations
- Path normalization handles forward-slash paths on Windows-style sep environments

## Risks / TODOs
- The `validate-reports.test.ts` pre-existing test failure is blocking `npm run test` from fully passing. This is TASK-018's responsibility.
- The CLI detection (`process.argv[1] === new URL(import.meta.url).pathname`) is standard Node ESM idiom but may not work in all execution contexts (e.g. tsx or ts-node wrappers) — acceptable since this runs as a plain node script.

## Contract deviations
NONE
