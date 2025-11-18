# feat(ui): modernize Sorting Visualizer — modular rewrite, fixed algorithms, pause/resume, responsive UI

## Summary
- Complete modular rewrite and UI redesign of Sorting Visualizer.
- Fixed and optimized implementations for Bubble, Selection, Insertion, Merge, Quick.
- Deterministic action stream approach (compare, swap, overwrite, set-sorted) for smooth animations.
- Full controls: Generate New Array, Start, Pause/Resume, Reset, Algorithm dropdown, Speed slider, Size slider.
- Proper disabling of controls during sorting, accurate metrics (comparisons, swaps, elapsed time), and pseudocode panel.
- Responsive, accessible, and visually polished UI with color states for compare/swap/sorted.

## Files / structure (high level)
- index.html — new responsive layout and controls.
- css/style.css — theme, transitions, states.
- js/main.js — wiring and event handlers.
- js/visualizer.js — Visualizer class with async animation loop, pause/resume/reset.
- js/utils.js — small utilities (sleep).
- js/algorithms/*.js — bubble, selection, insertion, merge, quick (each returns action arrays).
- README.md — run instructions and branch overview.

## Checklist
- [x] Modular refactor (main, visualizer, utils, algorithms)
- [x] Implemented Bubble, Selection, Insertion, Merge, Quick algorithms
- [x] Deterministic action stream (compare/swap/overwrite/set-sorted)
- [x] Generate New Array, Start, Pause/Resume, Reset implemented
- [x] Speed & Size sliders wired and working
- [x] Controls disabled during sorting to prevent invalid interactions
- [x] Live metrics (comparisons, swaps, elapsed)
- [x] Pseudocode panel for selected algorithm
- [x] Responsive, accessible UI and visual polish
- [ ] Add CI (lint/tests) — suggested follow-up
- [ ] Add optional screenshots / demo GIF to PR — optional

## How to test locally (QA steps)
1. git fetch origin && git checkout feature/ui-redesign
2. Serve the directory (e.g., npx http-server) and open index.html
3. Change Size and click Generate New Array
4. Select each algorithm and click Start
5. Use Pause/Resume and Reset during runs — confirm behavior and that controls enable/disable correctly
6. Verify metrics update and bars end in the sorted (green) state
7. Test on mobile narrow viewport for responsive layout

## Labels
- enhancement
- ui