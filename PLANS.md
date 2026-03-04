# PLANS

> **Owner:** Architect (OPUS)
> **Last updated:** 2026-03-04 (Phase 2 — Quality Checks)
> **Purpose:** Active task registry for multi-agent execution. Single source of truth for ADRs, contracts, and tasks.

## Architecture Decisions

### ADR-001: Add Prettier + EditorConfig for formatting
- **Status:** Accepted
- **Context:** No formatter configured; style enforcement relies solely on ESLint.
- **Decision:** Add Prettier (with ESLint integration via eslint-config-prettier) and .editorconfig.
- **Consequences:** Consistent formatting across IDEs and CI. Requires eslint-config-prettier to avoid rule conflicts.

### ADR-002: Add pre-commit hooks with Husky + lint-staged
- **Status:** Accepted
- **Context:** Nothing prevents committing unlinted or unformatted code.
- **Decision:** Use Husky for git hooks and lint-staged to run checks on staged files only.
- **Consequences:** Fast pre-commit checks. Requires npm prepare script.

### ADR-003: Enforce Conventional Commits with commitlint
- **Status:** Accepted
- **Context:** Convention is documented but not enforced at the git level.
- **Decision:** Add @commitlint/cli + @commitlint/config-conventional, wired through Husky commit-msg hook.
- **Consequences:** Malformed commit messages are rejected before they enter history.

### ADR-004: GitHub Actions CI pipeline
- **Status:** Accepted
- **Context:** No automated quality gates on push/PR.
- **Decision:** Single `.github/workflows/ci.yml` running lint, typecheck, test with coverage, and build.
- **Consequences:** PRs cannot merge without passing all checks.

### ADR-005: Test file location enforcement via script
- **Status:** Accepted
- **Context:** Vitest `include` pattern only controls which tests run; misplaced test files silently exist without being caught.
- **Decision:** Add a Node script (`scripts/check-test-locations.js`) that rejects `*.test.ts` or `*.spec.ts` files outside `__tests__/` directories. Run in pre-commit hook and CI.
- **Consequences:** Misplaced test files are caught locally and in CI. Adds one script file and one CI step.

### ADR-006: ESLint complexity and quality rules
- **Status:** Accepted
- **Context:** No complexity limits enforced. Code can grow arbitrarily complex without warning.
- **Decision:** Add `complexity: ["error", 10]`, `max-depth: ["error", 3]`, `max-lines-per-function: ["warn", 40]` (excluded for test files), `max-params: ["warn", 3]`, and `no-magic-numbers` (excluded for test files, ignoring `[0, 1, -1]`).
- **Consequences:** Enforces readable, maintainable code. Test files are exempt from `max-lines-per-function` and `no-magic-numbers` to avoid false positives.

### ADR-007: Dependabot for dependency management
- **Status:** Accepted
- **Context:** No automated dependency update mechanism. Dependencies drift silently.
- **Decision:** Add `.github/dependabot.yml` with monthly cadence, grouped updates for related packages, and GitHub Actions version monitoring.
- **Consequences:** Automated PRs for dependency updates. Monthly cadence keeps noise low.

### ADR-008: Expand lint-staged to cover JSON and YAML files
- **Status:** Accepted
- **Context:** lint-staged only runs on `*.ts` files. Non-TS files (JSON, YAML) can be committed unformatted, causing CI `format:check` failures.
- **Decision:** Add `*.json` and `*.yml` patterns to `.lintstagedrc` with `prettier --write`.
- **Consequences:** Formatting consistency across all committed file types. Pre-commit matches CI expectations.

### ADR-010: Mutation testing with StrykerJS + Vitest runner
- **Status:** Accepted
- **Context:** Coverage thresholds measure which code is exercised but not whether tests assert meaningful behavior. Mutation testing closes this gap.
- **Decision:** Add `@stryker-mutator/core` + `@stryker-mutator/vitest-runner`. Configure with Vitest runner, 60% break threshold. Run weekly in a dedicated GitHub Actions workflow with `actions/cache` for incremental file persistence.
- **Consequences:** Tests must kill mutants, not just touch lines. Weekly schedule keeps PR CI fast. Manual `workflow_dispatch` available for on-demand runs.

