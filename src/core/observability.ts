export type PluginEvent = {
  plugin: string;
  transform: string;
  status: 'success' | 'error';
  duration: number;
  error?: unknown;
};

let observers: Array<(event: PluginEvent) => void> = [];

export function addPluginObserver(fn: (event: PluginEvent) => void) {
  observers.push(fn);
}

export function removePluginObserver(fn: (event: PluginEvent) => void) {
  observers = observers.filter((o) => o !== fn);
}

export function notifyPluginObservers(event: PluginEvent) {
  for (const fn of observers) fn(event);
}
