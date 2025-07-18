
# Typeengine

[![Build Status](https://github.com/edmolima/typeengine/actions/workflows/ci.yml/badge.svg)](https://github.com/edmolima/typeengine/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/typeengine.svg)](https://www.npmjs.com/package/typeengine)
[![Coverage](https://codecov.io/gh/edmolima/typeengine/branch/main/graph/badge.svg)](https://codecov.io/gh/edmolima/typeengine)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/edmolima/typeengine/pulls)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](CHANGELOG.md)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-active-blue.svg)](CODE_OF_CONDUCT.md)

---

Typeengine is a next-generation, blazing-fast, and extensible rich text/document engine. Built for modern editors, enterprise platforms, and open-source innovation, it provides a robust foundation for document modeling, transformation, validation, migration, and analytics.

## Key Features
- **Universal Plugin System:** Runtime, WASM, and remote plugins with sandboxing and permission enforcement
- **Typed API:** Strict TypeScript types, versioned and stable
- **Performance Analytics:** Built-in benchmarking, tracing, and observability hooks
- **Validation & Migration:** Modular, extensible, and fully tested
- **Security:** Permission model, sandboxing, and audit tooling
- **Testing:** Advanced property-based, fuzz, mutation, and stress tests
- **Documentation:** World-class guides, API docs, and migration support

## Getting Started
```sh
pnpm install typeengine
```

## Example Usage
```ts
import { createDocument, insertNode, removeNode, updateNode, setNodeAttributes } from 'typeengine';
// ...
```

## Documentation
- [Guide](docs/GUIDE.md)
- [API Docs](docs/API_DOCS.md)
- [Advanced Usage](docs/ADVANCED.md)
- [Plugin System](docs/PLUGIN.md)
- [Testing](docs/TESTING.md)
- [Transforms](docs/TRANSFORM.md)
- [Migration Guide](docs/MIGRATION.md)
- [API Stability](docs/API_STABILITY.md)
- [Security Policy](SECURITY.md)
- [Contributing](CONTRIBUTING.md)
- [Release & Automation](docs/RELEASE.md)

## Release & Automation
- Automated releases via GitHub Actions and Changesets
- Branch protection and CI enforcement
- Changelog and migration guides for every release

## Community & Support
- [Discussions](https://github.com/edmolima/typeengine/discussions)
- [Issues](https://github.com/edmolima/typeengine/issues)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## Roadmap
See [docs/roadmap.md](docs/ROADMAP.md).

## License
MIT