### ADR-009: Agent report validation via YAML frontmatter + CI script
- **Status:** Accepted
- **Context:** Agent reports are freeform Markdown with inconsistent structure. No machine-readable validation possible.
- **Decision:** New reports must include YAML frontmatter with required fields (`taskId`, `completedAt`, `testsRun`, `filesModified`). When `testsRun: 0`, a non-empty `justification` field is required. A validation script runs in CI. Existing reports are not retroactively updated.
- **Consequences:** Machine-readable report metadata. Agents must follow the frontmatter template. Existing reports are grandfathered.

## Contracts

### CONTRACT-001: npm scripts interface
All agents must use these repo scripts (no ad-hoc commands):
- `npm run build` — compile TypeScript
- `npm run test` — run Vitest
- `npm run test:coverage` — run Vitest with coverage (enforces 80% thresholds)
- `npm run test:watch` — Vitest in watch mode
- `npm run lint` — ESLint
- `npm run typecheck` — tsc --noEmit *(to be added in TASK-005)*
- `npm run format` — Prettier write *(to be added in TASK-001)*
- `npm run format:check` — Prettier check *(to be added in TASK-001)*
- `npm run clean` — remove dist/ *(to be added in TASK-005)*
- `npm run test:mutate` — Stryker mutation testing *(added in TASK-023)*
- `npm run test:mutate:incremental` — Stryker incremental mode *(added in TASK-023)*

## Task Summary

| ID | Title | Owner | Status | Blocked By |
|----|-------|-------|--------|------------|
| TASK-001 | Add Prettier + EditorConfig | SONNET-A | done | — |
| TASK-002 | Add eslint-config-prettier | SONNET-A | done | TASK-001 |
| TASK-003 | Add Husky + lint-staged | SONNET-A | done | TASK-001 |
| TASK-004 | Add commitlint | SONNET-A | done | TASK-003 |
| TASK-005 | Add missing npm scripts | SONNET-A | done | — |
| TASK-006 | Add Vitest coverage thresholds | SONNET-B | done | — |
| TASK-007 | Add GitHub Actions CI workflow | SONNET-A | done | TASK-001, TASK-005, TASK-006 |
| TASK-008 | Add README.md | HAIKU-C | pending | — |
| TASK-009 | Add Dockerfile + .dockerignore | SONNET-A | done | TASK-005 |
| TASK-010 | Optimize CLAUDE.md for token efficiency | HAIKU-C | pending | — |
| TASK-011 | Add test file location enforcement script | SONNET-A | done | — |
| TASK-012 | Wire test location check into pre-commit and CI | SONNET-B | pending | TASK-011 |
| TASK-013 | Add ESLint complexity rules | SONNET-A | done | — |
| TASK-014 | Add ESLint no-magic-numbers rule | SONNET-A | pending | TASK-013 |
| TASK-015 | Extract magic number in users.ts | SONNET-A | pending | TASK-014 |
| TASK-016 | Add Dependabot configuration | HAIKU-C | done | — |
| TASK-017 | Expand lint-staged to JSON and YAML | HAIKU-C | done | — |
| TASK-018 | Add report validation script | SONNET-A | done | — |
| TASK-019 | Add report frontmatter template | HAIKU-C | pending | TASK-018 |
| TASK-020 | Wire report validation into CI | SONNET-B | pending | TASK-018 |
| TASK-021 | Verify all quality checks pass end-to-end | SONNET-B | pending | TASK-012, TASK-015, TASK-017, TASK-020 |
| TASK-022 | Register ADR-010 and Stryker tasks in PLANS.md | HAIKU-C | done | — |
| TASK-023 | Install Stryker and create config | SONNET-A | done | TASK-022 |
| TASK-024 | Validate Stryker baseline and document score | SONNET-B | done | TASK-023 |
| TASK-025 | Add mutation testing GitHub Actions workflow | SONNET-B | done | TASK-024 |
| TASK-026 | Update CLAUDE.md with Stryker references | HAIKU-C | done | TASK-022 |
| TASK-027 | Enable incremental mode and adjust threshold | SONNET-A | done | TASK-024 |

