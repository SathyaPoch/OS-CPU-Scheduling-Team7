const AGING_THRESHOLD = 10;
const LEVEL_QUANTUM = [2, 4, Infinity];

function addIdleSegment(gantt, start, end) {
  if (start < end) gantt.push({ pid: "IDLE", start, end });
}

function ensureStartTime(p, time) {
  if (p.start === -1) p.start = time;
}

function calculateCompletionMetrics(processes) {
  const metrics = {};
  for (const p of processes) {
    metrics[p.id] = {
      waiting: p.completion - p.arrival - p.burst,
      turnaround: p.completion - p.arrival,
      response: p.start - p.arrival,
    };
  }
  return metrics;
}
