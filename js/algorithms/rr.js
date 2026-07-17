function roundRobin(processes, quantum) {
  const procs = sortByArrivalId(cloneProcesses(processes)).map((p) => ({
    ...p,
    remaining: p.burst,
    start: -1,
    completion: null,
  }));
  let time = 0;
  let arrivedIdx = 0;
  let completed = 0;
  let running = null;
  let quantumLeft = 0;
  const queue = [];
  const gantt = [];

  function pushArrivals(t) {
    while (arrivedIdx < procs.length && procs[arrivedIdx].arrival <= t) {
      queue.push(procs[arrivedIdx]);
      arrivedIdx++;
    }
  }

  pushArrivals(0);
  while (completed < procs.length) {
    if (!running) {
      if (queue.length === 0) {
        const next = procs[arrivedIdx].arrival;
        addIdleSegment(gantt, time, next);
        time = next;
        pushArrivals(time);
        continue;
      }
      running = queue.shift();
      ensureStartTime(running, time);
      quantumLeft = quantum;
    }
    const tickStart = time;
    running.remaining--;
    time++;
    quantumLeft--;
    pushArrivals(time);
    const last = gantt[gantt.length - 1];
    if (last && last.pid === running.id && last.end === tickStart)
      last.end = time;
    else gantt.push({ pid: running.id, start: tickStart, end: time });
    if (running.remaining === 0) {
      running.completion = time;
      completed++;
      running = null;
    } else if (quantumLeft === 0) {
      queue.push(running);
      running = null;
    }
  }
  return { gantt, metrics: calculateCompletionMetrics(procs) };
}
