# Claude Code Instructions

## Project map (read first)
- Single-package repo using npm.
- Key commands:
  - `npm run build`
  - `npm run test`
- Generated/output directories:
  - `dist/`
- Planning workflow:
  - Feature ideas start as plans.

## Default operating mode
- Minimize context and file reads.
- Do NOT scan the repo by default.
- Open only files required for the current task.
- Prefer small, focused diffs and the fewest files possible.
- If unsure, ask up to 3 targeted questions before reading broadly.

## Planning mode
- Do NOT open many files.
- Produce a plan with:
  - Goal
  - Non-goals (if relevant)
  - Assumptions / open questions
  - Proposed steps
  - Likely files to touch (best guess)
  - Verification approach
- If the plan is deferred or the user indicates it should be tracked, append it to `BACKLOG.md`.

## BACKLOG.md rules
- Directly edit `BACKLOG.md` in the project root when adding plans.
- Never rewrite, reorder, or reformat existing backlog content.
- Append new entries at the end under an existing priority section.
- If priority is unclear, append under **Medium Priority**.
- Use the agreed backlog entry format without scanning the file for style.

## Project conventions
- Source code lives in `src/`.
- Tests are co-located: each module's tests go in a `__tests__/` subdirectory
  next to the source (e.g. `src/__tests__/users.test.ts` for `src/users.ts`).
- Test files use the `.test.ts` extension.
- Never place test files in the same directory as source files.

## Implementation mode
- Work in tight loops:
  1) Identify the minimal file(s)
  2) Implement changes
  3) Run the relevant npm script(s)
  4) Summarize changes and follow-ups
- Avoid pasting large logs. Summarize and reference filenames and commands instead.

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
- Node 22.21.1 Single-package using ESLint + Vitest and Conventional Commits.
- Single source of truth: OPUS PLAN (ADR/TASK/CONTRACT IDs).
- Stay inside assigned directories. No boundary crossing without OPUS approval.
- Run lint + tests for your scope using repo scripts. Include commands + results in your report.
- Commits must follow Conventional Commits; include scope when useful (package/app name).
- Keep changes small, reviewable, and consistent with existing code patterns.

## Report Format (All Agents)
- TASK: <TASK-ID from Architect>
- Summary:
- Scope honored: YES / NO (explain)
- Files changed:
- Tests added/updated:
- Commands run + results:
- Commit(s) proposed (Conventional Commits):
- Risks / open questions:
- Contract deviations: NONE | (explain)

**Report persistence:** Every agent must write its report to
`reports/agents/TASK-###-<role>.md` (e.g. `TASK-001-implementer.md`).
Create the directory if it does not exist. Reports are tracked in git.