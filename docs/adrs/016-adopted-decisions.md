# ADR 016: Adopted Product and Technical Decisions

## Status
Accepted

## Context
To ensure transparency and traceability, Typeengine documents all major product and technical decisions that shape the platform. This ADR summarizes the key choices made for the project.

## Decision
Typeengine has adopted the following:
- **TypeScript** for strict typing, developer experience, and maintainability
- **Functional, immutable core** for reliability and predictability
- **No dependencies in core** to minimize attack surface and maximize portability
- **Esbuild** for fast, modern builds
- **PNPM** for efficient package management
- **Biome** for code formatting and linting
- **Vitest** for fast, property-based and fuzz testing
- **Changesets** for automated versioning and changelog management
- **GitHub Actions** for CI/CD automation
- **Centralized entrypoint** for API stability and ease of integration
- **Universal plugin system** for extensibility (runtime, WASM, remote)
- **Permission model and sandboxing** for plugin security
- **Automated upgrade tooling** for safe migrations
- **Built-in benchmarking and tracing** for performance analytics
- **Opt-in analytics and privacy-respecting observability**

## Consequences
- All technical choices are driven by product goals: extensibility, reliability, security, and performance
- The platform is future-proof, easy to maintain, and ready for enterprise and open-source adoption
