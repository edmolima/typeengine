
# API Stability Policy

Typeengine guarantees public API stability for all minor and patch releases. Breaking changes are only introduced in major releases and are documented in the changelog and migration guide.

- All public APIs are exported from a central entrypoint (e.g., `typeengine`).
- Semantic versioning is strictly followed.
- Migration guides and upgrade tools are provided for all breaking changes.
- Typed API and error handling are enforced.
- Deprecated APIs are announced in advance and replaced with modern alternatives.
- Example: `legacyApi` is replaced by `modernApi` in v1.0.0. See MIGRATION.md for details.
