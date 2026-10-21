import type { AlgorithmType, AlgorithmResult } from "../../types";
import { formatTime } from "../../utils/formatTime";

type ComparisonTableProps = {
  results: Partial<Record<AlgorithmType, AlgorithmResult>>;
  isRunning: boolean;
};

export function ComparisonTable({ results, isRunning }: ComparisonTableProps) {
  const algos: { key: AlgorithmType; label: string }[] = [
    { key: "BFS", label: "BFS (Breadth First)" },
    { key: "DFS", label: "DFS (Depth First)" },
    { key: "UCS", label: "UCS (Uniform Cost)" },
    { key: "ASTAR", label: "A* Search" },
  ];

  const hasAnyResults = Object.keys(results).length > 0;

  if (!hasAnyResults && !isRunning) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 min-h-[200px]">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          No comparison data
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Click &apos;Run All &amp; Compare&apos; to see results.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
        Algorithm Performance Comparison
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase font-semibold">
              <th className="py-2.5 px-3">Algorithm</th>
              <th className="py-2.5 px-2 text-center">Path Length</th>
              <th className="py-2.5 px-2 text-center">Total Cost</th>
              <th className="py-2.5 px-2 text-center">Nodes Expanded</th>
              <th className="py-2.5 px-2 text-center">Max Frontier</th>
              <th className="py-2.5 px-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {algos.map((algo) => {
              const res = results[algo.key];
              const isOptimalCost =
                algo.key === "UCS" || algo.key === "ASTAR";

              return (
                <tr
                  key={algo.key}
                  className={`border-b border-slate-100 dark:border-slate-850/80 transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-950/10 ${
                    res?.solutionFound
                      ? "text-slate-700 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <td className="py-3 px-3 font-semibold">
                    <span className="flex items-center space-x-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          algo.key === "BFS"
                            ? "bg-blue-500"
                            : algo.key === "DFS"
                            ? "bg-red-500"
                            : algo.key === "UCS"
                            ? "bg-amber-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <span>{algo.label}</span>
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {res ? (res.solutionFound ? res.pathLength : "No Path") : "—"}
                  </td>
                  <td className="py-3 px-2 text-center font-bold">
                    {res ? (
                      res.solutionFound ? (
                        <span className={isOptimalCost ? "text-emerald-600 dark:text-emerald-450" : ""}>
                          {res.pathCost}
                        </span>
                      ) : (
                        "Infinity"
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {res ? res.nodesExpanded : "—"}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {res ? res.maxFrontierSize : "—"}
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-purple-600 dark:text-purple-400">
                    {res ? formatTime(res.computationTimeMs) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-950/20 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
        <span className="font-bold text-slate-500 dark:text-slate-400">Performance Note:</span> BFS optimizes step count only; UCS and A* optimize cumulative path costs (taking mud/water into account). A* guides exploration with the Manhattan distance heuristic, expanding fewer nodes than UCS.
      </div>
    </div>
  );
}
