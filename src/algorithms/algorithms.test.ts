import { describe, it, expect } from "vitest";
import type { Cell, GridState, GridSize } from "../types";
import { runBFS } from "./bfs";
import { runDFS } from "./dfs";
import { runUCS } from "./ucs";
import { runAStar } from "./astar";

function makeCell(
  row: number,
  col: number,
  terrain: Cell["terrain"] = "normal"
): Cell {
  const cost =
    terrain === "wall"
      ? Infinity
      : terrain === "mud"
        ? 3
        : terrain === "water"
          ? 5
          : 1;
  return {
    row,
    col,
    terrain,
    cost,
    isStart: false,
    isGoal: false,
    visited: false,
    inFrontier: false,
    isPath: false,
    parent: null,
    distance: Infinity,
    heuristic: Infinity,
  };
}

function buildGrid(
  size: GridSize,
  start: { row: number; col: number },
  goal: { row: number; col: number },
  terrainAt?: (row: number, col: number) => Cell["terrain"]
): GridState {
  const cells: Cell[][] = [];
  for (let r = 0; r < size; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < size; c++) {
      const terrain = terrainAt ? terrainAt(r, c) : "normal";
      const cell = makeCell(r, c, terrain);
      if (r === start.row && c === start.col) {
        cell.isStart = true;
        cell.terrain = "normal";
        cell.cost = 1;
      }
      if (r === goal.row && c === goal.col) {
        cell.isGoal = true;
        cell.terrain = "normal";
        cell.cost = 1;
      }
      row.push(cell);
    }
    cells.push(row);
  }
  return { size, cells, start, goal };
}

describe("search algorithms", () => {
  it("BFS finds step-optimal path on empty grid", () => {
    const start = { row: 0, col: 0 };
    const goal = { row: 19, col: 19 };
    const grid = buildGrid(20, start, goal);
    const { result } = runBFS(grid);
    const manhattan = Math.abs(goal.row - start.row) + Math.abs(goal.col - start.col);
    expect(result.solutionFound).toBe(true);
    expect(result.pathLength).toBe(manhattan + 1);
  });

  it("UCS prefers lower cost over fewer steps", () => {
    const start = { row: 0, col: 0 };
    const goal = { row: 0, col: 4 };
    const grid = buildGrid(20, start, goal, (r, c) => {
      if (r === 0 && c >= 1 && c <= 3) return "water";
      if (r === 1 && c >= 0 && c <= 4) return "normal";
      return "normal";
    });
    const { result: ucs } = runUCS(grid);
    const { result: bfs } = runBFS(grid);
    expect(ucs.solutionFound).toBe(true);
    expect(ucs.pathCost).toBeLessThan(bfs.pathCost);
  });

  it("A* matches UCS cost on the same layout", () => {
    const start = { row: 0, col: 0 };
    const goal = { row: 0, col: 4 };
    const grid = buildGrid(20, start, goal, (r, c) => {
      if (r === 0 && c >= 1 && c <= 3) return "water";
      if (r === 1) return "normal";
      return "normal";
    });
    const { result: ucs } = runUCS(grid);
    const { result: astar } = runAStar(grid);
    expect(astar.pathCost).toBe(ucs.pathCost);
    expect(astar.nodesExpanded).toBeLessThanOrEqual(ucs.nodesExpanded);
  });

  it("reports no path when start is fully enclosed by walls", () => {
    const start = { row: 5, col: 5 };
    const goal = { row: 5, col: 10 };
    const grid = buildGrid(20, start, goal, (r, c) => {
      if (r === 4 && c === 5) return "wall";
      if (r === 6 && c === 5) return "wall";
      if (r === 5 && c === 4) return "wall";
      if (r === 5 && c === 6) return "wall";
      return "normal";
    });
    const { result } = runBFS(grid);
    expect(result.solutionFound).toBe(false);
    expect(result.pathLength).toBe(0);
    expect(result.nodesExpanded).toBeGreaterThan(0);
  });

  it("DFS is deterministic for identical grids", () => {
    const start = { row: 2, col: 2 };
    const goal = { row: 8, col: 8 };
    const grid = buildGrid(20, start, goal);
    const first = runDFS(grid);
    const second = runDFS(grid);
    expect(first.result.path).toEqual(second.result.path);
  });

  it("start equals goal returns immediate success", () => {
    const pos = { row: 3, col: 3 };
    const grid = buildGrid(20, pos, pos);
    for (const run of [runBFS, runDFS, runUCS, runAStar]) {
      const { result, steps } = run(grid);
      expect(result.solutionFound).toBe(true);
      expect(result.pathLength).toBe(0);
      expect(result.pathCost).toBe(0);
      expect(steps.length).toBe(0);
    }
  });
});
