import type { GridState, AlgorithmResult, AnimationSequence, Cell } from "../types";
import { getNeighbors } from "../utils/neighbors";
import { reconstructPath } from "../lib/pathReconstruction";

/**
 * Executes Depth First Search (DFS) on the grid.
 * DFS resolves ties using a fixed neighbor expansion order: Up -> Down -> Left -> Right.
 * DFS is not cost-optimal or step-optimal.
 */
export function runDFS(grid: GridState): { result: AlgorithmResult; steps: AnimationSequence } {
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
    }))
  );

  const steps: AnimationSequence = [];

  // Edge case: Start equals Goal
  if (start.row === goal.row && start.col === goal.col) {
    const elapsed = performance.now() - startTime;
    return {
      result: {
        algorithm: "DFS",
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

  const stack: Array<{ row: number; col: number }> = [start];
  let maxFrontierSize = 1;
  let nodesExpanded = 0;

  // Track frontier status to emit frontier animation steps
  const inStack = new Set<string>();
  inStack.add(`${start.row},${start.col}`);

  let solutionFound = false;

  while (stack.length > 0) {
    maxFrontierSize = Math.max(maxFrontierSize, stack.length);
    const curr = stack.pop()!;
    inStack.delete(`${curr.row},${curr.col}`);

    const currCell = cells[curr.row][curr.col];

    // Nodes can be pushed multiple times; skip if already visited
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

    // Retrieve neighbors in Up -> Down -> Left -> Right order
    const neighbors = getNeighbors(curr, size);

    // Push in reverse order (Right, Left, Down, Up) to pop in correct order (Up, Down, Left, Right)
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const neighborCell = cells[neighbor.row][neighbor.col];

      if (neighborCell.terrain !== "wall" && !neighborCell.visited) {
        neighborCell.parent = curr;
        stack.push(neighbor);
        inStack.add(`${neighbor.row},${neighbor.col}`);

        steps.push({ type: "frontier", cell: neighbor });
      }
    }
  }

  // Reconstruct path
  const path = solutionFound ? reconstructPath(cells, start, goal) : [];

  // Calculate cumulative path cost
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
      algorithm: "DFS",
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
