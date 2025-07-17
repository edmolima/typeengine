---
"typeengine": minor
---

## Core evolution: architecture, quality, and automation

- Refactored and documented the roadmap to focus the core on a pure, immutable, extensible document engine, separating all editor/engine concerns into a future package.
- Enforced 80% minimum code coverage in CI, with robust automated checks.
- Added typecheck script and improved package.json scripts for quality and reliability.
- Created and standardized issue and pull request templates (context, why/what, acceptance, quality, security, performance).
- Added comprehensive entrypoint (index.ts) test to guarantee API integrity and prevent accidental breaking changes.
- Improved and extended test coverage for error paths and edge cases in core operations (e.g., insertNode).
- All documentation, contribution, and release processes updated to reflect world-class open source standards.

These changes make the core ready for adoption by teams and companies seeking a robust, extensible, and future-proof rich text engine.
