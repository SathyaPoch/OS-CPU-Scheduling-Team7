function mlfq(processes) {
  const procs = sortByArrivalId(cloneProcesses(processes)).map((p) => ({
    ...p,
    remaining: p.burst,
    start: -1,
    completion: null,
    level: 0,
    quantumUsed: 0,
    waitTicks: 0,
  }));
  let time = 0;
  let arrivedIdx = 0;
  let completed = 0;
  let running = null;
  const queues = [[], [], []];
  const gantt = [];

  function pushArrivals(t) {
    while (arrivedIdx < procs.length && procs[arrivedIdx].arrival <= t) {
      const p = procs[arrivedIdx];
      p.level = 0;
      p.waitTicks = 0;
      queues[0].push(p);
      arrivedIdx++;
    }
  }

  pushArrivals(0);
  while (completed < procs.length) {
    for (let lvl = 1; lvl < 3; lvl++) {
      for (let i = 0; i < queues[lvl].length; i++) {
        queues[lvl][i].waitTicks++;
        if (queues[lvl][i].waitTicks >= AGING_THRESHOLD) {
          const p = queues[lvl].splice(i, 1)[0];
          i--;
          p.level = 0;
          p.waitTicks = 0;
          p.quantumUsed = 0;
          queues[0].push(p);
        }
      }
    }

    let bestLevel = -1;
    for (let lvl = 0; lvl < 3; lvl++) {
      if (queues[lvl].length > 0) {
        bestLevel = lvl;
        break;
      }
    }

    if (!running) {
      if (bestLevel === -1) {
        if (arrivedIdx < procs.length) {
          const next = procs[arrivedIdx].arrival;
          addIdleSegment(gantt, time, next);
          time = next;
          pushArrivals(time);
          continue;
        }
        break;
      }
      running = queues[bestLevel].shift();
      ensureStartTime(running, time);
      running.quantumUsed = 0;
    } else if (bestLevel !== -1 && bestLevel < running.level) {
      queues[running.level].push(running);
      running.waitTicks = 0;
      running = queues[bestLevel].shift();
      ensureStartTime(running, time);
      running.quantumUsed = 0;
    }

    const tickStart = time;
    running.remaining--;
    running.quantumUsed++;
    time++;
    pushArrivals(time);
    const last = gantt[gantt.length - 1];
    if (last && last.pid === running.id && last.end === tickStart)
      last.end = time;
    else gantt.push({ pid: running.id, start: tickStart, end: time });

    if (running.remaining === 0) {
      running.completion = time;
      completed++;
      running = null;
      continue;
    }

    const q = LEVEL_QUANTUM[running.level];
    if (running.quantumUsed >= q) {
      const newLevel = Math.min(running.level + 1, 2);
      running.level = newLevel;
      running.quantumUsed = 0;
      running.waitTicks = 0;
      queues[newLevel].push(running);
      running = null;
    }
  }

  return { gantt, metrics: calculateCompletionMetrics(procs) };
}
