/**
 * Resolves the theme before first paint.
 *
 * On SSR the server does not know the visitor's preference, so the
 * HTML ships in the default theme and React hydration is far too
 * late to correct it. A dark-mode visitor would see a full-page
 * white flash on every navigation.
 *
 * This script is inline and synchronous by design. Deferring it,
 * or moving it to an external file, defeats the entire purpose.
 *
 * A cookie is used rather than localStorage so the value is
 * available to the server if we ever need it. We deliberately do
 * NOT read it in the root layout: calling `cookies()` there opts
 * every route out of static rendering, which would cost more in
 * TTFB than it saves. The pre-paint script already removes the
 * flash, so the static build stays intact.
 */
const script = `
(function () {
  try {
    var m = document.cookie.match(/(?:^|;\\s*)theme=(light|dark|system)/);
    var choice = m ? m[1] : 'system';
    if (choice === 'system') {
      choice = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    document.documentElement.setAttribute('data-theme', choice);
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', choice === 'dark' ? '#1B2E22' : '#F6F1E7');
    }
  } catch (e) {
    /* default light stands */
  }
})();
`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
