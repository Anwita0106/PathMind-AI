export type TerrainType = "normal" | "mud" | "water" | "wall";
export type ToolType = "start" | "goal" | "wall" | "mud" | "water" | "erase";
export type GridSize = 20 | 25;

export type Cell = {
  row: number;
  col: number;
  terrain: TerrainType;
  cost: number;            // derived from terrain: normal=1, mud=3, water=5, wall=Infinity
  isStart: boolean;
  isGoal: boolean;
  // search-time metadata (reset before each run)
  visited: boolean;
  inFrontier: boolean;
  isPath: boolean;
  parent: { row: number; col: number } | null;
  distance: number;        // g(n)
  heuristic: number;       // h(n), A* only
  isCurrent?: boolean;     // transient search-time metadata
};

export type GridState = {
  size: GridSize;
  cells: Cell[][];
  start: { row: number; col: number } | null;
  goal: { row: number; col: number } | null;
};
