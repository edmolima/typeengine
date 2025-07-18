# Migration Guide

This guide documents all breaking changes and migration paths for Typeengine.

## How to Upgrade
- Run the automated upgrade tool: `pnpm ts-node scripts/upgrade-tool.ts`
- Review the output for any changes applied.
- See below for manual migration steps if needed.

## Breaking Changes


### v1.0.0
- `oldFunction` replaced by `newFunction`. Use the upgrade tool or manually update your code.
- `legacyApi` replaced by `modernApi`. Use the upgrade tool or manually update your code.
- `fooBar` replaced by `barFoo`. Use the upgrade tool or manually update your code.
- Imports from `typeengine/core` should now use the root entrypoint: `typeengine`.

## API Stability
- All public APIs are versioned and documented in the changelog.
- Semantic versioning is followed for all releases.


## Troubleshooting
- If the upgrade tool fails, check for file permissions and rerun.
- For complex migrations, see example test cases in `tests/scripts/upgrade-tool.test.ts`.
- If you encounter custom or project-specific patterns, add new rules to `scripts/upgrade-tool.ts` and rerun the tool.
