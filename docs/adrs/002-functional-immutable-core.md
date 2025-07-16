
# Functional and Immutable Core

Date: 2025-07-16

Status: accepted

## Context
The core should be predictable, testable, and easy to reason about.

## Decision
All core operations will be pure functions, and the document model will be deeply immutable.

## Consequences
No runtime mutations, easier debugging, and safer concurrent operations.
