/**
 * Film grain.
 *
 * Fixed and pointer-events-none by design. Applying grain to a
 * scrolling container forces a continuous GPU repaint and destroys
 * frame rate on mid-range Android, which is most of this audience.
 *
 * The noise is an inline SVG turbulence filter, so it costs one
 * data URI rather than a texture download.
 */
const NOISE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">
     <filter id="n">
       <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/>
     </filter>
     <rect width="140" height="140" filter="url(#n)" opacity="0.55"/>
   </svg>`
)}`;

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-overlay"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
