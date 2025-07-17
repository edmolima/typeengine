# ADR 010: Centralized Entry Point for Core API

## Status
Accepted

## Context

To provide a professional, user-friendly, and maintainable API, all core operations and types should be exported from a single entry point (`src/index.ts`). This avoids confusion, simplifies imports, and enables better tree-shaking and documentation.

## Decision

- All public API functions and types (document model, operations, helpers) are exported from `src/index.ts`.
- Internal modules (e.g., `insertNode.ts`, `removeNode.ts`) are not imported directly by consumers.
- Documentation and usage examples always reference the main entry point.

## Consequences

- Users have a single, predictable import path for all features.
- Easier to maintain and evolve the API surface.
- Reduces risk of breaking changes and improves DX.
