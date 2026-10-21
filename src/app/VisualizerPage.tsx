import { useState, useCallback, useEffect } from "react";
import type { AppState, AlgorithmType, ToolType } from "../types";
import { useGridState } from "../hooks/useGridState";
import { useAlgorithmRunner } from "../hooks/useAlgorithmRunner";
import { useAnimationPlayer } from "../hooks/useAnimationPlayer";
import { useMazeGenerator } from "../hooks/useMazeGenerator";
import { Sidebar } from "../components/controls/Sidebar";
import { Grid } from "../components/grid/Grid";
import { Legend } from "../components/shared/Legend";
import { StatsPanel } from "../components/panels/StatsPanel";
import { ComparisonTable } from "../components/panels/ComparisonTable";
import { AlgorithmDescription } from "../components/panels/AlgorithmDescription";

/**
 * VisualizerPage coordinating state machine, grid state, algorithm computation,
 * and throttled step playback.
 */
export function VisualizerPage() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("ASTAR");
  const [selectedTool, setSelectedTool] = useState<ToolType>("wall");

  // Custom Hooks
  const {
    gridSize,
    cells,
    start,
    goal,
    changeGridSize,
    interactCell,
    resetBoard,
    clearBoard,
    clearVisualization,
    setCells,
    gridState,
  } = useGridState();

  const {
    activeResult,
    comparisonResults,
    runSingle,
    runCompareAll,
    clearResults,
    clearActiveResult,
  } = useAlgorithmRunner();

  // Animation player callback on finish transitions state to completed
  const handleAnimationComplete = useCallback(() => {
    setAppState("completed");
  }, []);

  const {
    isPlaying,
    speed,
    setSpeed,
    playAnimation,
    stopAnimation,
  } = useAnimationPlayer(setCells, handleAnimationComplete);

  const { generateRandomMaze } = useMazeGenerator(
    gridSize,
    start,
    goal,
    setCells,
    clearResults
  );

  // Sync animation playing state back to state machine
  useEffect(() => {
    if (isPlaying) {
      setAppState("animating");
    }
  }, [isPlaying]);

  // Handle cell interactions (mouse clicks or drag painting)
  const handleCellInteract = useCallback((row: number, col: number) => {
    if (appState === "running" || appState === "animating") return;

    if (appState === "completed") {
      clearVisualization();
      clearActiveResult();
      setAppState("editing");
    } else if (appState === "idle") {
      setAppState("editing");
    }

    // Clear comparison results cache if board is edited (per contract)
    if (Object.keys(comparisonResults).length > 0) {
      clearResults();
    }

    interactCell(row, col, selectedTool);
  }, [appState, selectedTool, comparisonResults, interactCell, clearVisualization, clearActiveResult, clearResults]);

  // Run a single algorithm
  const handleRun = useCallback(() => {
    if (!start || !goal) return;

    stopAnimation();
    clearVisualization();
    clearActiveResult();
    setAppState("running");

    // Small delay to let the React render the loading state if needed,
    // though computation is near-instant (<1ms)
    setTimeout(() => {
      try {
        const { steps } = runSingle(selectedAlgorithm, gridState);
        playAnimation(steps);
      } catch (err) {
        console.error(err);
        setAppState("editing");
      }
    }, 10);
  }, [start, goal, selectedAlgorithm, gridState, runSingle, playAnimation, stopAnimation, clearVisualization, clearActiveResult]);

  // Run all four and cache comparison results
  const handleCompareAll = useCallback(() => {
    if (!start || !goal) return;

    stopAnimation();
    clearVisualization();
    clearActiveResult();
    setAppState("running");

    setTimeout(() => {
      try {
        const runs = runCompareAll(gridState, selectedAlgorithm);
        // Play animation for currently selected algorithm
        const steps = runs[selectedAlgorithm].steps;
        playAnimation(steps);
      } catch (err) {
        console.error(err);
        setAppState("editing");
      }
    }, 10);
  }, [start, goal, selectedAlgorithm, gridState, runCompareAll, playAnimation, stopAnimation, clearVisualization, clearActiveResult]);

  // Reset visualizer (clears grid, terrain, statistics, and comparison table)
  const handleReset = useCallback(() => {
    stopAnimation();
    resetBoard();
    clearResults();
    setAppState("idle");
  }, [stopAnimation, resetBoard, clearResults]);

  // Clear board (clears walls/terrain but keeps start/goal)
  const handleClearBoard = useCallback(() => {
    stopAnimation();
    clearBoard();
    clearResults();
    setAppState("idle");
  }, [stopAnimation, clearBoard, clearResults]);

  // Generate random maze
  const handleRandomMaze = useCallback(() => {
    stopAnimation();
    generateRandomMaze();
    setAppState("editing");
  }, [stopAnimation, generateRandomMaze]);

  // Grid size change resets the board fully
  const handleGridSizeChange = useCallback((size: typeof gridSize) => {
    stopAnimation();
    clearResults();
    changeGridSize(size);
    setAppState("idle");
  }, [stopAnimation, clearResults, changeGridSize]);

  // Handle changes when app state resets back to editing
  const handleAlgorithmChange = useCallback((algo: AlgorithmType) => {
    setSelectedAlgorithm(algo);
    if (appState === "completed") {
      clearVisualization();
      setAppState("editing");
    }
  }, [appState, clearVisualization]);

  const handleToolChange = useCallback((tool: ToolType) => {
    setSelectedTool(tool);
    if (appState === "completed") {
      clearVisualization();
      setAppState("editing");
    }
  }, [appState, clearVisualization]);

  const isGridDisabled = appState === "running" || appState === "animating";

  const statsResult = appState === "completed" ? activeResult : null;
  const showNoPathBanner =
    appState === "completed" && activeResult !== null && !activeResult.solutionFound;

  return (
    <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950/20">
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Left Column (Sidebar controls) */}
        <div className="col-span-1 md:col-span-12 lg:col-span-3">
          <Sidebar
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={handleAlgorithmChange}
            selectedTool={selectedTool}
            onToolChange={handleToolChange}
            speed={speed}
            onSpeedChange={setSpeed}
            gridSize={gridSize}
            onGridSizeChange={handleGridSizeChange}
            appState={appState}
            canRun={Boolean(start && goal)}
            onRun={handleRun}
            onCompareAll={handleCompareAll}
            onReset={handleReset}
            onRandomMaze={handleRandomMaze}
            onClearGrid={handleClearBoard}
            onEmptyGrid={handleClearBoard}
          />
        </div>

        {/* Center Column (Interactive Grid & Legend) */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col space-y-5">
          {showNoPathBanner && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
            >
              No Path Found
            </div>
          )}
          <Grid
            cells={cells}
            activeTool={selectedTool}
            onCellInteract={handleCellInteract}
            disabled={isGridDisabled}
          />
          <Legend />
        </div>

        {/* Right Column (Metrics & Explanations) */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 flex flex-col space-y-5">
          <StatsPanel result={statsResult} />
          <ComparisonTable results={comparisonResults} isRunning={appState === "running"} />
          <AlgorithmDescription algorithm={selectedAlgorithm} />
        </div>

      </div>
    </div>
  );
}
export default VisualizerPage;