## Task Details

### TASK-001: Add Prettier + EditorConfig
- **Owner:** SONNET-A
- **Scope:** Add Prettier formatter and EditorConfig for cross-IDE consistency.
- **Allowed files:** `.prettierrc`, `.prettierignore`, `.editorconfig`, `package.json`
- **Acceptance criteria:**
  - `npm run format` writes formatted files
  - `npm run format:check` exits 0 on already-formatted code
  - `.editorconfig` sets indent_style=space, indent_size=2, end_of_line=lf, charset=utf-8
- **Validation:** `npm run format:check && npm run lint`
- **Dependencies:** none

### TASK-002: Add eslint-config-prettier
- **Owner:** SONNET-A
- **Scope:** Integrate eslint-config-prettier to disable ESLint rules that conflict with Prettier.
- **Allowed files:** `eslint.config.js`, `package.json`
- **Acceptance criteria:**
  - eslint-config-prettier is installed and added to ESLint flat config
  - `npm run lint` still passes
  - No ESLint rules conflict with Prettier output
- **Validation:** `npm run lint && npm run format:check`
- **Dependencies:** TASK-001

### TASK-003: Add Husky + lint-staged
- **Owner:** SONNET-A
- **Scope:** Add pre-commit hook that runs lint-staged (format + lint on staged .ts files).
- **Allowed files:** `.husky/pre-commit`, `.lintstagedrc`, `package.json`
- **Acceptance criteria:**
  - `npx husky init` or equivalent sets up .husky/
  - lint-staged runs `prettier --write` and `eslint --fix` on staged `*.ts` files
  - `npm run prepare` installs Husky hooks
- **Validation:** Stage a file, commit, verify hooks run
- **Dependencies:** TASK-001

### TASK-004: Add commitlint
- **Owner:** SONNET-A
- **Scope:** Enforce Conventional Commits via commitlint + Husky commit-msg hook.
- **Allowed files:** `commitlint.config.js`, `.husky/commit-msg`, `package.json`
- **Acceptance criteria:**
  - `echo "bad msg" | npx commitlint` fails
  - `echo "feat: valid msg" | npx commitlint` passes
  - Husky commit-msg hook wired up
- **Validation:** Attempt a commit with a bad message; verify rejection
- **Dependencies:** TASK-003

### TASK-005: Add missing npm scripts
- **Owner:** SONNET-A
- **Scope:** Add `typecheck`, `clean`, and `prepare` scripts to package.json.
- **Allowed files:** `package.json`
- **Acceptance criteria:**
  - `npm run typecheck` runs `tsc --noEmit`
  - `npm run clean` removes `dist/`
  - `npm run prepare` runs `husky` (if TASK-003 is done, otherwise skip prepare)
- **Validation:** Run each script, verify expected behavior
- **Dependencies:** none

### TASK-006: Add Vitest coverage thresholds
- **Owner:** SONNET-B
- **Scope:** Configure coverage provider and enforce 80% line/branch thresholds.
- **Allowed files:** `vitest.config.ts`, `package.json`
- **Acceptance criteria:**
  - `npm run test -- --coverage` produces a coverage report
  - Build fails if line or branch coverage drops below 80%
  - @vitest/coverage-v8 (or c8) installed as devDependency
- **Validation:** `npm run test -- --coverage`
- **Dependencies:** none

### TASK-007: Add GitHub Actions CI workflow
- **Owner:** SONNET-A
- **Scope:** CI pipeline that runs on push to main and all PRs.
- **Allowed files:** `.github/workflows/ci.yml`
- **Acceptance criteria:**
  - Jobs: lint, typecheck, test (with coverage), build
  - Node 22.x, npm ci for install
  - Fails fast on any step failure
- **Validation:** Push to a branch, verify Actions run
- **Dependencies:** TASK-001, TASK-005, TASK-006

