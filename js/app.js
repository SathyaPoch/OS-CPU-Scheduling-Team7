const ALGORITHMS = {
  fcfs: { name: "FCFS", fn: (procs) => fcfs(procs) },
  sjf: { name: "SJF (non-preemptive)", fn: (procs) => sjf(procs) },
  srt: { name: "SRT (preemptive)", fn: (procs) => srt(procs) },
  rr: { name: "Round Robin", fn: (procs, q) => roundRobin(procs, q) },
  mlfq: { name: "MLFQ (3-level)", fn: (procs) => mlfq(procs) },
};

function renderMetrics(result, processes) {
  const body = document.getElementById("metricsBody");
  body.innerHTML = "";
  let tw = 0,
    tt = 0,
    tr = 0,
    n = 0;
  processes.forEach((p) => {
    const m = result.metrics[p.id];
    if (!m) return;
    body.innerHTML += `<tr><td>${p.id}</td><td>${p.arrival}</td><td>${p.burst}</td><td>${m.waiting}</td><td>${m.turnaround}</td><td>${m.response}</td></tr>`;
    tw += m.waiting;
    tt += m.turnaround;
    tr += m.response;
    n++;
  });
  document.getElementById("avgLine").innerHTML =
    n > 0
      ? `avg waiting = <b>${(tw / n).toFixed(2)}</b> &nbsp; avg turnaround = <b>${(tt / n).toFixed(2)}</b> &nbsp; avg response = <b>${(tr / n).toFixed(2)}</b>`
      : "";
  document.getElementById("metricsPanel").style.display = "block";
}

function renderCompare(processes, quantum) {
  const rows = [];
  for (const key in ALGORITHMS) {
    const { name, fn } = ALGORITHMS[key];
    const result = fn(processes, quantum);
    let tw = 0,
      tt = 0,
      tr = 0,
      n = 0;
    processes.forEach((p) => {
      const m = result.metrics[p.id];
      if (m) {
        tw += m.waiting;
        tt += m.turnaround;
        tr += m.response;
        n++;
      }
    });
    rows.push({ name, aw: tw / n, at: tt / n, ar: tr / n });
  }
  const minAw = Math.min(...rows.map((r) => r.aw));
  const minAt = Math.min(...rows.map((r) => r.at));
  const minAr = Math.min(...rows.map((r) => r.ar));
  const body = document.getElementById("compareBody");
  body.innerHTML = rows
    .map(
      (r) => `
    <tr>
      <td>${r.name}</td>
      <td class="${r.aw === minAw ? "cmp-best" : ""}">${r.aw.toFixed(2)}</td>
      <td class="${r.at === minAt ? "cmp-best" : ""}">${r.at.toFixed(2)}</td>
      <td class="${r.ar === minAr ? "cmp-best" : ""}">${r.ar.toFixed(2)}</td>
    </tr>`,
    )
    .join("");
  document.getElementById("comparePanel").style.display = "block";
}

function updateQuantumVisibility() {
  const algoKey = document.getElementById("algoSelect").value;
  const quantumField = document.getElementById("quantumField");
  quantumField.style.display = algoKey === "rr" ? "flex" : "none";
}

function run() {
  const processes = readProcesses();
  if (processes.length === 0) {
    alert("Add at least one process first.");
    return;
  }
  const ids = processes.map((p) => p.id);
  if (new Set(ids).size !== ids.length) {
    alert("Process IDs must be unique.");
    return;
  }

  const algoKey = document.getElementById("algoSelect").value;
  const quantum = Math.max(
    1,
    parseInt(document.getElementById("quantum").value) || 2,
  );

  document.getElementById("comparePanel").style.display = "none";
  document.getElementById("ganttPanel").style.display = "none";
  document.getElementById("metricsPanel").style.display = "none";

  if (algoKey === "all") {
    renderCompare(processes, quantum);
    const result = ALGORITHMS.fcfs.fn(processes, quantum);
    document.getElementById("ganttTitle").textContent =
      "gantt chart — FCFS (reference view)";
    renderGantt(result, processes);
    renderMetrics(result, processes);
    return;
  }

  const { name, fn } = ALGORITHMS[algoKey];
  const result = fn(processes, quantum);
  document.getElementById("ganttTitle").textContent = "gantt chart — " + name;
  renderGantt(result, processes);
  renderMetrics(result, processes);
}

document.getElementById("algoSelect").addEventListener("change", updateQuantumVisibility);
updateQuantumVisibility();
loadSample();
