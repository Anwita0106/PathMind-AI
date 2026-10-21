import { useState, useCallback } from "react";
import type { Cell, GridSize, ToolType, GridState } from "../types";
import { TERRAIN_COSTS } from "../constants/terrain";

/**
 * Creates a clean grid of specified size with optional start and goal.
 */
export function createEmptyGrid(
  size: GridSize,
  startPos: { row: number; col: number } | null,
  goalPos: { row: number; col: number } | null
): Cell[][] {
  const cells: Cell[][] = [];
  for (let r = 0; r < size; r++) {
    const rowCells: Cell[] = [];
    for (let c = 0; c < size; c++) {
      const isStart = startPos ? r === startPos.row && c === startPos.col : false;
      const isGoal = goalPos ? r === goalPos.row && c === goalPos.col : false;
      rowCells.push({
        row: r,
        col: c,
        terrain: "normal",
        cost: 1,
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

export function useGridState() {
  const [gridSize, setGridSize] = useState<GridSize>(20);
  const [start, setStart] = useState<{ row: number; col: number } | null>({ row: 5, col: 5 });
  const [goal, setGoal] = useState<{ row: number; col: number } | null>({ row: 15, col: 15 });
  
  const [cells, setCells] = useState<Cell[][]>(() =>
    createEmptyGrid(20, { row: 5, col: 5 }, { row: 15, col: 15 })
  );

  /**
   * Resets the entire grid (clears all walls, terrain, start/goal defaults remain).
   */
  const resetBoard = useCallback(() => {
    const defaultStart = { row: 5, col: 5 };
    const defaultGoal = gridSize === 20 ? { row: 15, col: 15 } : { row: 20, col: 20 };
    setStart(defaultStart);
    setGoal(defaultGoal);
    setCells(createEmptyGrid(gridSize, defaultStart, defaultGoal));
  }, [gridSize]);

  /**
   * Completely clears all walls and terrain, but preserves the current start/goal positions.
   */
  const clearBoard = useCallback(() => {
    setCells(createEmptyGrid(gridSize, start, goal));
  }, [gridSize, start, goal]);

  /**
   * Clears search-time visualization metadata (visited, frontier, path) while preserving walls/terrain.
   */
  const clearVisualization = useCallback(() => {
    setCells(prev =>
      prev.map(row =>
        row.map(cell => ({
          ...cell,
          visited: false,
          inFrontier: false,
          isPath: false,
          isCurrent: false,
          parent: null,
          distance: Infinity,
          heuristic: Infinity,
        }))
      )
    );
  }, []);

  /**
   * Changes the grid size and resets the board (as required by FR1).
   */
  const changeGridSize = useCallback((size: GridSize) => {
    setGridSize(size);
    const newStart = { row: 5, col: 5 };
    const newGoal = size === 20 ? { row: 15, col: 15 } : { row: 20, col: 20 };
    setStart(newStart);
    setGoal(newGoal);
    setCells(createEmptyGrid(size, newStart, newGoal));
  }, []);

  /**
   * Updates cell properties based on the active tool.
   * Rejects placement if terrain/obstacle is painted over start/goal.
   */
  const interactCell = useCallback((row: number, col: number, tool: ToolType) => {
    setCells(prev => {
      const newCells = prev.map(r => r.map(c => ({ ...c })));
      const cell = newCells[row][col];

      // Edge case rules: placement of obstacles/terrain on Start/Goal is rejected.
      if (cell.isStart || cell.isGoal) {
        if (tool !== "erase" && tool !== "start" && tool !== "goal") {
          return prev; // Reject placement
        }
      }

      if (tool === "start") {
        if (cell.isGoal) return prev; // Cannot make goal start
        
        // Remove previous start
        newCells.forEach(r =>
          r.forEach(c => {
            if (c.isStart) c.isStart = false;
          })
        );
        cell.isStart = true;
        cell.terrain = "normal";
        cell.cost = 1;
        setStart({ row, col });
      } else if (tool === "goal") {
        if (cell.isStart) return prev; // Cannot make start goal
        
        // Remove previous goal
        newCells.forEach(r =>
          r.forEach(c => {
            if (c.isGoal) c.isGoal = false;
          })
        );
        cell.isGoal = true;
        cell.terrain = "normal";
        cell.cost = 1;
        setGoal({ row, col });
      } else if (tool === "wall") {
        cell.terrain = "wall";
        cell.cost = Infinity;
      } else if (tool === "mud") {
        cell.terrain = "mud";
        cell.cost = TERRAIN_COSTS.mud;
      } else if (tool === "water") {
        cell.terrain = "water";
        cell.cost = TERRAIN_COSTS.water;
      } else if (tool === "erase") {
        // Do not erase Start or Goal
        if (!cell.isStart && !cell.isGoal) {
          cell.terrain = "normal";
          cell.cost = 1;
        }
      }

      return newCells;
    });
  }, []);

  const setManualCells = useCallback((newCells: Cell[][] | ((prev: Cell[][]) => Cell[][])) => {
    setCells(prev => {
      const nextCells = typeof newCells === "function" ? newCells(prev) : newCells;
      let foundStart: { row: number; col: number } | null = null;
      let foundGoal: { row: number; col: number } | null = null;
      for (let r = 0; r < nextCells.length; r++) {
        for (let c = 0; c < nextCells[r].length; c++) {
          if (nextCells[r][c].isStart) foundStart = { row: r, col: c };
          if (nextCells[r][c].isGoal) foundGoal = { row: r, col: c };
        }
      }
      setStart(foundStart);
      setGoal(foundGoal);
      return nextCells;
    });
  }, []);

  return {
    gridSize,
    cells,
    start,
    goal,
    changeGridSize,
    interactCell,
    resetBoard,
    clearBoard,
    clearVisualization,
    setCells: setManualCells,
    gridState: { size: gridSize, cells, start, goal } as GridState,
  };
}
