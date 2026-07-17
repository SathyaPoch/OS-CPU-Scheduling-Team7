function srt(processes) {
  const procs = processes.map((p) => ({
    ...p,
    remaining: p.burst,
    start: -1,
    completion: null,
  }));
  let time = 0;
  let completed = 0;
  const gantt = [];
  while (completed < procs.length) {
    const avail = procs.filter(
      (p) => p.completion === null && p.arrival <= time,
    );
    if (avail.length === 0) {
      const next = Math.min(
        ...procs.filter((p) => p.completion === null).map((p) => p.arrival),
      );
      addIdleSegment(gantt, time, next);
      time = next;
      continue;
    }
    avail.sort(
      (a, b) =>
        a.remaining - b.remaining ||
        a.arrival - b.arrival ||
        a.id.localeCompare(b.id),
    );
    const p = avail[0];
    ensureStartTime(p, time);
    const tickStart = time;
    p.remaining--;
    time++;
    const last = gantt[gantt.length - 1];
    if (last && last.pid === p.id && last.end === tickStart) last.end = time;
    else gantt.push({ pid: p.id, start: tickStart, end: time });
    if (p.remaining === 0) {
      p.completion = time;
      completed++;
    }
  }
  return { gantt, metrics: calculateCompletionMetrics(procs) };
}
