// Tracing utility for actionable performance insights
export type TraceEvent = {
  label: string;
  start: bigint;
  end?: bigint;
  duration?: number;
};

const traces: TraceEvent[] = [];

export function traceStart(label: string): TraceEvent {
  const event: TraceEvent = { label, start: process.hrtime.bigint() };
  traces.push(event);
  return event;
}

export function traceEnd(event: TraceEvent): void {
  event.end = process.hrtime.bigint();
  event.duration = Number(event.end - event.start) / 1e6;
}

export function getTraces(): TraceEvent[] {
  return traces.slice();
}

export function clearTraces(): void {
  traces.length = 0;
}
