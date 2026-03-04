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

### Docker image vulnerability scanning
- **Added:** 2026-03-04
- **Context:** The Dockerfile uses `node:22-alpine` as a base image. Alpine images are minimal but can still carry CVEs in system packages or bundled libraries. Without scanning, vulnerabilities in the base image or build layers go undetected.
- **Rough scope:** Add a scanning step using Docker Scout, Trivy, or Snyk. Can run locally (`docker scout cves` / `trivy image`) and/or as a CI step after the image build in the GitHub Actions workflow.
- **Priority rationale:** Security hygiene for any containerized project; low effort to add once CI (TASK-007) is in place.

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

### Continuous dependency monitoring
- **Added:** 2026-03-04
- **Context:** `npm audit` in CI catches known vulnerabilities at build time, but doesn't alert on newly disclosed CVEs between builds. Continuous monitoring fills that gap.
- **Rough scope:** Enable GitHub Dependabot (`dependabot.yml`) for automated version/security PRs. Optionally add Socket.dev or Snyk for supply chain attack detection.
- **Priority rationale:** Dependabot is zero-cost and quick to enable, but not urgent until the project has real deployment targets.
