# Release & Automation Flow

Este projeto segue práticas modernas de automação e release open source. Releases são gerenciados via [Changesets](https://github.com/changesets/changesets) e workflows do GitHub Actions.

## Fluxo de Release Seguro

1. **Todo PR deve passar pelo CI (lint, typecheck, test, coverage ≥80%)**
   - Enforced pelo workflow `ci.yml`.
2. **Feature/fix PRs devem incluir um Changeset**
   - Use `pnpm changeset` para descrever mudanças e versionamento.
3. **Proteção de branch**
   - Só é possível dar merge na `main` se o CI passar.
4. **Release automatizado**
   - O workflow `release.yml` só roda em push para `main`.
   - Só publica se houver changeset pendente (checagem automática).
   - Se não houver changeset, o job termina sem erro e sem publicar.
5. **Publicação auditável**
   - O release é feito via [changesets/action](https://github.com/changesets/action) usando tokens seguros.
   - Todo release é auditável e só ocorre após revisão e CI verde.

## Badge de cobertura
Adicione ao topo do seu `README.md`:

```
[![codecov](https://codecov.io/gh/edmolima/typeengine/branch/main/graph/badge.svg)](https://codecov.io/gh/edmolima/typeengine)
```

---

Para mais detalhes, veja [CONTRIBUTING.md](../CONTRIBUTING.md) e [docs/roadmap.md](../docs/roadmap.md).