### TASK-008: Add README.md
- **Owner:** HAIKU-C
- **Scope:** Project overview, prerequisites, setup, scripts, architecture summary.
- **Allowed files:** `README.md`
- **Acceptance criteria:**
  - Covers: what the project is, Node 22.21.1 prerequisite, `npm ci`, available scripts, project structure, multi-agent workflow summary
  - Under 100 lines
- **Validation:** Visual review
- **Dependencies:** none

### TASK-009: Add Dockerfile + .dockerignore
- **Owner:** SONNET-A
- **Scope:** Multi-stage Dockerfile for building and running the project.
- **Allowed files:** `Dockerfile`, `.dockerignore`
- **Acceptance criteria:**
  - Stage 1: install + build; Stage 2: slim runtime with dist/ only
  - `.dockerignore` excludes node_modules, .git, dist, coverage, .env*
  - `docker build -t claude-multi-agent .` succeeds
- **Validation:** `docker build -t claude-multi-agent .`
- **Dependencies:** TASK-005

### TASK-010: Optimize CLAUDE.md for token efficiency
- **Owner:** HAIKU-C
- **Scope:** Reduce CLAUDE.md token count without losing information.
- **Allowed files:** `CLAUDE.md`
- **Acceptance criteria:**
  - Remove content duplicated in agent .md files
  - Use terse phrasing (no filler words)
  - Target < 80 lines while preserving all rules
  - No behavioral changes to instructions
- **Validation:** Diff review; verify no rules lost
- **Dependencies:** none

---

## Phase 2: Quality Checks

### TASK-011: Add test file location enforcement script
- **Owner:** SONNET-A
- **Scope:** Create a Node script that finds `*.test.ts` and `*.spec.ts` files outside `__tests__/` directories under `src/`. Exit 1 if any are found, exit 0 otherwise. Add an npm script `test:check-location` to run it.
- **Allowed files:** `scripts/check-test-locations.js`, `package.json`
- **Interfaces:**
  - npm script: `"test:check-location": "node scripts/check-test-locations.js"`
  - Script scans `src/` recursively for `*.test.ts` and `*.spec.ts` not inside `__tests__/`
  - Prints offending file paths to stderr on failure
  - Exit code: 0 = clean, 1 = violations found
- **Required tests:** Create `src/__tests__/check-test-locations.test.ts` that:
  - Verifies the script logic (import and test the core function, not just the CLI entry)
  - Tests that a correctly placed file passes
  - Tests that `src/foo.test.ts` is flagged
  - Tests that `src/foo.spec.ts` is flagged
  - Tests that `src/__tests__/foo.test.ts` passes
- **Acceptance criteria:**
  - `npm run test:check-location` exits 0 on the current codebase
  - The script catches `*.test.ts` and `*.spec.ts` outside `__tests__/`
  - Script is portable (Node, no shell-specific commands)
- **Validation:** `npm run test:check-location && npm run test && npm run lint`
- **Dependencies:** none

### TASK-012: Wire test location check into pre-commit and CI
- **Owner:** SONNET-B
- **Scope:** Add `test:check-location` to the Husky pre-commit hook and as a CI step.
- **Allowed files:** `.husky/pre-commit`, `.github/workflows/ci.yml`
- **Interfaces:**
  - Pre-commit hook runs `npm run test:check-location` before `npx lint-staged`
  - CI step runs after "Install dependencies" and before "Lint"
- **Required tests:** None (configuration-only). Validate by running pre-commit manually.
- **Acceptance criteria:**
  - `.husky/pre-commit` contains `npm run test:check-location` before `npx lint-staged`
  - `ci.yml` has a "Check test file locations" step running `npm run test:check-location`
  - Both pass on current codebase
- **Validation:** `npm run test:check-location && npm run lint && npm run test`
- **Dependencies:** TASK-011

