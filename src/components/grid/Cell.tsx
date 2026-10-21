import React from "react";
import type { Cell as CellType } from "../../types";
import { CELL_COLORS } from "../../constants/colors";

type CellProps = {
  cell: CellType;
  onClick: () => void;
  onMouseEnter: () => void;
  isDragging: boolean;
};

export const Cell = React.memo(({ cell, onClick, onMouseEnter }: CellProps) => {
  const { isStart, isGoal, terrain, visited, inFrontier, isPath, isCurrent } = cell;

  // We determine what the visual state is
  let stateKey: keyof typeof CELL_COLORS = "normal";

  if (isStart) {
    stateKey = "start";
  } else if (isGoal) {
    stateKey = "goal";
  } else if (isCurrent) {
    stateKey = "current";
  } else if (isPath) {
    stateKey = "path";
  } else if (visited) {
    stateKey = "visited";
  } else if (inFrontier) {
    stateKey = "frontier";
  } else if (terrain === "wall") {
    stateKey = "wall";
  } else if (terrain === "mud") {
    stateKey = "mud";
  } else if (terrain === "water") {
    stateKey = "water";
  }

  // Label for accessibility and clarity
  let label = "";
  if (isStart) label = "S";
  else if (isGoal) label = "G";
  else if (terrain === "mud" && !visited && !inFrontier && !isPath && !isCurrent) label = "M";
  else if (terrain === "water" && !visited && !inFrontier && !isPath && !isCurrent) label = "W";

  // When dragging, standard clicks are bypassed, mouse enter handles the draw.
  // We call onClick on mouse down.
  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent text selection highlight during drag-drawing
        onClick();
      }}
      onMouseEnter={onMouseEnter}
      className={`flex h-full w-full items-center justify-center rounded-[1px] text-[10px] sm:text-xs font-bold transition-all duration-150 select-none ${CELL_COLORS[stateKey]}`}
      title={
        isStart
          ? "Start Node"
          : isGoal
          ? "Goal Node"
          : `Terrain: ${terrain} (Cost: ${cell.cost})`
      }
    >
      {label}
    </div>
  );
});

Cell.displayName = "Cell";
