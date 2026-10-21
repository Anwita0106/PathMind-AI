import type { Cell, GridSize, TerrainType } from "../types";
import { getNeighbors } from "../utils/neighbors";

/**
 * Checks if there is a valid traversable path from Start to Goal in the cell grid.
 * Uses a lightweight BFS search.
 */
function checkSolvability(
  size: GridSize,
  start: { row: number; col: number },
  goal: { row: number; col: number },
  cells: Cell[][]
): boolean {
  const queue: Array<{ row: number; col: number }> = [start];
  const visited = new Set<string>();
  visited.add(`${start.row},${start.col}`);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr.row === goal.row && curr.col === goal.col) {
      return true;
    }

    const neighbors = getNeighbors(curr, size);
    for (const neighbor of neighbors) {
      const neighborCell = cells[neighbor.row][neighbor.col];
      const key = `${neighbor.row},${neighbor.col}`;

      if (neighborCell.terrain !== "wall" && !visited.has(key)) {
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }

  return false;
}

/**
 * Generates a randomized maze.
 * - 25% obstacle density.
 * - Remaining cells: 70% Normal, 20% Mud, 10% Water.
 * - Retries up to 5 times to ensure solubility.
 * - Falls back to a guaranteed-solvable corridor maze if retries fail.
 */
export function generateMaze(
  size: GridSize,
  start: { row: number; col: number },
  goal: { row: number; col: number }
): Cell[][] {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const cells: Cell[][] = [];

    for (let r = 0; r < size; r++) {
      const rowCells: Cell[] = [];
      for (let c = 0; c < size; c++) {
        const isStart = r === start.row && c === start.col;
        const isGoal = r === goal.row && c === goal.col;

        let terrain: TerrainType = "normal";
        let cost = 1;

        if (!isStart && !isGoal) {
          if (Math.random() < 0.25) {
            terrain = "wall";
            cost = Infinity;
          } else {
            const rand = Math.random();
            if (rand < 0.70) {
              terrain = "normal";
              cost = 1;
            } else if (rand < 0.90) {
              terrain = "mud";
              cost = 3;
            } else {
              terrain = "water";
              cost = 5;
            }
          }
        }

        rowCells.push({
          row: r,
          col: c,
          terrain,
          cost,
          isStart,
          isGoal,
          visited: false,
          inFrontier: false,
          isPath: false,
          parent: null,
          distance: Infinity,
          heuristic: Infinity,
        });
      }
      cells.push(rowCells);
    }

    if (checkSolvability(size, start, goal, cells)) {
      return cells;
    }
  }

  // FALLBACK TEMPLATE: Create a guaranteed solvable maze by keeping a corridor clear of walls
  const cells: Cell[][] = [];
  for (let r = 0; r < size; r++) {
    const rowCells: Cell[] = [];
    for (let c = 0; c < size; c++) {
      const isStart = r === start.row && c === start.col;
      const isGoal = r === goal.row && c === goal.col;

      let terrain: TerrainType = "normal";
      let cost = 1;

      // Draw a corridor along the start-row and goal-col to guarantee a path
      const inClearCorridor =
        (r >= Math.min(start.row, goal.row) &&
          r <= Math.max(start.row, goal.row) &&
          c === start.col) ||
        (c >= Math.min(start.col, goal.col) &&
          c <= Math.max(start.col, goal.col) &&
          r === goal.row);

      if (!isStart && !isGoal) {
        if (inClearCorridor) {
          // Corridor can contain Mud or Water, but no blocking walls
          const rand = Math.random();
          if (rand < 0.70) {
            terrain = "normal";
            cost = 1;
          } else if (rand < 0.90) {
            terrain = "mud";
            cost = 3;
          } else {
            terrain = "water";
            cost = 5;
          }
        } else {
          // Standard distribution elsewhere (including walls)
          if (Math.random() < 0.25) {
            terrain = "wall";
            cost = Infinity;
          } else {
            const rand = Math.random();
            if (rand < 0.70) {
              terrain = "normal";
              cost = 1;
            } else if (rand < 0.90) {
              terrain = "mud";
              cost = 3;
            } else {
              terrain = "water";
              cost = 5;
            }
          }
        }
      }

      rowCells.push({
        row: r,
        col: c,
        terrain,
        cost,
        isStart,
        isGoal,
        visited: false,
        inFrontier: false,
        isPath: false,
        parent: null,
        distance: Infinity,
        heuristic: Infinity,
      });
    }
    cells.push(rowCells);
  }

  return cells;
}