### TASK-013: Add ESLint complexity rules
- **Owner:** SONNET-A
- **Scope:** Add `complexity`, `max-depth`, `max-lines-per-function`, and `max-params` rules to ESLint config. Exclude test files from `max-lines-per-function`.
- **Allowed files:** `eslint.config.js`
- **Interfaces:**
  - Source files (`src/**/*.ts`): `complexity: ["error", 10]`, `max-depth: ["error", 3]`, `max-lines-per-function: ["warn", 40]`, `max-params: ["warn", 3]`
  - Test files override (`src/**/__tests__/**/*.ts`): `max-lines-per-function: "off"`
- **Required tests:** None (ESLint rule configuration). Validate that lint passes on current code.
- **Acceptance criteria:**
  - `npm run lint` passes with no errors or warnings on current codebase
  - Rules are configured with exact values specified above
  - Test files are excluded from `max-lines-per-function`
- **Validation:** `npm run lint`
- **Dependencies:** none

### TASK-014: Add ESLint no-magic-numbers rule
- **Owner:** SONNET-A
- **Scope:** Add `no-magic-numbers` rule to ESLint for source files only. Configure `ignore: [0, 1, -1]`, `ignoreArrayIndexes: true`, `ignoreDefaultValues: true`, `enforceConst: true`. Exclude test files entirely.
- **Allowed files:** `eslint.config.js`
- **Interfaces:**
  - Source files (`src/**/*.ts`): `no-magic-numbers: ["error", { ignore: [0, 1, -1], ignoreArrayIndexes: true, ignoreDefaultValues: true, enforceConst: true }]`
  - Test files override (`src/**/__tests__/**/*.ts`): `no-magic-numbers: "off"`
- **Required tests:** None (ESLint rule configuration).
- **Acceptance criteria:**
  - `npm run lint` identifies the magic number `8` in `src/users.ts` line 23
  - Test files do not trigger `no-magic-numbers`
  - `ignore` list includes `[0, 1, -1]`
- **Validation:** `npm run lint` (expected to fail until TASK-015 fixes the magic number)
- **Dependencies:** TASK-013 (both modify the same file; serialize to avoid conflicts)

### TASK-015: Extract magic number in users.ts
- **Owner:** SONNET-A
- **Scope:** Fix the `no-magic-numbers` lint violation by extracting `8` to a named constant `MIN_PASSWORD_LENGTH`.
- **Allowed files:** `src/users.ts`
- **Interfaces:**
  - Add `const MIN_PASSWORD_LENGTH = 8;` at module scope
  - Replace `password.length < 8` with `password.length < MIN_PASSWORD_LENGTH`
  - Update error message to use template literal or keep hardcoded string (either is acceptable)
- **Required tests:** Existing tests in `src/__tests__/users.test.ts` must still pass without modification.
- **Acceptance criteria:**
  - `npm run lint` passes with zero errors and zero warnings
  - `npm run test` passes with all existing tests green
  - No magic number `8` remains in source code
- **Validation:** `npm run lint && npm run test`
- **Dependencies:** TASK-014

### TASK-016: Add Dependabot configuration
- **Owner:** HAIKU-C
- **Scope:** Create `.github/dependabot.yml` with monthly cadence, grouped updates, and GitHub Actions monitoring.
- **Allowed files:** `.github/dependabot.yml`
- **Interfaces:**
  - Ecosystem `npm`: monthly schedule, groups for `eslint` (`@typescript-eslint/*`, `eslint*`), `vitest` (`vitest`, `@vitest/*`), `husky-commitlint` (`husky`, `lint-staged`, `@commitlint/*`), and `typescript` (`typescript`, `typescript-eslint`)
  - Ecosystem `github-actions`: monthly schedule
  - Target branch: `main`
- **Required tests:** None (config-only, validated by GitHub when pushed).
- **Acceptance criteria:**
  - File exists at `.github/dependabot.yml`
  - Two ecosystem entries: `npm` and `github-actions`
  - Monthly schedule for both
  - At least 4 package groups defined for npm
  - Valid YAML syntax
- **Validation:** `cat .github/dependabot.yml` (visual review; no local validator for Dependabot schema)
- **Dependencies:** none

