function addRow(pid = "", arrival = 0, burst = 1) {
  const tbody = document.getElementById("procBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" value="${pid}" placeholder="P${tbody.children.length + 1}"></td>
    <td><input type="number" min="0" value="${arrival}"></td>
    <td><input type="number" min="1" value="${burst}"></td>
    <td class="row-actions"><button onclick="this.closest('tr').remove(); updateCount();">✕</button></td>
  `;
  tbody.appendChild(tr);
  updateCount();
}

function updateCount() {
  document.getElementById("procCount").textContent =
    document.getElementById("procBody").children.length + " processes";
}

function loadSample() {
  document.getElementById("procBody").innerHTML = "";
  document.getElementById("procTitle").textContent = "Process Table";
  addRow("P1", 0, 5);
  addRow("P2", 1, 3);
  addRow("P3", 2, 8);
  addRow("P4", 3, 6);
}

function readProcesses() {
  const rows = [...document.getElementById("procBody").children];
  return rows.map((tr, i) => {
    const inputs = tr.querySelectorAll("input");
    const pid = inputs[0].value.trim() || "P" + (i + 1);
    return {
      id: pid,
      arrival: parseInt(inputs[1].value) || 0,
      burst: Math.max(1, parseInt(inputs[2].value) || 1),
    };
  });
}
