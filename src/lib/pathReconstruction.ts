import type { Cell } from "../types/grid";

type Position = { row: number; col: number };

/**
 * Reconstructs the final path from goal to start using parent cell metadata.
 * Returns the path in order from start to goal.
 */
export function reconstructPath(
  cells: Cell[][],
  start: Position,
  goal: Position
): Position[] {
  // If Start is the same as Goal, path is just the Start node (length 0, cost 0 in stats)
  if (start.row === goal.row && start.col === goal.col) {
    return [start];
  }

  const goalCell = cells[goal.row][goal.col];
  if (!goalCell.parent) {
    return []; // No path exists
  }

  const path: Position[] = [];
  let current: Position | null = goal;
  const visitedSet = new Set<string>();

  while (current !== null) {
    const key = `${current.row},${current.col}`;
    if (visitedSet.has(key)) {
      return [];
    }
    visitedSet.add(key);
    path.push(current);

    if (current.row === start.row && current.col === start.col) {
      break;
    }

    current = cells[current.row][current.col].parent;
  }

  const last = path[path.length - 1];
  if (!last || last.row !== start.row || last.col !== start.col) {
    return [];
  }

  return path.reverse();
}