### TASK-017: Expand lint-staged to cover JSON and YAML files
- **Owner:** HAIKU-C
- **Scope:** Add `*.json` and `*.yml` patterns to `.lintstagedrc` with `prettier --write`.
- **Allowed files:** `.lintstagedrc`
- **Interfaces:**
  - New entries: `"*.json": ["prettier --write"]`, `"*.yml": ["prettier --write"]`
  - Existing `*.ts` entry unchanged
- **Required tests:** None (config-only). Validate by running lint-staged.
- **Acceptance criteria:**
  - `.lintstagedrc` contains entries for `*.ts`, `*.json`, and `*.yml`
  - `npx lint-staged --diff="HEAD~1"` runs without error
  - `npm run format:check` still passes
- **Validation:** `npm run format:check`
- **Dependencies:** none

### TASK-018: Add report validation script
- **Owner:** SONNET-A
- **Scope:** Create a Node script that validates agent report files in `reports/agents/` for required YAML frontmatter fields. Only validates files modified after this feature lands (checks for frontmatter presence; files without frontmatter are skipped as legacy).
- **Allowed files:** `scripts/validate-reports.js`, `package.json`
- **Interfaces:**
  - npm script: `"reports:validate": "node scripts/validate-reports.js"`
  - Required frontmatter fields: `taskId` (string, non-empty), `completedAt` (string, date format), `testsRun` (number >= 0), `filesModified` (array, non-empty)
  - When `testsRun` is `0`: `justification` field is required (string, non-empty)
  - Files without YAML frontmatter (`---` delimiters) are skipped (legacy reports)
  - Exit code: 0 = all valid or all legacy, 1 = validation errors found
  - Prints validation errors to stderr with file path and field name
- **Required tests:** Create `src/__tests__/validate-reports.test.ts` that:
  - Tests valid frontmatter passes
  - Tests missing required fields fail
  - Tests `testsRun: 0` without `justification` fails
  - Tests `testsRun: 0` with `justification` passes
  - Tests files without frontmatter are skipped
  - Tests `filesModified` must be non-empty array
- **Acceptance criteria:**
  - `npm run reports:validate` exits 0 on current codebase (all existing reports are legacy/skipped)
  - Script correctly validates all required fields
  - Tests cover all validation branches
- **Validation:** `npm run reports:validate && npm run test && npm run lint`
- **Dependencies:** none

### TASK-019: Add report frontmatter template
- **Owner:** HAIKU-C
- **Scope:** Create a template file showing the required YAML frontmatter format for agent reports. Document the schema in the template.
- **Allowed files:** `reports/agents/TEMPLATE.md`
- **Interfaces:**
  - Template shows all required fields with placeholder values and comments
  - Documents the `testsRun: 0` + `justification` rule
  - Includes both a "with tests" and "without tests" example
- **Required tests:** None (documentation-only).
- **Acceptance criteria:**
  - Template file exists at `reports/agents/TEMPLATE.md`
  - Contains valid YAML frontmatter that would pass the validation script
  - Documents all required fields and the justification rule
- **Validation:** `npm run reports:validate` (template itself should pass validation)
- **Dependencies:** TASK-018 (must know the exact schema the script enforces)

### TASK-020: Wire report validation into CI
- **Owner:** SONNET-B
- **Scope:** Add `reports:validate` as a CI step in the GitHub Actions workflow.
- **Allowed files:** `.github/workflows/ci.yml`
- **Interfaces:**
  - New step "Validate agent reports" running `npm run reports:validate`
  - Placed after "Install dependencies", alongside other validation steps
- **Required tests:** None (CI config-only).
- **Acceptance criteria:**
  - `ci.yml` contains the `reports:validate` step
  - Step uses `npm run reports:validate`
  - Current codebase passes the step (all existing reports are legacy/skipped)
- **Validation:** `npm run reports:validate`
- **Dependencies:** TASK-018

