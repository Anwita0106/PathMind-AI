import type { GridState, AlgorithmResult, AnimationSequence, Cell } from "../types";
import { getNeighbors } from "../utils/neighbors";
import { reconstructPath } from "../lib/pathReconstruction";

/**
 * Executes Breadth First Search (BFS) on the grid.
 * BFS is step-optimal but ignores terrain costs.
 */
export function runBFS(grid: GridState): { result: AlgorithmResult; steps: AnimationSequence } {
  const startTime = performance.now();
  const { size, cells: initialCells, start, goal } = grid;

  if (!start || !goal) {
    throw new Error("Start and Goal must be defined");
  }

  // Create deep copy of cells for pure function behavior
  const cells: Cell[][] = initialCells.map(row =>
    row.map(cell => ({
      ...cell,
      visited: false,
      inFrontier: false,
      isPath: false,
      parent: null,
      distance: Infinity,
    }))
  );

  const steps: AnimationSequence = [];

  // Edge case: Start equals Goal
  if (start.row === goal.row && start.col === goal.col) {
    const elapsed = performance.now() - startTime;
    return {
      result: {
        algorithm: "BFS",
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

  const queue: Array<{ row: number; col: number }> = [];
  let maxFrontierSize = 0;
  let nodesExpanded = 0;

  // Setup start cell
  const startCell = cells[start.row][start.col];
  startCell.visited = true;
  startCell.distance = 0;
  queue.push(start);
  maxFrontierSize = 1;

  let solutionFound = false;

  while (queue.length > 0) {
    maxFrontierSize = Math.max(maxFrontierSize, queue.length);
    const curr = queue.shift()!;
    const currCell = cells[curr.row][curr.col];

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

      if (neighborCell.terrain !== "wall" && !neighborCell.visited) {
        neighborCell.visited = true;
        neighborCell.parent = curr;
        neighborCell.distance = currCell.distance + 1;
        queue.push(neighbor);

        steps.push({ type: "frontier", cell: neighbor });
      }
    }
  }

  // Reconstruct final path
  const path = solutionFound ? reconstructPath(cells, start, goal) : [];

  // Calculate cumulative path cost (excluding start node itself)
  let pathCost = 0;
  if (solutionFound && path.length > 0) {
    pathCost = path.reduce((sum, pos) => {
      if (pos.row === start.row && pos.col === start.col) return sum;
      return sum + initialCells[pos.row][pos.col].cost;
    }, 0);
  }

  // Append path animation steps
  if (solutionFound) {
    for (const pos of path) {
      steps.push({ type: "path", cell: pos });
    }
  }

  const elapsed = performance.now() - startTime;

  return {
    result: {
      algorithm: "BFS",
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
