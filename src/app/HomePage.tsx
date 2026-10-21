import { Compass, ArrowRight, Brain, Zap, Layers } from "lucide-react";

/**
 * HomePage landing screen.
 * Details project features and initiates navigation by setting window.location.hash.
 */
export function HomePage() {
  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/10 dark:to-slate-950 text-slate-800 dark:text-slate-100">
      {/* Hero Badge */}
      <div className="flex items-center space-x-2 rounded-full border border-purple-100 bg-purple-50/50 px-3.5 py-1 text-xs font-semibold text-purple-650 dark:border-purple-900/40 dark:bg-purple-950/20 dark:text-purple-400 mb-8 animate-pulse">
        <Brain className="h-3.5 w-3.5" />
        <span>AI Search Algorithm Visualizer</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-center max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
        Master Pathfinding with{" "}
        <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
          PathMind AI
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-center max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
        Understand State Space Search, Uninformed Search, and Informed Search. Build custom mazes with terrain costs, run BFS, DFS, UCS, or A*, and compare their performance in real-time.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row space-y-4 xs:space-y-0 xs:space-x-4 mb-16">
        <button
          onClick={() => navigateTo("#/visualizer")}
          className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-655 active:scale-98 text-white px-6 py-3.5 font-bold shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
        >
          <span>Start Visualizing</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => navigateTo("#/about")}
          className="flex items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-805 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-850 px-6 py-3.5 font-bold transition-all cursor-pointer"
        >
          <span>Learn Algorithms</span>
        </button>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="flex flex-col p-5 rounded-2xl border border-slate-100 bg-white dark:border-slate-850 dark:bg-slate-900/40 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 mb-4">
            <Compass className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5">Interactive Grid Painting</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Paint obstacles, mud fields (cost 3), and water bodies (cost 5) directly onto a 20x20 or 25x25 grid to design challenging pathfinding boards.
          </p>
        </div>

        <div className="flex flex-col p-5 rounded-2xl border border-slate-100 bg-white dark:border-slate-850 dark:bg-slate-900/40 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5">Real-time Animation</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Watch search frontiers expand, nodes visited, and final paths reconstructed step-by-step with adjustable speed controls.
          </p>
        </div>

        <div className="flex flex-col p-5 rounded-2xl border border-slate-100 bg-white dark:border-slate-850 dark:bg-slate-900/40 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-55 text-blue-600 dark:bg-blue-955/40 dark:text-blue-400 mb-4">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5">Comparative Analytics</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Run all four search strategies (BFS, DFS, UCS, A*) sequentially on the same layout to analyze step count, traversal costs, and memory footprints.
          </p>
        </div>
      </div>
    </div>
  );
}
