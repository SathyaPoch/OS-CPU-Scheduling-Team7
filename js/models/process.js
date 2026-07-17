function createProcess(id, arrival = 0, burst = 1) {
  return { id, arrival, burst };
}

function cloneProcesses(processes) {
  return processes.map((p) => ({ ...p }));
}

function sortByArrivalId(processes) {
  return [...processes].sort(
    (a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id),
  );
}
