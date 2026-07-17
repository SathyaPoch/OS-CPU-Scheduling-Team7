const PALETTE = [
  "var(--p1)",
  "var(--p2)",
  "var(--p3)",
  "var(--p4)",
  "var(--p5)",
  "var(--p6)",
];

function colorFor(pid, order) {
  const idx = order.indexOf(pid);
  return PALETTE[idx % PALETTE.length];
}

function renderGantt(result, processes) {
  const UNIT = 34;
  const order = processes.map((p) => p.id);
  const track = document.getElementById("ganttTrack");
  const ticks = document.getElementById("ganttTicks");
  track.innerHTML = "";
  ticks.innerHTML = "";
  track.className = "g-track gantt-track";

  result.gantt.forEach((seg) => {
    const div = document.createElement("div");
    const width = (seg.end - seg.start) * UNIT;
    div.className = "g-block" + (seg.pid === "IDLE" ? " idle" : "");
    div.style.width = width + "px";
    div.style.background = seg.pid === "IDLE" ? "" : colorFor(seg.pid, order);
    div.textContent = seg.pid === "IDLE" ? "idle" : seg.pid;
    track.appendChild(div);
  });

  const totalEnd = result.gantt.length
    ? result.gantt[result.gantt.length - 1].end
    : 0;
  const marks = new Set([0, totalEnd]);
  result.gantt.forEach((seg) => marks.add(seg.start));
  [...marks]
    .sort((a, b) => a - b)
    .forEach((t) => {
      const span = document.createElement("span");
      span.className = "g-tick";
      span.style.left = t * UNIT + "px";
      span.style.transform = t === 0 ? "none" : "translateX(-50%)";
      span.textContent = t;
      ticks.appendChild(span);
    });
  ticks.style.width = totalEnd * UNIT + "px";

  const legend = document.getElementById("ganttLegend");
  legend.innerHTML = "";
  order.forEach((pid) => {
    legend.innerHTML += `<span><span class="swatch" style="background:${colorFor(pid, order)}"></span>${pid}</span>`;
  });

  document.getElementById("ganttPanel").style.display = "block";
}
