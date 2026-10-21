import { useState, useEffect, useRef, useCallback } from "react";
import type { AnimationSequence, SpeedLevel, Cell } from "../types";

const SPEED_MS: Record<SpeedLevel, number> = {
  slow: 180,
  medium: 50,
  fast: 8,
};

/**
 * Manages the step-by-step playback of an algorithm's animation sequence.
 * Throttles state updates based on the speed slider setting.
 */
export function useAnimationPlayer(
  setCells: React.Dispatch<React.SetStateAction<Cell[][]>>,
  onComplete: () => void
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<SpeedLevel>("medium");
  const [currentCell, setCurrentCell] = useState<{ row: number; col: number } | null>(null);

  const stepsRef = useRef<AnimationSequence>([]);
  const currentIdxRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<() => void>(onComplete);
  const previousCurrentRef = useRef<{ row: number; col: number } | null>(null);

  // Sync latest onComplete callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stopAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentCell(null);
    previousCurrentRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const playAnimation = useCallback((sequence: AnimationSequence) => {
    stopAnimation();
    stepsRef.current = sequence;
    currentIdxRef.current = 0;
    setIsPlaying(true);
  }, [stopAnimation]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = SPEED_MS[speed];

    timerRef.current = setInterval(() => {
      const idx = currentIdxRef.current;
      const sequence = stepsRef.current;

      if (idx >= sequence.length) {
        stopAnimation();
        onCompleteRef.current();
        return;
      }

      const step = sequence[idx];

      setCells(prev => {
        const nextCells = prev.map(row => [...row]); // copy row array references

        // 1. Clear the previous current cell isCurrent flag
        if (previousCurrentRef.current) {
          const { row: pr, col: pc } = previousCurrentRef.current;
          if (pr < nextCells.length && pc < nextCells[pr].length) {
            nextCells[pr] = [...nextCells[pr]];
            nextCells[pr][pc] = { ...nextCells[pr][pc], isCurrent: false };
          }
        }

        const { row, col } = step.cell;
        const originalCell = prev[row][col];
        const nextCell = { ...originalCell };

        if (step.type === "frontier") {
          nextCell.inFrontier = true;
        } else if (step.type === "current") {
          nextCell.inFrontier = false;
          nextCell.isCurrent = true;
          previousCurrentRef.current = { row, col };
        } else if (step.type === "visited") {
          nextCell.visited = true;
          nextCell.inFrontier = false;
          nextCell.isCurrent = false;
          if (previousCurrentRef.current?.row === row && previousCurrentRef.current?.col === col) {
            previousCurrentRef.current = null;
          }
        } else if (step.type === "path") {
          nextCell.isPath = true;
          nextCell.isCurrent = false;
          if (previousCurrentRef.current?.row === row && previousCurrentRef.current?.col === col) {
            previousCurrentRef.current = null;
          }
        }

        nextCells[row][col] = nextCell;
        return nextCells;
      });

      if (step.type === "current") {
        setCurrentCell(step.cell);
      } else if (step.type === "path") {
        // Path step means we are showing final route, clear orange highlight
        setCurrentCell(null);
      }

      currentIdxRef.current = idx + 1;
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed, setCells, stopAnimation]);


  return {
    isPlaying,
    speed,
    setSpeed,
    playAnimation,
    stopAnimation,
    currentCell,
  };
}
