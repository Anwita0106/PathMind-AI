import { Cpu, Zap, Compass, RefreshCw, Layers } from "lucide-react";
import type { AlgorithmResult } from "../../types";
import { formatTime } from "../../utils/formatTime";

type StatsPanelProps = {
  result: AlgorithmResult | null;
};

export function StatsPanel({ result }: StatsPanelProps) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10 min-h-[180px]">
        <Layers className="h-8 w-8 text-slate-350 dark:text-slate-655 mb-2.5 animate-pulse" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          No statistics available
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Run an algorithm to see statistics here.
        </p>
      </div>
    );
  }

  const {
    algorithm,
    pathLength,
    pathCost,
    nodesExpanded,
    maxFrontierSize,
    computationTimeMs,
    solutionFound,
  } = result;

  const metrics = [
    {
      label: "Solution Found",
      value: solutionFound ? "Yes" : "No",
      icon: <Compass className={`h-4 w-4 ${solutionFound ? "text-emerald-500" : "text-rose-500"}`} />,
      color: solutionFound
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
        : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400",
    },
    {
      label: "Path Length",
      value: solutionFound ? `${pathLength} nodes` : "0 nodes",
      icon: <Layers className="h-4 w-4 text-purple-500" />,
      color: "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400",
    },
    {
      label: "Total Path Cost",
      value: solutionFound ? `${pathCost}` : "0",
      icon: <Zap className="h-4 w-4 text-amber-500" />,
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
    },
    {
      label: "Nodes Expanded",
      value: `${nodesExpanded}`,
      icon: <Cpu className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400",
    },
    {
      label: "Max Frontier Size",
      value: `${maxFrontierSize}`,
      icon: <Layers className="h-4 w-4 text-indigo-500" />,
      color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400",
    },
    {
      label: "Computation Time",
      value: formatTime(computationTimeMs),
      icon: <RefreshCw className="h-4 w-4 text-pink-500" />,
      color: "bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Run Statistics
        </h3>
        <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
          {algorithm === "ASTAR" ? "A*" : algorithm}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col p-3 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20`}
          >
            <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 mb-1.5">
              {m.icon}
              <span className="text-[10px] font-bold uppercase tracking-wide">{m.label}</span>
            </div>
            <span className={`inline-self-start rounded px-2 py-0.5 text-sm font-bold ${m.color}`}>
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
