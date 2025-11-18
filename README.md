```markdown
# Sorting Visualizer — UI Redesign (proposed)

This branch contains a modern UI redesign and modular architecture for the Sorting Visualizer.

Key features in the proposal:
- Responsive layout and modern CSS variables
- Dark / Light toggle
- Controls: algorithm select, array type, size, speed, new array, start/pause/step
- Code snippet panel showing algorithm pseudocode
- Metrics: comparisons, swaps, elapsed time
- Generator-based sorting implementations that yield actions to the visualizer
- Accessibility-minded labels and keyboard focus

How to try locally:
1. Serve the directory via a static server (e.g. `npx http-server` or VS Code Live Server)
2. Open `index.html`
3. Choose algorithm, size, speed and press Start

Contributing:
- Implement additional algorithm generators in `js/app.js` (merge, quick, heap)
- Improve animation easing and transitions in `css/style.css`
- Add unit tests or demo fixtures if desired

This is a proposed initial commit for the feature/ui-redesign branch. If you approve, I can push these files to the branch and open a PR for review.
```