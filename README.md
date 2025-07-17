# typeengine

> Blazing-fast, minimal, and extensible rich text core for building the editors of tomorrow.

[![codecov](https://codecov.io/gh/edmolima/typeengine/branch/main/graph/badge.svg)](https://codecov.io/gh/edmolima/typeengine)

---

## Features

- Immutable, functional document model
- Strict TypeScript types
- Extensible operations (insert, remove, update, setNodeAttributes)
- Zero dependencies in core
- 100% TDD and coverage enforced in CI
- Professional documentation, ADRs, and contribution policies

## Getting Started

```sh
pnpm install typebase
```

## Usage

```ts
import { createDocument, insertNode, removeNode, updateNode, setNodeAttributes } from 'typebase';
// ...
```

## Release & Automation

- Releases são 100% automatizados via GitHub Actions e [Changesets](https://github.com/changesets/changesets).
- Só ocorre release após o CI passar e merge na branch `main`.
- Só publica se houver changeset pendente (veja docs/release.md).
- Proteção de branch garante que nada é publicado sem revisão e CI verde.

## Contributing

Veja [CONTRIBUTING.md](CONTRIBUTING.md) e [docs/release.md](docs/release.md).

## Roadmap

Veja [docs/roadmap.md](docs/roadmap.md).

## License

MIT
