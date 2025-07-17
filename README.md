# typeengine

[![build](https://github.com/edmolima/typeengine/actions/workflows/ci.yml/badge.svg)](https://github.com/edmolima/typeengine/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/typeengine.svg)](https://www.npmjs.com/package/typeengine)
[![codecov](https://codecov.io/gh/edmolima/typeengine/branch/main/graph/badge.svg)](https://codecov.io/gh/edmolima/typeengine)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/edmolima/typeengine/pulls)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](https://github.com/edmolima/typeengine/blob/main/.changeset)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-active-blue.svg)](CODE_OF_CONDUCT.md)

---


Typeengine is a blazing-fast, minimal, and extensible rich text core designed for building the editors of tomorrow. It provides a robust foundation for document modeling, transformation, and serialization, enabling developers to create advanced editing experiences with confidence.


## Features

- Powerful, extensible document model for rich text editing
- Core operations: insert, remove, update, and set node attributes
- Built-in serialization and deserialization for HTML, JSON, and Markdown
- Plugin system for custom behaviors and integrations
- Designed for performance, reliability, and maintainability


## Getting Started

```sh
pnpm install typeengine
```


## Usage

```ts
import { createDocument, insertNode, removeNode, updateNode, setNodeAttributes } from 'typeengine';
// ...
```


## Release & Automation

- Releases are 100% automated via GitHub Actions and [Changesets](https://github.com/changesets/changesets).
- Releases only occur after CI passes and merge to the `main` branch.
- Publishes only if there is a pending changeset (see docs/release.md).
- Branch protection ensures nothing is published without review and green CI.


## Contributing & Community

- See [CONTRIBUTING.md](CONTRIBUTING.md), [docs/release.md](docs/release.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- [Discussions](https://github.com/edmolima/typeengine/discussions) and [issues](https://github.com/edmolima/typeengine/issues) are welcome!
- We follow a [Code of Conduct](CODE_OF_CONDUCT.md) and encourage a friendly, inclusive community.
- Want to support? See [FUNDING.yml](.github/FUNDING.yml).


## Roadmap

See [docs/roadmap.md](docs/roadmap.md).


## License

MIT
