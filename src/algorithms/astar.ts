import type { GridState, AlgorithmResult, AnimationSequence, Cell } from "../types";
import { getNeighbors } from "../utils/neighbors";
import { reconstructPath } from "../lib/pathReconstruction";
import { manhattanDistance } from "./heuristics";

/**
 * Executes A* Search on the grid.
 * A* uses f(n) = g(n) + h(n), where g(n) is cumulative cost and h(n) is Manhattan distance.
 * Resolves ties first by lower heuristic, then by earlier insertion order (FIFO).
 * It is optimal and cost-aware.
 */
export function runAStar(grid: GridState): { result: AlgorithmResult; steps: AnimationSequence } {
  const startTime = performance.now();
  const { size, cells: initialCells, start, goal } = grid;

  if (!start || !goal) {
    throw new Error("Start and Goal must be defined");
  }

  // Create deep copy of cells
  const cells: Cell[][] = initialCells.map(row =>
    row.map(cell => ({
      ...cell,
      visited: false,
      inFrontier: false,
      isPath: false,
      parent: null,
      distance: Infinity, // g(n)
      heuristic: Infinity, // h(n)
    }))
  );

  const steps: AnimationSequence = [];

  // Edge case: Start equals Goal
  if (start.row === goal.row && start.col === goal.col) {
    const elapsed = performance.now() - startTime;
    return {
      result: {
        algorithm: "ASTAR",
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
    h: number;
    f: number;
    id: number; // Insert ID for FIFO tie-breaking
  };

  const pq: PriorityQueueEntry[] = [];
  let insertCount = 0;
  let maxFrontierSize = 0;
  let nodesExpanded = 0;

  // Initialize start node
  const startH = manhattanDistance(start, goal);
  const startCell = cells[start.row][start.col];
  startCell.distance = 0;
  startCell.heuristic = startH;
  pq.push({
    row: start.row,
    col: start.col,
    g: 0,
    h: startH,
    f: startH,
    id: insertCount++,
  });
  maxFrontierSize = 1;

  let solutionFound = false;

  while (pq.length > 0) {
    maxFrontierSize = Math.max(maxFrontierSize, pq.length);

    // Find entry with lowest f(n)
    let bestIdx = 0;
    for (let i = 1; i < pq.length; i++) {
      const a = pq[i];
      const b = pq[bestIdx];

      if (a.f < b.f) {
        bestIdx = i;
      } else if (a.f === b.f) {
        // Tie-breaker 1: Lower heuristic value h(n) first
        if (a.h < b.h) {
          bestIdx = i;
        } else if (a.h === b.h) {
          // Tie-breaker 2: Earlier insertion order (FIFO)
          if (a.id < b.id) {
            bestIdx = i;
          }
        }
      }
    }

    const curr = pq.splice(bestIdx, 1)[0];
    const currCell = cells[curr.row][curr.col];

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

      const newG = curr.g + neighborCell.cost;

      if (newG < neighborCell.distance) {
        const h = manhattanDistance(neighbor, goal);
        neighborCell.distance = newG;
        neighborCell.heuristic = h;
        neighborCell.parent = curr;

        pq.push({
          row: neighbor.row,
          col: neighbor.col,
          g: newG,
          h: h,
          f: newG + h,
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
      algorithm: "ASTAR",
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
