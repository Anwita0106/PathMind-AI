import type { AlgorithmType, GridState, AlgorithmResult, AnimationSequence } from "../types";
import { runBFS } from "./bfs";
import { runDFS } from "./dfs";
import { runUCS } from "./ucs";
import { runAStar } from "./astar";

/**
 * Runs the selected pathfinding algorithm on the given grid state.
 * Returns the search metrics and the full sequence of animation steps.
 */
export function runAlgorithm(
  type: AlgorithmType,
  grid: GridState
): { result: AlgorithmResult; steps: AnimationSequence } {
  switch (type) {
    case "BFS":
      return runBFS(grid);
    case "DFS":
      return runDFS(grid);
    case "UCS":
      return runUCS(grid);
    case "ASTAR":
      return runAStar(grid);
    default:
      throw new Error(`Unknown algorithm type: ${type}`);
  }
}

export * from "./bfs";
export * from "./dfs";
export * from "./ucs";
export * from "./astar";
export * from "./heuristics";
