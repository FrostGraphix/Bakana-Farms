"use client";

import * as React from "react";

export function CurrentYear() {
  const [year, setYear] = React.useState(() => new Date().getFullYear());

  React.useEffect(() => {
    const refresh = () => setYear(new Date().getFullYear());
    const timer = window.setInterval(refresh, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <time dateTime={String(year)} suppressHydrationWarning>{year}</time>;
}
