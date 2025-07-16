# typeengine

> Blazing-fast, minimal, and extensible rich text core for building the editors of tomorrow.

---

![CI](https://img.shields.io/github/actions/workflow/status/edmolima/typeengine/ci.yml?branch=main&label=CI)
![npm](https://img.shields.io/npm/v/typeengine?color=blue)
![license](https://img.shields.io/github/license/edmolima/typeengine)

---

## 🚀 Overview

typeengine is a high-performance, zero-dependency core for rich text editors. Built with a functional, immutable architecture, it empowers developers to create the next generation of collaborative, accessible, and framework-agnostic text experiences.

---

## ✨ Features
- **Immutable tree-based document model**
- **Functional, developer-first API**
- **Atomic operations:** insert, remove, update, set_attr
- **Zero dependencies**
- **Fully decoupled from UI and DOM**
- **Optional plugin system (no bloat)**
- **Headless rendering:** React, Vue, mobile, server, CLI
- **Native selection and customizable attributes**
- **Easy serialization/deserialization:** JSON, Markdown, HTML
- **Real-time collaboration ready:** CRDT/OT pluggable
- **Accessibility and internationalization support**
- **Top-tier DX:** clear typing, concise docs, practical examples

---

## 📦 Installation

```sh
pnpm add typeengine
# or
yarn add typeengine
# or
npm install typeengine
```

---

## 🛠️ Quick Start

```ts
import { helloWorld } from "typeengine";

console.log(helloWorld()); // "Hello, typeengine!"
```

---

## 🗺️ Roadmap

See [`docs/roadmap.md`](./docs/roadmap.md) for the full project roadmap and progress.

See [milestones](https://github.com/edmolima/typeengine/milestones) for detailed progress.

---

## 🤝 Contributing

We welcome contributions from the community! Please open issues and pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © [Edmo Lima](https://github.com/edmolima)
