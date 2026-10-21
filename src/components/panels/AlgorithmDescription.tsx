import type { AlgorithmType } from "../../types";

type AlgorithmDescriptionProps = {
  algorithm: AlgorithmType;
};

type DescInfo = {
  title: string;
  dataStructure: string;
  costAware: string;
  optimality: string;
  details: string;
  pros: string;
  cons: string;
};

const ALGO_DETAILS: Record<AlgorithmType, DescInfo> = {
  BFS: {
    title: "Breadth First Search (BFS)",
    dataStructure: "First-In, First-Out (FIFO) Queue",
    costAware: "No (treats every step as equal cost 1)",
    optimality: "Guarantees shortest path by number of steps (step count)",
    details:
      "BFS explores the state space layer by layer, starting from the source node and moving outwards to all immediate neighbors, then to their neighbors, and so on. It guarantees the absolute shortest path in terms of steps, but ignores cell traversal costs (e.g. mud/water).",
    pros: "Simple, guarantees step-optimality, complete (will always find a path if one exists).",
    cons: "Memory intensive (large frontier size), ignores terrain difficulty entirely.",
  },
  DFS: {
    title: "Depth First Search (DFS)",
    dataStructure: "Last-In, First-Out (LIFO) Stack",
    costAware: "No (ignores costs)",
    optimality: "No optimality guarantees (finds any valid path)",
    details:
      "DFS explores as deep as possible along each branch before backtracking. In this visualizer, ties are resolved deterministically using a fixed neighbor expansion order: Up → Down → Left → Right. It does not check if the path is short or cheap; it just searches for any route to the goal.",
    pros: "Low memory footprint (frontier is usually thin/deep). Complete in finite spaces.",
    cons: "Can take extremely long, winding paths. Not optimal by steps or cost.",
  },
  UCS: {
    title: "Uniform Cost Search (UCS)",
    dataStructure: "Priority Queue (ordered by cumulative path cost)",
    costAware: "Yes (minimizes cumulative cost)",
    optimality: "Guarantees the lowest total cumulative cost path",
    details:
      "UCS is Dijkstra's Algorithm simplified. It expands nodes in increasing order of their path cost g(n) from the start. This ensures that when the goal is popped, it is reached via the lowest-cost path possible. Ideal when different cell terrains have different traversal costs (e.g. normal=1, mud=3, water=5).",
    pros: "Guarantees cost-optimality, complete.",
    cons: "Expands nodes in all directions blindly (no goal orientation or heuristic).",
  },
  ASTAR: {
    title: "A* Search Algorithm",
    dataStructure: "Priority Queue (ordered by f(n) = g(n) + h(n))",
    costAware: "Yes (minimizes cumulative cost)",
    optimality: "Guarantees the lowest cost path (using admissible heuristic)",
    details:
      "A* is an informed search algorithm. It selects nodes based on f(n) = g(n) + h(n), where g(n) is the actual cost to reach the node and h(n) is the estimated cost from the node to the goal. In our 4-directional grid, h(n) is the Manhattan Distance, which is admissible and consistent, guaranteeing cost-optimality while dramatically reducing node expansions compared to UCS.",
    pros: "Highly efficient, goal-oriented, cost-optimal, fewer nodes expanded.",
    cons: "Depends on a good heuristic; can be memory-intensive in very large graphs.",
  },
};

export function AlgorithmDescription({ algorithm }: AlgorithmDescriptionProps) {
  const info = ALGO_DETAILS[algorithm];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm flex flex-col space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Theoretical Context
        </h3>
        <h4 className="text-base font-bold text-slate-850 dark:text-white">
          {info.title}
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 dark:border-slate-850 py-3">
        <div>
          <span className="block font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide text-[9px]">
            Data Structure
          </span>
          <span className="text-slate-700 dark:text-slate-350">{info.dataStructure}</span>
        </div>
        <div>
          <span className="block font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide text-[9px]">
            Cost-Aware?
          </span>
          <span className="text-slate-700 dark:text-slate-350">{info.costAware}</span>
        </div>
        <div className="col-span-2 mt-1">
          <span className="block font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide text-[9px]">
            Optimality Guarantee
          </span>
          <span className="text-slate-700 dark:text-slate-350">{info.optimality}</span>
        </div>
      </div>

      <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>{info.details}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg border border-slate-100 dark:border-slate-850">
        <div>
          <span className="font-bold text-emerald-600 dark:text-emerald-450 text-[10px] uppercase tracking-wide block mb-0.5">
            Advantages
          </span>
          <p className="text-slate-600 dark:text-slate-400">{info.pros}</p>
        </div>
        <div>
          <span className="font-bold text-rose-600 dark:text-rose-450 text-[10px] uppercase tracking-wide block mb-0.5">
            Disadvantages
          </span>
          <p className="text-slate-600 dark:text-slate-400">{info.cons}</p>
        </div>
      </div>
    </div>
  );
}
