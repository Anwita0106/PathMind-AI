import { Play, Activity, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import type { AlgorithmType, ToolType, SpeedLevel, GridSize, AppState } from "../../types";

type SidebarProps = {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algo: AlgorithmType) => void;
  selectedTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  speed: SpeedLevel;
  onSpeedChange: (speed: SpeedLevel) => void;
  gridSize: GridSize;
  onGridSizeChange: (size: GridSize) => void;
  appState: AppState;
  canRun: boolean;
  onRun: () => void;
  onCompareAll: () => void;
  onReset: () => void;
  onRandomMaze: () => void;
  onClearGrid: () => void;
  onEmptyGrid: () => void;
};

export function Sidebar({
  selectedAlgorithm,
  onAlgorithmChange,
  selectedTool,
  onToolChange,
  speed,
  onSpeedChange,
  gridSize,
  onGridSizeChange,
  appState,
  canRun,
  onRun,
  onCompareAll,
  onReset,
  onRandomMaze,
  onClearGrid,
  onEmptyGrid,
}: SidebarProps) {
  const isRunningOrAnimating = appState === "running" || appState === "animating";

  const tools: { value: ToolType; label: string; color: string; desc: string }[] = [
    { value: "start", label: "Start Node", color: "bg-emerald-500", desc: "Green (S)" },
    { value: "goal", label: "Goal Node", color: "bg-rose-500", desc: "Red (G)" },
    { value: "wall", label: "Wall Obstacle", color: "bg-slate-800 dark:bg-slate-750", desc: "Black" },
    { value: "mud", label: "Mud Terrain (Cost 3)", color: "bg-amber-700/80", desc: "Brown (M)" },
    { value: "water", label: "Water Terrain (Cost 5)", color: "bg-sky-400 dark:bg-sky-500/80", desc: "Cyan (W)" },
    { value: "erase", label: "Erase", color: "border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 text-center font-normal flex items-center justify-center text-xs", desc: "Empty" },
  ];

  return (
    <aside className="w-full flex flex-col space-y-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm">
      {/* Algorithm Configuration */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Select Algorithm
        </label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmType)}
          disabled={isRunningOrAnimating}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 transition-all hover:bg-slate-100 focus:border-purple-500 focus:outline-none dark:border-slate-850 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="BFS">Breadth First Search (BFS)</option>
          <option value="DFS">Depth First Search (DFS)</option>
          <option value="UCS">Uniform Cost Search (UCS)</option>
          <option value="ASTAR">A* Search Algorithm</option>
        </select>
      </div>

      {/* Grid Size Toggle */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Grid Dimension
        </label>
        <div className="grid grid-cols-2 gap-2">
          {([20, 25] as GridSize[]).map((size) => (
            <button
              key={size}
              onClick={() => onGridSizeChange(size)}
              disabled={isRunningOrAnimating}
              className={`rounded-lg py-2 text-sm font-semibold transition-all ${
                gridSize === size
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-350 dark:hover:bg-slate-900"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {size} × {size}
            </button>
          ))}
        </div>
      </div>

      {/* Speed Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Playback Speed
          </label>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 capitalize">
            {speed}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(["slow", "medium", "fast"] as SpeedLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => onSpeedChange(level)}
              className={`rounded-lg py-1.5 text-xs font-semibold transition-all capitalize ${
                speed === level
                  ? "bg-purple-50 border border-purple-200 text-purple-600 dark:bg-purple-950/40 dark:border-purple-900/50 dark:text-purple-400"
                  : "bg-slate-50 border border-transparent text-slate-500 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Paint Tool Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Interactive Paint Tool
        </label>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((t) => {
            const isSelected = selectedTool === t.value;
            return (
              <button
                key={t.value}
                onClick={() => onToolChange(t.value)}
                disabled={isRunningOrAnimating}
                className={`relative flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/40 dark:border-purple-500/80 dark:bg-purple-950/20"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-850 dark:bg-slate-950 dark:hover:bg-slate-900"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center space-x-2 w-full">
                  <span
                    className={`h-4 w-4 rounded-md shadow-sm shrink-0 ${
                      t.value === "erase" ? "" : t.color
                    }`}
                  >
                    {t.value === "erase" && "✖"}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                    {t.label.split(" ")[0]}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {t.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-200/80 dark:border-slate-850" />

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2.5">
        <button
          onClick={onRun}
          disabled={isRunningOrAnimating || !canRun}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white px-4 py-3 font-semibold shadow-md shadow-purple-500/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          {appState === "running" ? (
            <span className="flex items-center space-x-1.5">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Computing...</span>
            </span>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Run Algorithm</span>
            </>
          )}
        </button>

        <button
          onClick={onCompareAll}
          disabled={isRunningOrAnimating || !canRun}
          className="flex w-full items-center justify-center space-x-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/20 dark:text-purple-400 px-4 py-2.5 font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Activity className="h-4 w-4" />
          <span>Run All & Compare</span>
        </button>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={onEmptyGrid}
            disabled={isRunningOrAnimating}
            className="flex items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350 dark:hover:bg-slate-900 py-2.5 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Reset all cells to normal terrain (keeps Start and Goal)"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Empty Grid</span>
          </button>

          <button
            onClick={onRandomMaze}
            disabled={isRunningOrAnimating}
            className="flex items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350 dark:hover:bg-slate-900 py-2.5 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Generates a random solvable maze with walls and costs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Random Maze</span>
          </button>
        </div>

        <button
          onClick={onClearGrid}
          disabled={isRunningOrAnimating}
          className="flex w-full items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350 dark:hover:bg-slate-900 py-2.5 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Clears obstacles and terrain; Start and Goal are preserved"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Board</span>
        </button>

        <button
          onClick={onReset}
          className="flex w-full items-center justify-center space-x-1.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10 hover:bg-red-50 text-red-600 dark:text-red-400 py-2.5 text-xs font-bold transition-all"
          title="Clears grid, terrain, active statistics, and the comparison table"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Visualizer</span>
        </button>
      </div>
    </aside>
  );
}
