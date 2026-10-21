import React, { useState, useEffect } from "react";
import type { Cell as CellType, ToolType } from "../../types";
import { Cell } from "./Cell";

type GridProps = {
  cells: CellType[][];
  activeTool: ToolType;
  onCellInteract: (row: number, col: number) => void;
  disabled: boolean; // true while Running/Animating
};

export const Grid = React.memo(({ cells, onCellInteract, disabled }: GridProps) => {
  const [isDragging, setIsDragging] = useState(false);

  // Stop dragging on mouse release globally
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleCellMouseDown = (row: number, col: number) => {
    if (disabled) return;
    setIsDragging(true);
    onCellInteract(row, col);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (disabled || !isDragging) return;
    onCellInteract(row, col);
  };

  const numCols = cells[0]?.length || 20;

  return (
    <div
      className={`relative w-full aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-950/40 shadow-inner ${
        disabled ? "cursor-not-allowed select-none" : "cursor-crosshair"
      }`}
    >
      <div
        className="grid h-full w-full gap-[1.5px]"
        style={{
          gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${numCols}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((rowCells, rIdx) =>
          rowCells.map((cell, cIdx) => (
            <Cell
              key={`${rIdx}-${cIdx}`}
              cell={cell}
              onClick={() => handleCellMouseDown(rIdx, cIdx)}
              onMouseEnter={() => handleCellMouseEnter(rIdx, cIdx)}
              isDragging={isDragging}
            />
          ))
        )}
      </div>
    </div>
  );
});

Grid.displayName = "Grid";
