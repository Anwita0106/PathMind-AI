import { useCallback } from "react";
import type { GridSize, Cell } from "../types";
import { generateMaze } from "../lib/mazeGenerator";

/**
 * Custom hook wrapping the maze generator logic.
 * Triggers state updates in the grid and clears stale search results.
 */
export function useMazeGenerator(
  gridSize: GridSize,
  start: { row: number; col: number } | null,
  goal: { row: number; col: number } | null,
  setCells: (cells: Cell[][]) => void,
  clearResults: () => void
) {
  const generateRandomMaze = useCallback(() => {
    if (!start || !goal) return;
    clearResults();
    const newCells = generateMaze(gridSize, start, goal);
    setCells(newCells);
  }, [gridSize, start, goal, setCells, clearResults]);

  return {
    generateRandomMaze,
  };
}
