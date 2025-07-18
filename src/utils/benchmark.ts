// Benchmarking utility for core operations
export function benchmark(
  label: string,
  fn: () => void,
  iterations = 1000
): number {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) fn();
  const end = process.hrtime.bigint();
  const ms = Number(end - start) / 1e6;
  console.log(`${label}: ${ms.toFixed(2)}ms for ${iterations} iterations`);
  return ms;
}
