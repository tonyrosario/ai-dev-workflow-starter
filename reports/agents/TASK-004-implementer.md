# TASK-004 Implementation Report

- **TASK:** TASK-004 — Add commitlint to enforce Conventional Commits
- **Agent:** SONNET-A — Senior Engineer (Feature Slice Owner)
- **Date:** 2026-03-04

## Summary

Installed `@commitlint/cli` and `@commitlint/config-conventional` as devDependencies, created `commitlint.config.js` using ESM syntax (required by `"type": "module"` in package.json), and wired the commitlint check into a new Husky `commit-msg` hook. Validation confirms bad messages are rejected and well-formed Conventional Commit messages pass.

## Allowed dirs honored: YES

Allowed files per contract: `commitlint.config.js`, `.husky/commit-msg`, `package.json`. No other files were created or modified.

## Files changed

| File | Change |
|------|--------|
| `package.json` | Added `@commitlint/cli ^20.4.3` and `@commitlint/config-conventional ^20.4.3` to `devDependencies` (via `npm install -D`) |
| `commitlint.config.js` | Created — ESM export extending `@commitlint/config-conventional` |
| `.husky/commit-msg` | Created — runs `npx --no -- commitlint --edit $1`; set executable (`-rwxr-xr-x`) |

## Tests added/updated

No new unit tests were added. This task installs tooling that enforces policy at the git hook level. Behavior is validated via CLI invocation (see Commands section below). There is no application logic introduced that requires Vitest coverage.

## Commands run + results

### Install
```
npm install -D @commitlint/cli @commitlint/config-conventional
```
Result: Added 86 packages, 0 vulnerabilities.

### Validation — bad message (should fail)
```
echo "bad msg" | npx commitlint
```
Result:
```
⧗   input: bad msg
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 problems, 0 warnings
Exit code: 1
```
PASS — bad message rejected.

### Validation — valid message (should pass)
```
echo "feat: valid msg" | npx commitlint
```
Result: No output, exit code 0.
PASS — valid Conventional Commit accepted.

### File permissions
```
ls -la .husky/commit-msg
```
Result: `-rwxr-xr-x` — hook is executable.

### Lint check
```
npm run lint
```
Result: 0 errors, 1 pre-existing warning in coverage/ (not introduced by this task).

### Test suite
```
npm run test
```
Result: 12 tests passed, 0 failures.

## Commit(s) proposed (Conventional Commits)

```
chore(commitlint): add commitlint with Husky commit-msg hook
```

## Edge cases handled

- Used ESM `export default` syntax in `commitlint.config.js` because `package.json` declares `"type": "module"`. Using `module.exports` would cause a parse error.
- Used `npx --no --` in the hook to prevent npm from prompting for package installation if commitlint is somehow not installed, and to avoid argument injection.
- Hook file set executable (`chmod +x`) so Husky can invoke it on any Unix-like system.

## Risks / TODOs

- `@commitlint/cli ^20.4.3` is a major version ahead of the `^19.x` range commonly documented. No breaking changes observed; dependency resolved cleanly.
- The pre-existing ESLint warning in `coverage/lcov-report/block-navigation.js` is not introduced by this task and is out of scope.

## Contract deviations: NONE
