export type AlgorithmType = "BFS" | "DFS" | "UCS" | "ASTAR";
export type SpeedLevel = "slow" | "medium" | "fast";

export type AlgorithmResult = {
  algorithm: AlgorithmType;
  pathLength: number;
  pathCost: number;
  nodesExpanded: number;
  maxFrontierSize: number;
  computationTimeMs: number;
  solutionFound: boolean;
  path: Array<{ row: number; col: number }>;
};
