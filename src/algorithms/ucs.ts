import type { GridState, AlgorithmResult, AnimationSequence, Cell } from "../types";
import { getNeighbors } from "../utils/neighbors";
import { reconstructPath } from "../lib/pathReconstruction";

/**
 * Executes Uniform Cost Search (UCS) on the grid.
 * UCS expands nodes in order of cumulative path cost.
 * It is optimal and cost-aware.
 */
export function runUCS(grid: GridState): { result: AlgorithmResult; steps: AnimationSequence } {
  const startTime = performance.now();
  const { size, cells: initialCells, start, goal } = grid;

  if (!start || !goal) {
    throw new Error("Start and Goal must be defined");
  }

  // Deep copy cells for pure function behavior
  const cells: Cell[][] = initialCells.map(row =>
    row.map(cell => ({
      ...cell,
      visited: false,
      inFrontier: false,
      isPath: false,
      parent: null,
      distance: Infinity, // g(n)
    }))
  );

  const steps: AnimationSequence = [];

  // Edge case: Start equals Goal
  if (start.row === goal.row && start.col === goal.col) {
    const elapsed = performance.now() - startTime;
    return {
      result: {
        algorithm: "UCS",
        pathLength: 0,
        pathCost: 0,
        nodesExpanded: 0,
        maxFrontierSize: 0,
        computationTimeMs: elapsed,
        solutionFound: true,
        path: [start],
      },
      steps: [],
    };
  }

  type PriorityQueueEntry = {
    row: number;
    col: number;
    g: number;
    id: number; // Insert ID for FIFO tie-breaking
  };

  const pq: PriorityQueueEntry[] = [];
  let insertCount = 0;
  let maxFrontierSize = 0;
  let nodesExpanded = 0;

  // Initialize start node
  const startCell = cells[start.row][start.col];
  startCell.distance = 0;
  pq.push({ row: start.row, col: start.col, g: 0, id: insertCount++ });
  maxFrontierSize = 1;

  let solutionFound = false;

  while (pq.length > 0) {
    maxFrontierSize = Math.max(maxFrontierSize, pq.length);

    // Find entry with lowest cumulative cost g(n)
    let bestIdx = 0;
    for (let i = 1; i < pq.length; i++) {
      const a = pq[i];
      const b = pq[bestIdx];

      if (a.g < b.g) {
        bestIdx = i;
      } else if (a.g === b.g) {
        // Tie-breaker: earlier insertion order (FIFO)
        if (a.id < b.id) {
          bestIdx = i;
        }
      }
    }

    const curr = pq.splice(bestIdx, 1)[0];
    const currCell = cells[curr.row][curr.col];

    // If node already visited, skip
    if (currCell.visited) {
      continue;
    }

    currCell.visited = true;
    steps.push({ type: "current", cell: curr });
    nodesExpanded++;

    if (curr.row === goal.row && curr.col === goal.col) {
      solutionFound = true;
      break;
    }

    steps.push({ type: "visited", cell: curr });

    const neighbors = getNeighbors(curr, size);
    for (const neighbor of neighbors) {
      const neighborCell = cells[neighbor.row][neighbor.col];

      if (neighborCell.terrain === "wall" || neighborCell.visited) {
        continue;
      }

      // Calculate cumulative path cost to neighbor
      const newG = curr.g + neighborCell.cost;

      // If new path is shorter/cheaper, update neighbor
      if (newG < neighborCell.distance) {
        neighborCell.distance = newG;
        neighborCell.parent = curr;

        pq.push({
          row: neighbor.row,
          col: neighbor.col,
          g: newG,
          id: insertCount++,
        });

        steps.push({ type: "frontier", cell: neighbor });
      }
    }
  }

  // Reconstruct path
  const path = solutionFound ? reconstructPath(cells, start, goal) : [];

  // Calculate final path cost
  let pathCost = 0;
  if (solutionFound && path.length > 0) {
    pathCost = path.reduce((sum, pos) => {
      if (pos.row === start.row && pos.col === start.col) return sum;
      return sum + initialCells[pos.row][pos.col].cost;
    }, 0);
  }

  // Path steps rendering
  if (solutionFound) {
    for (const pos of path) {
      steps.push({ type: "path", cell: pos });
    }
  }

  const elapsed = performance.now() - startTime;

  return {
    result: {
      algorithm: "UCS",
      pathLength: path.length,
      pathCost,
      nodesExpanded,
      maxFrontierSize,
      computationTimeMs: elapsed,
      solutionFound,
      path,
    },
    steps,
  };
}
