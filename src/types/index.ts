export type AppState =
  | "idle"
  | "editing"
  | "running"
  | "animating"
  | "completed";

export * from "./grid";
export * from "./algorithm";
export * from "./animation";
