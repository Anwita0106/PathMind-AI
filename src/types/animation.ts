export type AnimationStepType = "frontier" | "current" | "visited" | "path";

export type AnimationStep = {
  type: AnimationStepType;
  cell: { row: number; col: number };
};

export type AnimationSequence = AnimationStep[];
