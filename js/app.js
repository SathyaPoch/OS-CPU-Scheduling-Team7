const ALGORITHMS = {
  fcfs: { name: "First Come First Served", fn: (procs) => fcfs(procs) },
  sjf: {
    name: "Shortest Job First (non-preemptive)",
    fn: (procs) => sjf(procs),
  },
  srt: {
    name: "Shortest Remaining Time (preemptive)",
    fn: (procs) => srt(procs),
  },
  rr: { name: "Round Robin", fn: (procs, q) => roundRobin(procs, q) },
  mlfq: {
    name: "Multi-Level Feedback Queue (3-level)",
    fn: (procs) => mlfq(procs),
  },
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
      ? `Average Waiting Time = <b>${(tw / n).toFixed(2)}</b> &nbsp; Average Turnaround Time = <b>${(tt / n).toFixed(2)}</b> &nbsp; Average Response Time S= <b>${(tr / n).toFixed(2)}</b>`
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

  const totalAw = rows.reduce((sum, r) => sum + r.aw, 0);
  const totalAt = rows.reduce((sum, r) => sum + r.at, 0);
  const totalAr = rows.reduce((sum, r) => sum + r.ar, 0);
  const count = rows.length;

  document.getElementById("compareAvgLine").innerHTML =
    count > 0
      ? `Average Waiting Time = <b>${(totalAw / count).toFixed(2)}</b> &nbsp; Average Turnaround Time = <b>${(totalAt / count).toFixed(2)}</b> &nbsp; Average Response Time = <b>${(totalAr / count).toFixed(2)}</b>`
      : "";

  document.getElementById("comparePanel").style.display = "block";
}

function updateAlgoNote(algoKey) {
  const note = document.getElementById("algoNote");
  const descriptions = {
    fcfs: "The process which arrives first in the ready queue is firstly assigned the CPU.",
    sjf: "Shortest Job First selects the process with the smallest burst time from the ready queue.",
    srt: "Shortest Remaining Time preempts the current process when a shorter job arrives.",
    rr: "Round Robin assigns each process a fixed quantum before moving it to the back of the queue.",
    mlfq: "MLFQ uses a 3-level structure: (Queue 1: RR q=2, Queue 2: RR q=4, Queue 3: FCFS). To prevent starvation, the aging mechanism triggers once a process spends 10 ticks in an idle state.",
    all: "Compare all algorithms to see average waiting time , turnaround time and response times.",
  };

  note.textContent = descriptions[algoKey] || "";
}

function updateQuantumVisibility() {
  const algoKey = document.getElementById("algoSelect").value;
  const quantumField = document.getElementById("quantumField");
  quantumField.style.display = algoKey === "rr" ? "flex" : "none";
  updateAlgoNote(algoKey);
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
      "gantt chart FCFS (reference view)";
    renderGantt(result, processes);
    renderMetrics(result, processes);
    return;
  }

  const { name, fn } = ALGORITHMS[algoKey];
  const result = fn(processes, quantum);
  document.getElementById("ganttTitle").textContent = "gantt chart :" + name;
  renderGantt(result, processes);
  renderMetrics(result, processes);
}

const options = {
  margin: 0.5,
  filename: "CPU_Simulator.pdf",
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
};

const downloadBtn = document.getElementById("download-btn");
downloadBtn.addEventListener("click", () => {
  const element = document.getElementById("invoice");
  downloadBtn.style.display = "none";
  html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      downloadBtn.style.display = "inline-block";
    })
    .catch(() => {
      downloadBtn.style.display = "inline-block";
    });
});

document
  .getElementById("algoSelect")
  .addEventListener("change", updateQuantumVisibility);
updateQuantumVisibility();
