import { useState, useCallback } from "react";
import type { AlgorithmType, AlgorithmResult, GridState, AnimationSequence } from "../types";
import { runAlgorithm } from "../algorithms";

/**
 * Custom hook to run search algorithms, manage computation results,
 * and maintain the cached results of all algorithms for the comparison panel.
 */
export function useAlgorithmRunner() {
  const [activeResult, setActiveResult] = useState<AlgorithmResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<
    Partial<Record<AlgorithmType, AlgorithmResult>>
  >({});

  /**
   * Resets all cached algorithm run and comparison statistics.
   */
  const clearResults = useCallback(() => {
    setActiveResult(null);
    setComparisonResults({});
  }, []);

  /**
   * Clears only the active stats panel result.
   */
  const clearActiveResult = useCallback(() => {
    setActiveResult(null);
  }, []);

  /**
   * Executes a single algorithm. Computes result and animation sequence.
   * Caches the run in the comparison list.
   */
  const runSingle = useCallback((type: AlgorithmType, grid: GridState) => {
    const { result, steps } = runAlgorithm(type, grid);
    setActiveResult(result);
    setComparisonResults(prev => ({
      ...prev,
      [type]: result,
    }));
    return { result, steps };
  }, []);

  /**
   * Runs all 4 algorithms on the same board state.
   * Populates the comparison table caches instantly.
   */
  const runCompareAll = useCallback(
    (grid: GridState, highlightAlgorithm: AlgorithmType) => {
      const algos: AlgorithmType[] = ["BFS", "DFS", "UCS", "ASTAR"];
      const runs = {} as Record<
        AlgorithmType,
        { result: AlgorithmResult; steps: AnimationSequence }
      >;

      const nextComparison: Partial<Record<AlgorithmType, AlgorithmResult>> = {};

      for (const algo of algos) {
        const { result, steps } = runAlgorithm(algo, grid);
        runs[algo] = { result, steps };
        nextComparison[algo] = result;
      }

      setComparisonResults(nextComparison);
      setActiveResult(runs[highlightAlgorithm].result);
      return runs;
    },
    []
  );

  return {
    activeResult,
    comparisonResults,
    runSingle,
    runCompareAll,
    clearResults,
    clearActiveResult,
    setComparisonResults,
  };
}
