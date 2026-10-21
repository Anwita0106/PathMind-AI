# PathMind AI — Architecture Reference

> This document is the authoritative technical reference for the PathMind AI codebase. It covers the folder structure, state machine, algorithm integration, animation protocol, and all deviations from the original implementation contract.

---

## Table of Contents

1. [Folder Structure Rationale](#1-folder-structure-rationale)
2. [State Machine](#2-state-machine)
3. [Algorithm Integration](#3-algorithm-integration)
4. [Animation Protocol](#4-animation-protocol)
5. [Performance Design](#5-performance-design)
6. [Type System](#6-type-system)
7. [Routing Strategy](#7-routing-strategy)
8. [Contract Deviations](#8-contract-deviations)

---

## 1. Folder Structure Rationale

```
src/
├── algorithms/     Pure functions only — no React imports, no side effects
├── app/            Route-level page components — one file per page
├── components/     Presentational components grouped by domain
│   ├── controls/   User-facing input controls (sidebar, buttons)
│   ├── grid/       Grid and cell rendering
│   ├── layout/     App-wide shell (header, footer)
│   ├── panels/     Data display panels (stats, comparison, description)
│   └── shared/     Reusable UI elements (legend, button, card)
├── constants/      Compile-time values: terrain costs, colors, sizes
├── hooks/          Stateful React logic — one concern per hook
├── lib/            Business logic with no React dependency
├── types/          TypeScript type definitions only
└── utils/          Pure helper functions (no state, no React)
```

**Guiding Principles:**
- `algorithms/` never imports from React or any component
- `hooks/` orchestrate between algorithms and UI but never render
- Components only read props and call callback props — no direct state mutation
- Types are pure declarations — nothing in `types/` is executable

---

## 2. State Machine

### States

| State | Description | Grid Interactive? |
|-------|-------------|:-----------------:|
| `idle` | Fresh board, no interaction yet | ✅ Yes |
| `editing` | User has painted cells or changed settings | ✅ Yes |
| `running` | Algorithm computing (synchronous, <1ms) | ❌ No |
| `animating` | Step-by-step playback active | ❌ No |
| `completed` | Animation finished, stats visible | ❌ No |

### Transitions

```
idle ──────────────────────────────────────────────────────► editing
                    (any cell painted, tool/speed/algo changed)

editing ───────────────────────────────────────────────────► running
                    (Run or Run All & Compare clicked, Start+Goal set)

running ───────────────────────────────────────────────────► animating
                    (computation complete, steps array cached)

animating ─────────────────────────────────────────────────► completed
                    (last animation step consumed)

completed ─────────────────────────────────────────────────► editing
                    (grid painted, algorithm changed, tool changed)

any state ─────────────────────────────────────────────────► idle
                    (Reset clicked)
```

### Implementation

`AppState` lives in `VisualizerPage.tsx` as local `useState`. It is passed **downward as a prop** to `Sidebar` (which uses it to disable controls) and to `Grid` (which uses it to disable interaction). No global store is used — all state flows unidirectionally.

---

## 3. Algorithm Integration

### Interface Contract

Every algorithm module exports a single pure function conforming to:

```typescript
function run(grid: GridState): {
  result: AlgorithmResult;
  steps: AnimationSequence;
}
```

**Guarantees:**
- No side effects
- No DOM access
- No imports from React or any component
- `steps` is fully computed before returning (no lazy evaluation)
- `result.computationTimeMs` uses `performance.now()` — measured before steps are returned

### Shared Utilities

All four algorithms share these utilities from `lib/` and `utils/`:

| Utility | Location | Used By |
|---------|----------|---------|
| `getNeighbors(pos, size)` | `utils/neighbors.ts` | BFS, DFS, UCS, A\* |
| `reconstructPath(cells, start, goal)` | `lib/pathReconstruction.ts` | BFS, DFS, UCS, A\* |
| `manhattanDistance(pos1, pos2)` | `algorithms/heuristics.ts` | A\* only |
| `TERRAIN_COSTS` | `constants/terrain.ts` | UCS, A\* |

### Neighbor Expansion Order

`getNeighbors()` always returns neighbors in this fixed order:

```
Up → Down → Left → Right
{ row: -1, col: 0 } → { row: +1, col: 0 } → { row: 0, col: -1 } → { row: 0, col: +1 }
```

This is critical for **DFS determinism**: since DFS pushes to a stack in reverse order (Right → Left → Down → Up), they pop in the correct Up-first order, producing identical paths across repeated runs.

### Priority Queue Implementation

UCS and A\* use a **simple array scan** for the priority queue rather than a binary heap. For a 20×20 or 25×25 grid (max 625 nodes), the theoretical overhead of a heap vs. linear scan is negligible (<0.1ms), while the implementation is dramatically simpler and easier to audit for correctness.

### Tie-Breaking

| Algorithm | Tie-Break Rule |
|-----------|---------------|
| BFS | FIFO (queue order) |
| DFS | Deterministic neighbor order (Up→Down→Left→Right) |
| UCS | Lower insertion ID (FIFO) |
| A\* | 1. Lower `h(n)` · 2. Lower insertion ID (FIFO) |

---

## 4. Animation Protocol

### Step Types

```typescript
type AnimationStepType = "frontier" | "current" | "visited" | "path";
```

| Type | Meaning | Visual Effect |
|------|---------|---------------|
| `frontier` | Neighbor discovered, added to open set | Yellow pulse animation |
| `current` | Node being expanded (popped from frontier) | Orange highlight |
| `visited` | Node expanded and closed | Blue fill animation |
| `path` | Final path cell (start→goal order) | Purple sweep animation |

### Playback Engine (`useAnimationPlayer`)

```
Steps Array (static, pre-computed)
    │
    ▼
setInterval(fn, SPEED_MS[speed])
    │
    ▼ each tick:
    1. Clear previous "current" cell's isCurrent flag
    2. Apply current step's type to the target cell
    3. Update isCurrent on new current node
    4. Increment step index
    │
    ▼ when idx >= steps.length:
    stopAnimation() → onComplete() → setAppState("completed")
```

**Speed Intervals:**

| Speed | Interval |
|-------|----------|
| Slow | 180ms/step |
| Medium | 50ms/step |
| Fast | 8ms/step |

### Cell Rendering Optimization

The `Cell` component is `React.memo`-wrapped and determines its visual class from the cell's state properties:

```
Priority Order (highest wins):
  isStart → isGoal → isCurrent → isPath → visited → inFrontier → terrain
```

Since `Cell` only re-renders when its `cell` prop reference changes, and the animation player only creates new object references for cells that actually changed, a 25×25 grid renders at most **2 cell updates per animation tick** (the previous current and the new current).

---

## 5. Performance Design

### Computation vs Rendering Separation

```
Timeline:

  t=0ms  ──► Run clicked
  t=1ms  ──► Algorithm computes ALL steps synchronously
  t=2ms  ──► computationTimeMs recorded (e.g., 0.24ms)
  t=2ms  ──► Steps array passed to animation player
  t=2ms  ──► First setInterval tick scheduled
  t=52ms ──► First visual frame rendered (medium speed)
  t=...  ──► Subsequent frames at 50ms intervals
```

**Speed slider never affects `computationTimeMs`** — it only changes the `setInterval` delay.

### Grid Re-render Strategy

```typescript
// Animation player creates minimal state mutations:
setCells(prev => {
  const nextCells = prev.map(row => [...row]); // shallow copy rows

  // Clear previous current (1 cell)
  nextCells[pr][pc] = { ...nextCells[pr][pc], isCurrent: false };

  // Apply new step (1 cell)
  nextCells[row][col] = { ...nextCells[row][col], isCurrent: true };

  return nextCells;
});
```

Only the 2 modified rows get new array references, triggering re-renders only for those rows' `Cell` components.

---

## 6. Type System

### No `any` Policy

All TypeScript is written with `strict: true` and `verbatimModuleSyntax: true`. Type-only imports use `import type { ... }` syntax throughout.

### Key Types

```typescript
// The core grid cell — carries both structural and transient state
type Cell = {
  row: number;
  col: number;
  terrain: TerrainType;     // permanent
  cost: number;             // permanent (derived from terrain)
  isStart: boolean;         // permanent until tool changes
  isGoal: boolean;          // permanent until tool changes
  visited: boolean;         // reset before each run
  inFrontier: boolean;      // reset before each run
  isPath: boolean;          // reset before each run
  isCurrent?: boolean;      // transient — set/cleared per animation tick
  parent: Position | null;  // reset before each run
  distance: number;         // g(n), reset before each run
  heuristic: number;        // h(n), reset before each run
};

// App-level state machine type
type AppState = "idle" | "editing" | "running" | "animating" | "completed";
```

---

## 7. Routing Strategy

PathMind AI uses a **custom hash router** (`window.location.hash`) rather than React Router or TanStack Router.

**Reasoning:**
1. Only 4 routes needed — a full router library adds unnecessary bundle weight
2. Hash routing works on **any static host** without server rewrite rules
3. No `vercel.json` or `_redirects` file needed
4. Full control over transition behavior

**Route Mapping:**

```typescript
switch (window.location.hash) {
  case "#/":          return <HomePage />;
  case "#/visualizer": return <VisualizerPage />;
  case "#/about":     return <AboutPage />;
  default:            return <NotFoundPage />;
}
```

`hashchange` events are listened to via `window.addEventListener("hashchange", ...)` in `App.tsx`.

---

## 8. Contract Deviations

The following intentional deviations from the implementation contract were made:

| Deviation | Contract Spec | Actual Implementation | Justification |
|-----------|--------------|----------------------|---------------|
| **Priority Queue** | Not specified | Linear array scan (not binary heap) | Grid max size 625 nodes; heap complexity unnecessary |
| **`isCurrent` field on Cell** | Not in contract | Added as `isCurrent?: boolean` | Enables efficient per-cell orange highlighting without separate state |
| **`setManualCells` signature** | `(cells: Cell[][]) => void` | `(cells: Cell[][] \| ((prev: Cell[][]) => Cell[][])) => void` | Required to accept functional updater from `useAnimationPlayer` |
| **Default Start/Goal positions** | Not specified | Start: (5,5), Goal: (15,15) for 20×20; (5,5)→(20,20) for 25×25 | Better UX — board isn't completely blank on load |
| **`clearBoard` vs `resetBoard`** | Contract has single Reset | Two operations: `clearBoard` (keeps start/goal) and `resetBoard` (full reset) | Better UX granularity; `clearBoard` maps to "Clear Board" button, `resetBoard` to "Reset Visualizer" |

---

*Architecture document maintained alongside the source code. Update when making structural changes.*
