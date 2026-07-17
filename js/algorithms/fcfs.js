function fcfs(processes) {
  const procs = sortByArrivalId(cloneProcesses(processes));
  let time = 0;
  const gantt = [];
  for (const p of procs) {
    if (time < p.arrival) {
      addIdleSegment(gantt, time, p.arrival);
      time = p.arrival;
    }
    p.start = time;
    p.completion = time + p.burst;
    gantt.push({ pid: p.id, start: p.start, end: p.completion });
    time = p.completion;
  }
  return { gantt, metrics: calculateCompletionMetrics(procs) };
}
