function sjf(processes) {
  const procs = cloneProcesses(processes);
  const done = new Set();
  let time = 0;
  const gantt = [];
  while (done.size < procs.length) {
    const avail = procs.filter((p) => !done.has(p.id) && p.arrival <= time);
    if (avail.length === 0) {
      const next = Math.min(
        ...procs.filter((p) => !done.has(p.id)).map((p) => p.arrival),
      );
      addIdleSegment(gantt, time, next);
      time = next;
      continue;
    }
    avail.sort(
      (a, b) =>
        a.burst - b.burst || a.arrival - b.arrival || a.id.localeCompare(b.id),
    );
    const p = avail[0];
    p.start = time;
    p.completion = time + p.burst;
    gantt.push({ pid: p.id, start: p.start, end: p.completion });
    done.add(p.id);
    time = p.completion;
  }
  return { gantt, metrics: calculateCompletionMetrics(procs) };
}
