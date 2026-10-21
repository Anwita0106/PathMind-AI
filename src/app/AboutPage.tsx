import { Cpu, Zap, Layers, Compass } from "lucide-react";

/**
 * AboutPage displaying theoretical definitions of the 4 search algorithms.
 * Includes data structures, optimality guarantees, and cost behaviors.
 */
export function AboutPage() {
  const sections = [
    {
      title: "Breadth First Search (BFS)",
      subtitle: "Uninformed Search (Queue)",
      icon: <Layers className="h-6 w-6 text-blue-500" />,
      ds: "FIFO Queue",
      costAware: "No (cost of all edges is considered equal to 1)",
      optimality: "Step-optimal (shortest path in terms of number of steps)",
      details:
        "BFS explores the state space by expanding the shallowest unexpanded node first. It is implemented using a Queue data structure (FIFO). When a node is popped, all of its unvisited neighbors are pushed into the queue and marked as visited. This ensures that the algorithm visits states in order of their step-distance from the start, making it step-optimal but blind to edge costs (such as mud or water).",
    },
    {
      title: "Depth First Search (DFS)",
      subtitle: "Uninformed Search (Stack)",
      icon: <Compass className="h-6 w-6 text-red-500" />,
      ds: "LIFO Stack",
      costAware: "No (ignores costs entirely)",
      optimality: "None (neither step nor cost optimal)",
      details:
        "DFS explores the state space by expanding the deepest unexpanded node first. It is implemented using a Stack (LIFO). DFS pushes neighbors onto the stack and explores deep paths to their conclusion before backtracking. In this visualizer, ties are resolved in a fixed Up -> Down -> Left -> Right order. Since it does not search systematically by layers, it can produce highly suboptimal, wind-like paths.",
    },
    {
      title: "Uniform Cost Search (UCS)",
      subtitle: "Uninformed Cost-Aware Search (Priority Queue)",
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      ds: "Priority Queue (ordered by cumulative cost g)",
      costAware: "Yes (minimizes cumulative cost)",
      optimality: "Cost-optimal (guarantees lowest cumulative cost path)",
      details:
        "UCS (equivalent to Dijkstra's algorithm on a single source-destination pair) expands the node with the lowest cumulative path cost g(n) first. Nodes are maintained in a Priority Queue. When exploring neighbors, UCS updates their distance if a cheaper path is found. Optimality is guaranteed because it only stops when the goal node is popped from the queue. Tie-breaking is FIFO.",
    },
    {
      title: "A* Search Algorithm",
      subtitle: "Informed Search (Priority Queue + Heuristic)",
      icon: <Cpu className="h-6 w-6 text-purple-500" />,
      ds: "Priority Queue (ordered by f = g + h)",
      costAware: "Yes (minimizes cumulative cost)",
      optimality: "Cost-optimal (given an admissible, consistent heuristic)",
      details:
        "A* is an informed search strategy that uses domain-specific knowledge to guide pathfinding. It expands the node with the lowest total estimated cost f(n) = g(n) + h(n), where g(n) is the cumulative cost and h(n) is the heuristic estimate to the goal. In our visualizer, h(n) is the Manhattan Distance, which is admissible (never overestimates cost) and consistent, guaranteeing an optimal solution while expanding far fewer states than UCS.",
    },
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12 text-slate-800 dark:text-slate-100">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          About Search Algorithms
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400">
          State space search is a fundamental concept in Artificial Intelligence. Search strategies are divided into uninformed (blind) and informed (heuristic) search.
        </p>
      </div>

      <div className="space-y-8 mb-12">
        {sections.map((sec, idx) => (
          <section
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-850 dark:bg-slate-900/60 shadow-sm flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-950/40 shadow-sm">
              {sec.icon}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-850 dark:text-white m-0">
                  {sec.title}
                </h2>
                <span className="text-xs font-semibold text-purple-650 dark:text-purple-400">
                  {sec.subtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                <div>
                  <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide text-[9px] mb-0.5">
                    Data Structure
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{sec.ds}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide text-[9px] mb-0.5">
                    Cost-Aware
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{sec.costAware}</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide text-[9px] mb-0.5">
                    Optimality
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{sec.optimality}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                {sec.details}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* Comparison Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-tr from-purple-50/20 to-indigo-50/10 p-6 dark:border-slate-850 dark:bg-slate-950/25 shadow-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Summary of Key Distinctions
        </h3>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-slate-750 dark:text-slate-300">BFS vs DFS:</strong> BFS explores layer-by-layer and guarantees the path with the fewest steps. DFS explores paths to their absolute depth first, requiring less memory but yielding long, winding paths.
          </li>
          <li>
            <strong className="text-slate-750 dark:text-slate-300">UCS vs BFS:</strong> BFS is cost-blind, finding the shortest step route. UCS is cost-aware, prioritizing low cumulative cost routes, which is crucial when navigating terrains like Mud (cost 3) or Water (cost 5).
          </li>
          <li>
            <strong className="text-slate-750 dark:text-slate-300">A* vs UCS:</strong> UCS expands states blindly in all directions. A* uses a heuristic (Manhattan Distance) to estimate distance to the goal, directing node expansions towards the target and saving computation.
          </li>
        </ul>
      </div>
    </div>
  );
}
