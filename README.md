This GitHub Repository is deployed.
**Click on this link to access the Website** :

[![Github repo](https://img.shields.io/badge/github-:repo-blue)](<[https://github.com/your-username/your-repository](https://github.com/your-username/your-repository)>) : https://sathyapoch.github.io/OS-CPU-Scheduling-Team7/

## Description of algorithms implemented

| Algorithms                | Header 2     | Header 3        |
| ------------------------- | ------------ | --------------- |
| First Come First Serve    | Row 1, Col 2 | Row 1, Col 3    |
| Round Robin               | Row 2, Col 2 | Row 2, Col 3    |
| Shortest Job First        | Row 2, Col 2 | Row 2, Col 3    |
| Shortest Remaining Time   | Row 2, Col 2 | or Row 2, Col 3 |
| Multilevel Feedback Queue | Row 2, Col 2 | Row 2, Col 3    |

## Instructions on how to run each scheduler
## Instructions on How to Run Each Scheduler

This is a pure client-side project (plain HTML/CSS/JavaScript) — no build step, no server, no dependencies to install.

**1. Launch the app**
- Clone/download the repo, then just open `index.html` in any modern browser (Chrome, Edge, Firefox).
- Optionally serve it locally, e.g. `npx serve .` or the VS Code "Live Server" extension, then visit the shown `localhost` URL.

**2. Enter your processes**
- The **process table** panel lets you add rows via the **Add Process** button — each row takes a PID, Arrival time, and Burst time.
- Or click **Example Scenario** to auto-fill the built-in sample (P1–P4) used throughout the report.
- Process IDs must be unique, or the app will alert you when you try to run.

**3. Choose an algorithm**
- Use the **Algorithm** dropdown in the "Run configuration" panel to pick one of:
  - `FCFS`
  - `SJF (non-preemptive)`
  - `SRT (preemptive)`
  - `Round Robin`
  - `MLFQ (3-level)`
  - `Compare all 5` — runs every algorithm at once and shows a side-by-side comparison table
- If you select **Round Robin**, a **quantum** field appears — set the time slice (default 2). This field is ignored for every other algorithm, since MLFQ uses its own fixed quantum schedule (Queue0 = RR q=2, Queue1 = RR q=4, Queue2 = FCFS) and the rest have no quantum.

**4. Run it**
- Click **RUN**.
- The **Gantt chart** panel renders the execution timeline.
- The **Metrics** panel shows per-process Waiting, Turnaround, and Response time, plus the averages.
- If you picked **Compare all 5**, an additional **Comparative Analysis** panel appears, showing average metrics for all five algorithms side by side with the best (lowest) value in each column highlighted.

## Sample Input/Output

**Sample Input** (built-in "Example Scenario")

| PID | Arrival | Burst |
|-----|---------|-------|
| P1  | 0       | 5     |
| P2  | 1       | 3     |
| P3  | 2       | 8     |
| P4  | 3       | 6     |

Round Robin quantum used: **2**

**Sample Output**

*FCFS*
Gantt: `P1[0-5] → P2[5-8] → P3[8-16] → P4[16-22]`
Avg waiting = 5.75, avg turnaround = 11.25, avg response = 5.75

*SJF (non-preemptive)*
Gantt: `P1[0-5] → P2[5-8] → P4[8-14] → P3[14-22]`
Avg waiting = 5.25, avg turnaround = 10.75, avg response = 5.25

*SRT (preemptive)*
Gantt: `P1[0-1] → P2[1-4] → P1[4-8] → P4[8-14] → P3[14-22]`
Avg waiting = 5.00, avg turnaround = 10.50, avg response = 4.25

*Round Robin (q=2)*
Gantt: `P1[0-2] → P2[2-4] → P3[4-6] → P1[6-8] → P4[8-10] → P2[10-11] → P3[11-13] → P1[13-14] → P4[14-16] → P3[16-18] → P4[18-20] → P3[20-22]`
Avg waiting = 9.75, avg turnaround = 15.25, avg response = 2.00

*MLFQ (3-level)*
Gantt: `P1[0-2] → P2[2-4] → P3[4-6] → P4[6-8] → P1[8-11] → P2[11-12] → P3[12-16] → P4[16-20] → P3[20-22]`
Avg waiting = 9.25, avg turnaround = 14.75, avg response = 1.50

**Comparative summary (best value per column bolded)**

| Algorithm | Avg Waiting | Avg Turnaround | Avg Response |
|-----------|-------------|-----------------|----------------|
| FCFS | 5.75 | 11.25 | 5.75 |
| SJF | 5.25 | 10.75 | 5.25 |
| SRT | **5.00** | **10.50** | 4.25 |
| Round Robin (q=2) | 9.75 | 15.25 | 2.00 |
| MLFQ | 9.25 | 14.75 | **1.50** |

## Screenshots or Gantt chart output