### TASK-021: Verify all quality checks pass end-to-end
- **Owner:** SONNET-B
- **Scope:** Run the full validation suite to confirm all new quality checks work together. This is the integration gate.
- **Allowed files:** none (read-only verification)
- **Interfaces:** none
- **Required tests:** none (verification task)
- **Acceptance criteria:**
  - `npm run test:check-location` exits 0
  - `npm run lint` exits 0 (no errors, no warnings)
  - `npm run format:check` exits 0
  - `npm run typecheck` exits 0
  - `npm run test` exits 0 (all tests pass)
  - `npm run test:coverage` exits 0 (coverage thresholds met)
  - `npm run reports:validate` exits 0
  - `npm run build` exits 0
- **Validation:** Run all commands above in sequence
- **Dependencies:** TASK-012, TASK-015, TASK-017, TASK-020

---

## Phase 3: Mutation Testing

### TASK-022: Register ADR-010 and Stryker tasks in PLANS.md
- **Owner:** HAIKU-C
- **Scope:** Append ADR-010, add TASK-022–027 to task summary and details, update CONTRACT-001 with new npm scripts.
- **Allowed files:** `PLANS.md`
- **Acceptance criteria:** ADR-010 and all six tasks registered in PLANS.md.
- **Validation:** Visual review
- **Dependencies:** none

### TASK-023: Install Stryker and create config
- **Owner:** SONNET-A
- **Scope:** Install `@stryker-mutator/core` + `@stryker-mutator/vitest-runner`, create `stryker.config.mjs`, add npm scripts, update `.gitignore`.
- **Allowed files:** `package.json`, `stryker.config.mjs` (new), `.gitignore`
- **Acceptance criteria:**
  - `npm run test:mutate` runs, reports score, exits 0 if ≥60%
  - `npm run test:mutate:incremental` available
  - `reports/mutation/` and `reports/stryker-incremental.json` in `.gitignore`
- **Validation:** `npm run test:mutate`
- **Dependencies:** TASK-022

### TASK-024: Validate Stryker baseline and document score
- **Owner:** SONNET-B
- **Scope:** Run `test:mutate`, document baseline score, verify incremental file creation, confirm tests pass.
- **Allowed files:** `reports/agents/TASK-024-tester.md` (write-only)
- **Acceptance criteria:**
  - Baseline score documented (killed/survived/total)
  - Incremental file verified
  - Existing tests still pass
  - Threshold ratchet recommendation if baseline > 60%
- **Validation:** `npm run test:mutate && npm run test`
- **Dependencies:** TASK-023

### TASK-025: Add mutation testing GitHub Actions workflow
- **Owner:** SONNET-B
- **Scope:** Create `.github/workflows/mutation.yml` with weekly schedule, `workflow_dispatch`, `actions/cache` for incremental file.
- **Allowed files:** `.github/workflows/mutation.yml` (new)
- **Acceptance criteria:**
  - Triggers: `schedule` (Monday 04:00 UTC) + `workflow_dispatch`
  - Caches incremental file per branch
  - Uploads mutation report artifact (14-day retention)
  - Does NOT modify `ci.yml`
- **Validation:** YAML syntax review; manual `workflow_dispatch` after merge
- **Dependencies:** TASK-024

### TASK-026: Update CLAUDE.md with Stryker references
- **Owner:** HAIKU-C
- **Scope:** Add `reports/mutation/` to generated/output dirs, add `test:mutate` to key commands.
- **Allowed files:** `CLAUDE.md`
- **Acceptance criteria:** CLAUDE.md lists `test:mutate` and `reports/mutation/`.
- **Validation:** Visual review
- **Dependencies:** TASK-022

### TASK-027: Enable incremental mode and adjust threshold
- **Owner:** SONNET-A
- **Scope:** Flip `incremental: false` → `incremental: true` in `stryker.config.mjs`. Ratchet `break` threshold based on TASK-024 baseline.
- **Allowed files:** `stryker.config.mjs`
- **Acceptance criteria:**
  - `incremental: true` with updated comment
  - `break` threshold ratcheted if baseline significantly above 60%
- **Validation:** `npm run test:mutate:incremental`
- **Dependencies:** TASK-024
