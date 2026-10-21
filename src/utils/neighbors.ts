export type Position = { row: number; col: number };

/**
 * Returns 4-directional neighbors of a cell in the specific order: Up -> Down -> Left -> Right.
 * This order is critical for deterministic behavior (especially in DFS) and consistency.
 */
export function getNeighbors(pos: Position, size: number): Position[] {
  const { row, col } = pos;
  const neighbors: Position[] = [];

  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 },  // Right
  ];

  for (const dir of directions) {
    const r = row + dir.row;
    const c = col + dir.col;

    if (r >= 0 && r < size && c >= 0 && c < size) {
      neighbors.push({ row: r, col: c });
    }
  }

  return neighbors;
}
