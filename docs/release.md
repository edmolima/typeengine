# Release & Automation Flow

This project follows modern open source automation and release practices. Releases are managed via [Changesets](https://github.com/changesets/changesets) and GitHub Actions workflows.

## Secure Release Flow

1. **Every PR must pass CI (lint, typecheck, test, coverage ≥80%)**
   - Enforced by the `ci.yml` workflow.
2. **Feature/fix PRs must include a Changeset**
   - Use `pnpm changeset` to describe changes and version bump.
3. **Branch protection**
   - Merge to `main` is only possible if CI passes.
4. **Automated release**
   - The `release.yml` workflow only runs on push to `main`.
   - It only publishes if there is a pending changeset (automatic check).
   - If there is no changeset, the job exits cleanly without publishing.
5. **Auditable publishing**
   - Release is performed via [changesets/action](https://github.com/changesets/action) using secure tokens.
   - Every release is auditable and only happens after review and green CI.

## Coverage badge
Add this to the top of your `README.md`:

```
[![codecov](https://codecov.io/gh/edmolima/typeengine/branch/main/graph/badge.svg)](https://codecov.io/gh/edmolima/typeengine)
```

---

For more details, see [CONTRIBUTING.md](../CONTRIBUTING.md) and [docs/roadmap.md](../docs/roadmap.md).
