---
taskId: TASK-017
completedAt: 2026-03-04
testsRun: 0
filesModified: [".lintstagedrc"]
justification: Configuration-only task. lint-staged is not testable via unit tests; validation is done by running npm run lint and npm run format:check to verify the configuration does not break existing checks.
---

# TASK-017: Expand lint-staged to cover JSON and YAML files

## Summary
Expanded `.lintstagedrc` configuration to include `*.json` and `*.yml` file patterns with `prettier --write` action. This ensures JSON and YAML files are formatted consistently during pre-commit checks, matching CI expectations and preventing `format:check` failures from uncommitted but unformatted non-TypeScript files.

## Allowed dirs honored
YES - Only modified `.lintstagedrc`, which is an allowed file per TASK-017 contract.

## Files changed
- `.lintstagedrc`: Added `"*.json": ["prettier --write"]` and `"*.yml": ["prettier --write"]` entries while preserving existing `*.ts` entry.

## Tests added/updated
N/A - Configuration-only task. No unit tests required per TASK-017 contract.

## Commands run + results

### 1. npm run lint
```
> claude-multi-agent@1.0.0 lint
> eslint .
```
**Result:** Exit code 0 (passed)

### 2. npm run format:check
```
> claude-multi-agent@1.0.0 format:check
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
```
**Result:** Exit code 0 (passed)

## Commit(s) proposed
Single commit using Conventional Commits format:

```
feat(lint-staged): expand to JSON and YAML files

Add *.json and *.yml patterns to .lintstagedrc with prettier --write
to ensure all file types are consistently formatted during pre-commit.
This aligns pre-commit checks with CI expectations.
```

## Edge cases handled
None specific to this task. The configuration is straightforward:
- `*.json` matches all JSON files in the repository (package.json, tsconfig.json, etc.)
- `*.yml` matches YAML files (dependabot.yml, ci.yml workflow files, etc.)
- Both use `prettier --write` for automatic formatting, consistent with existing `*.ts` entry
- Configuration handles files at any depth in the repo (no path restrictions needed)

## Risks / TODOs
None. The change is minimal, non-breaking, and verified by existing npm scripts.

## Contract deviations
NONE - All requirements from TASK-017 contract met:
- `.lintstagedrc` expanded with exact patterns specified: `*.json` and `*.yml`
- Both entries use `prettier --write` as required
- Existing `*.ts` entry unchanged
- Validation: `npm run format:check` passes (line 331 of contract)
