/**
 * Formats computation times (in milliseconds) into a user-friendly string.
 */
export function formatTime(ms: number): string {
  if (ms < 0.01) {
    return "< 0.01 ms";
  }
  if (ms < 1) {
    return `${ms.toFixed(3)} ms`;
  }
  return `${ms.toFixed(2)} ms`;
}
