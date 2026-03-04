# BACKLOG

> Deferred ideas and future work. Append-only — never rewrite or reorder existing entries.
> New entries go at the end of the appropriate priority section.

## Entry Format

```
### <Short title>
- **Added:** YYYY-MM-DD
- **Context:** Why this matters
- **Rough scope:** What it involves
- **Priority rationale:** Why this priority level
```

## High Priority

*(empty)*

## Medium Priority

### Path aliases in tsconfig
- **Added:** 2026-03-04
- **Context:** Imports use relative paths (`../../src/users`). Path aliases (`@/*`) improve readability as the project grows.
- **Rough scope:** Add `baseUrl` and `paths` to tsconfig.json; update existing imports.
- **Priority rationale:** Low effort, improves DX, but not blocking anything.

### npm audit in CI
- **Added:** 2026-03-04
- **Context:** No automated security scanning of dependencies.
- **Rough scope:** Add `npm audit --audit-level=moderate` step to CI workflow after TASK-007 lands.
- **Priority rationale:** Quick add-on once CI exists.

## Low Priority

### Kubernetes manifests
- **Added:** 2026-03-04
- **Context:** Dockerfile (TASK-009) enables containerization; K8s manifests would enable orchestrated deployment.
- **Rough scope:** Basic deployment.yml, service.yml, optional HPA.
- **Priority rationale:** Only needed if deploying to K8s; not relevant for a reference template.

### Monorepo migration (Turborepo/Nx)
- **Added:** 2026-03-04
- **Context:** Currently single-package. If the project grows to multiple packages, a monorepo tool would help.
- **Rough scope:** Add turbo.json or nx.json, restructure into packages/.
- **Priority rationale:** Premature unless multiple packages are planned.

### Release automation (changesets/release-please)
- **Added:** 2026-03-04
- **Context:** No automated versioning or changelog generation.
- **Rough scope:** Add changesets or release-please, wire into CI.
- **Priority rationale:** Only needed when publishing packages.
