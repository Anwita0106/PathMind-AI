type Position = { row: number; col: number };

/**
 * Computes Manhattan Distance between two points.
 * h(n) = |x1 - x2| + |y1 - y2|
 */
export function manhattanDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
}
