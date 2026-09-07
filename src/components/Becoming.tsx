/**
 * Centered wordmark that floats above the globe canvas.
 *
 * `pointer-events-none` is load-bearing: the globe's glitch shader reads
 * mousedown + drag off the window, and this overlay spans the viewport.
 *
 * The tear layers sit at `z-index: -1`, behind the base text. The wrapper's
 * `z-10` establishes the stacking context they fall to the back of, which
 * keeps them above the canvas rather than behind it.
 */
export default function Becoming() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <h1
        className="becoming glitch-container glitch-rgb text-2xl sm:text-3xl md:text-4xl"
        data-text="becoming..."
      >
        becoming...
      </h1>
    </div>
  );
}
