# Claude Code Instructions

## Project map (read first)
- Single-package repo using npm.
- Key commands:
  - `npm run build`
  - `npm run test`
- Generated/output directories:
  - `dist/`
- Active tasks: `PLANS.md` (architect-owned, structured task registry)
- Future ideas: `BACKLOG.md` (append-only, deferred work)

## Default operating mode
- Minimize context and file reads.
- Do NOT scan the repo by default.
- Open only files required for the current task.
- Prefer small, focused diffs and the fewest files possible.
- If unsure, ask up to 3 targeted questions before reading broadly.

## Planning mode
- Architect writes active plans to `PLANS.md` using ADR/TASK/CONTRACT IDs.
- Deferred ideas go in `BACKLOG.md` (append-only, never rewrite existing content).
- If priority is unclear, append under **Medium Priority** in BACKLOG.md.

## Project conventions
- Source code lives in `src/`.
- Tests are co-located: each module's tests go in a `__tests__/` subdirectory
  next to the source (e.g. `src/__tests__/users.test.ts` for `src/users.ts`).
- Test files use the `.test.ts` extension.
- Never place test files in the same directory as source files.

## Implementation mode (TDD)
- Work in tight loops following Red-Green-Refactor:
  1) Identify the minimal file(s)
  2) Write a failing test that describes the desired behavior
  3) Run the test — confirm it fails (Red)
  4) Implement the minimal code to make the test pass (Green)
  5) Refactor after green — clean up while tests stay passing
  6) Run the full relevant test suite and lint
  7) Summarize changes and follow-ups
- Never write production code without a failing test first.
- Avoid pasting large logs. Summarize and reference filenames and commands instead.

## Testing standards (hard rules)
- **Test behavior, not implementation.** Focus on public APIs and observable outcomes.
- **One behavior per test.** Keep tests focused and independent.
- **Descriptive test names.** Names should describe the behavior under test
  (e.g. `"returns empty array when no items match filter"`).
- **Organize with `describe` blocks** that mirror the module/function structure.
- **Factory pattern for test data.** Create `getMockX(overrides?: Partial<X>)` helpers
  with sensible defaults. Keep tests DRY.
- **Clear mocks between tests.** Use `beforeEach` / `afterEach` to reset shared state.
- **Coverage requirements:**
  - New/changed code must have corresponding tests.
  - Target ≥ 60 % line and branch coverage for touched files.
  - Run `npm run test -- --coverage` before finalizing work to verify.

## Code standards (hard rules)
- TypeScript: no `any` (use generics or `unknown` with narrowing).
- Keep functions small and readable.
- Avoid deep nesting.
- Prefer explicit, descriptive names.
- Handle errors explicitly and log only what is useful.
- Follow existing project patterns and conventions.

## Commit messages
- Use Conventional Commits.
- Keep the subject concise.
- Include scope when it is obvious.
- Do not restate the full plan in the commit message.

## Restrictions
- Never use Bash commands to read or scan inside `node_modules/`
- All file I/O (reads and writes) must stay within the project root. Never use /tmp/, home directories, or paths outside the repo.

## Multi-Agent Rules
- Source of truth: `PLANS.md` (ADR/TASK/CONTRACT IDs). Agents read tasks from this file.
- Stay inside assigned directories. No boundary crossing without architect approval.
- Run lint + tests for your scope. Write reports to `reports/agents/TASK-###-<role>.md`.
- Delegate TASKs by owner: SONNET-A → implementer, SONNET-B → tester, HAIKU-C → implementer (docs/tooling).
- Agent role details are in `.claude/agents/*.md` — do not duplicate here.