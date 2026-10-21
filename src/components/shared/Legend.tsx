import { CELL_COLORS } from "../../constants/colors";

export function Legend() {
  const items: { key: keyof typeof CELL_COLORS; label: string; desc: string; letter?: string }[] = [
    { key: "start", label: "Start", desc: "Green", letter: "S" },
    { key: "goal", label: "Goal", desc: "Red", letter: "G" },
    { key: "wall", label: "Obstacle / Wall", desc: "Black" },
    { key: "mud", label: "Mud Terrain (Cost 3)", desc: "Brown", letter: "M" },
    { key: "water", label: "Water Terrain (Cost 5)", desc: "Cyan", letter: "W" },
    { key: "frontier", label: "Frontier Expansion", desc: "Yellow" },
    { key: "current", label: "Current Node", desc: "Orange" },
    { key: "visited", label: "Visited / Closed", desc: "Blue" },
    { key: "path", label: "Final Route Path", desc: "Purple" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
        Grid Visual State Legend
      </h3>
      
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-3.5 text-xs text-slate-600 dark:text-slate-400">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center space-x-2.5"
            aria-label={`${item.label} cell: represented by ${item.desc}`}
          >
            <div
              className={`h-6 w-6 rounded flex items-center justify-center font-bold shadow-sm shrink-0 border border-slate-200/20 ${CELL_COLORS[item.key]}`}
              title={`${item.label} - ${item.desc}`}
            >
              {item.letter || ""}
            </div>
            <div>
              <span className="block font-bold text-slate-700 dark:text-slate-200 text-[11px] leading-tight">
                {item.label}
              </span>
              <span className="block text-[9px] text-slate-400 dark:text-slate-500 leading-tight">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
