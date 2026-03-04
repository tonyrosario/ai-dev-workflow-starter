# TASK-016: Add Dependabot configuration

## Summary

Created `.github/dependabot.yml` with Dependabot v2 configuration specifying:
- **npm ecosystem**: monthly cadence with 4 package groups (`eslint`, `vitest`, `husky-commitlint`, `typescript`)
- **github-actions ecosystem**: monthly cadence for action version monitoring
- **Target branch**: `main` for both ecosystems

The configuration enables automated dependency update PRs with grouped updates to reduce notification noise while keeping dependencies current.

## Allowed dirs honored

**YES** — Only created/modified `.github/dependabot.yml` which is within the allowed scope per TASK-016.

## Files changed

- `.github/dependabot.yml` (created)
- `PLANS.md` (status updated: `pending` → `done` for TASK-016)

## Tests added/updated

N/A — TASK-016 is configuration-only with no required tests per the acceptance criteria.

## Commands run + results

1. **npm run lint**
   ```
   > claude-multi-agent@1.0.0 lint
   > eslint .
   ```
   Result: ✓ Passed (no errors/warnings)

2. **npm run format:check**
   ```
   > claude-multi-agent@1.0.0 format:check
   > prettier --check .
   ```
   Result: ✗ Failed initially (Prettier issues in dependabot.yml)

3. **npm run format**
   ```
   > claude-multi-agent@1.0.0 format
   > prettier --write .
   ```
   Result: ✓ Fixed `.github/dependabot.yml` (converted double quotes to single quotes)

4. **npm run format:check** (retry)
   ```
   > claude-multi-agent@1.0.0 format:check
   > prettier --check .
   Checking formatting...
   All matched files use Prettier code style!
   ```
   Result: ✓ Passed

## Commit(s) proposed

No commits created per user instruction ("Do NOT commit").

Once approved, a single commit would be:
```
feat(dependabot): add Dependabot configuration with monthly cadence and package groups

- npm ecosystem: 4 package groups (eslint, vitest, husky-commitlint, typescript)
- github-actions ecosystem: monitor action versions
- Monthly schedule for both ecosystems
- Target branch: main

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## Edge cases handled

- **Valid YAML syntax**: File structure follows Dependabot v2 schema with proper indentation and nesting
- **Package group patterns**: Patterns use glob syntax (`@typescript-eslint/*`, `eslint*`, `@vitest/*`) to capture all related packages
- **Target branch specification**: Both ecosystems explicitly target `main` to prevent accidental PRs to other branches
- **Prettier formatting**: Applied Prettier formatting to ensure YAML conforms to project standards (single quotes in YAML strings)

## Risks / TODOs

- **No local Dependabot validation**: The Dependabot YAML schema cannot be locally validated; validation occurs when the configuration is pushed to GitHub and processed by the Dependabot service
- **Package group effectiveness**: Group patterns will only group packages that match the patterns; if package names change in future releases, patterns may need updating
- **Timing of first PR**: Dependabot will create its first update PR on the next scheduled run (monthly from first detection)

## Contract deviations

**NONE** — All acceptance criteria from TASK-016 met:
- File exists at `.github/dependabot.yml`
- Two ecosystem entries: `npm` and `github-actions`
- Monthly schedule for both
- 4 package groups defined for npm (eslint, vitest, husky-commitlint, typescript)
- Valid YAML syntax (passes Prettier and visual review)
