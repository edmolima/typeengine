# Performance Analytics & Benchmarking

## Usage
- Run benchmarks in `benchmarks/core.bench.ts` to measure core operation speed
- Use tracing utilities in `src/utils/tracing.ts` for actionable insights
- All analytics are opt-in and do not log sensitive data

## Best Practices
- Run benchmarks regularly to detect regressions
- Use tracing for profiling and optimization
- Do not enable analytics in production unless required

## Example
```ts
import { benchmark } from '../src/utils/benchmark';
benchmark('My operation', () => { /* ... */ });
```

## Privacy
- No sensitive data is logged
- Analytics are opt-in and privacy-respecting
