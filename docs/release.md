# Release Process

This project uses a fully automated, professional release workflow based on Continuous Delivery principles.

## How Releases Work

- Every push and pull request to `main` triggers the CI pipeline (see `.github/workflows/ci.yml`).
- The pipeline runs lint, typecheck, tests (with coverage), build, and only proceeds if all checks pass.
- Releases are managed by [Changesets](https://github.com/changesets/changesets):
  - To propose a release, create a changeset with `pnpm changeset` and commit it.
  - When changes are merged to `main`, the CI will create or update a release PR if there are unreleased changesets.
  - When the release PR is merged, the CI will:
    1. Bump the version and update changelogs.
    2. Publish the package to npm (if NPM_TOKEN is set).
    3. Tag the release on GitHub.

## How to Cut a Release (Manual Steps)

1. Make sure your branch is up to date with `main` and all tests pass.
2. Run `pnpm changeset` and follow the prompts to describe your changes (major, minor, patch).
3. Commit the generated changeset file.
4. Open a pull request to `main`.
5. Once merged, the CI will handle versioning, changelog, and publishing automatically.

## Requirements

- You must have `NPM_TOKEN` and `GITHUB_TOKEN` set in the repository secrets for publishing.
- Only the CI can publish to npm—manual publishing is discouraged.

## References
- [Changesets documentation](https://github.com/changesets/changesets)
- [CI workflow](../.github/workflows/ci.yml)

---

For any issues or questions, open an [issue](https://github.com/edmolima/typeengine/issues) or ask in [Discussions](https://github.com/edmolima/typeengine/discussions).
