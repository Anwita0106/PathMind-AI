import type { TerrainType } from "../types";

export const TERRAIN_COSTS: Record<TerrainType, number> = {
  normal: 1,
  mud: 3,
  water: 5,
  wall: Infinity,
};
