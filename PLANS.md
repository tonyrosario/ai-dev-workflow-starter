# PLANS

> **Owner:** Architect (OPUS)
> **Last updated:** 2026-03-04
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

## Task Summary

| ID | Title | Owner | Status | Blocked By |
|----|-------|-------|--------|------------|
| TASK-001 | Add Prettier + EditorConfig | SONNET-A | done | — |
| TASK-002 | Add eslint-config-prettier | SONNET-A | done | TASK-001 |
| TASK-003 | Add Husky + lint-staged | SONNET-A | done | TASK-001 |
| TASK-004 | Add commitlint | SONNET-A | done | TASK-003 |
| TASK-005 | Add missing npm scripts | SONNET-A | done | — |
| TASK-006 | Add Vitest coverage thresholds | SONNET-B | done | — |
| TASK-007 | Add GitHub Actions CI workflow | SONNET-A | pending | TASK-001, TASK-005, TASK-006 |
| TASK-008 | Add README.md | HAIKU-C | pending | — |
| TASK-009 | Add Dockerfile + .dockerignore | SONNET-A | done | TASK-005 |
| TASK-010 | Optimize CLAUDE.md for token efficiency | HAIKU-C | pending | — |

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
