/**
 * Client-side export utilities: CSV generator and printable report window.
 *
 * Inspired by Beverly Project architecture.
 * Generates RFC-4180 compliant CSV with UTF-8 BOM so Excel opens
 * currency symbols (₦, $) and special characters cleanly.
 */

export type Column<T> = {
  key: string;
  header: string;
  value: (row: T) => unknown;
};

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = typeof value === "string" ? value : String(value);
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function rowsToCsv<T>(rows: T[], columns: Column<T>[]): string {
  const head = columns.map((c) => csvEscape(c.header)).join(",");
  const body = rows.map((row) =>
    columns.map((c) => csvEscape(c.value(row))).join(",")
  );
  return [head, ...body].join("\r\n");
}

function timestamp(): string {
  return new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportCsv<T>(
  filenameBase: string,
  rows: T[],
  columns: Column<T>[]
): void {
  const csv = rowsToCsv(rows, columns);
  // UTF-8 BOM prepended so Excel recognizes international encoding
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, `${filenameBase}-${timestamp()}.csv`);
}

export type PdfTable = {
  title: string;
  columns: string[];
  rows: (string | number)[][];
};

export type PdfDoc = {
  title: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  sections?: { heading: string; body: string; bullets?: string[] }[];
  tables?: PdfTable[];
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Opens a print-ready window styled with Bakana Farms luxury typography.
 * The browser's native "Save as PDF" produces the PDF with zero external bundle size.
 */
export function printPdf(doc: PdfDoc): void {
  if (typeof window === "undefined") return;

  const win = window.open("", "_blank", "noopener,width=900,height=1000");
  if (!win) return;

  const metaHtml = (doc.meta ?? [])
    .map(
      (m) => `
      <div class="meta-item">
        <span class="meta-label">${escapeHtml(m.label)}</span>
        <strong class="meta-value">${escapeHtml(m.value)}</strong>
      </div>
    `
    )
    .join("");

  const sectionsHtml = (doc.sections ?? [])
    .map(
      (s) => `
      <section class="doc-section">
        <h2>${escapeHtml(s.heading)}</h2>
        <p>${escapeHtml(s.body)}</p>
        ${
          s.bullets && s.bullets.length > 0
            ? `<ul>${s.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
            : ""
        }
      </section>
    `
    )
    .join("");

  const tablesHtml = (doc.tables ?? [])
    .map(
      (t) => `
      <section class="doc-section">
        <h2>${escapeHtml(t.title)}</h2>
        <table>
          <thead>
            <tr>${t.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${t.rows
              .map(
                (r) =>
                  `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`
              )
              .join("")}
          </tbody>
        </table>
      </section>
    `
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(doc.title)} — Bakana Farms</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1c1917;
      background: #ffffff;
      margin: 40px;
      line-height: 1.5;
    }
    header {
      border-bottom: 2px solid #1b2e22;
      padding-bottom: 20px;
      margin-bottom: 28px;
    }
    .brand {
      font-size: 14px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 700;
      color: #1b2e22;
    }
    h1 {
      margin: 10px 0 4px;
      font-size: 26px;
      font-weight: 700;
      color: #1b2e22;
    }
    .subtitle {
      color: #4a4038;
      font-size: 15px;
      margin-bottom: 16px;
    }
    .meta-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 14px;
      font-size: 13px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      color: #796f64;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .meta-value {
      color: #1c1917;
    }
    .doc-section {
      margin-bottom: 28px;
      page-break-inside: avoid;
    }
    .doc-section h2 {
      font-size: 16px;
      border-bottom: 1px solid #efe8d8;
      padding-bottom: 6px;
      margin-bottom: 10px;
      color: #1b2e22;
    }
    p, li {
      font-size: 13px;
      color: #4a4038;
    }
    ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #d8cfb8;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #efe8d8;
      font-weight: 600;
      color: #1b2e22;
    }
    @media print {
      body { margin: 0; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">Bakana Farms Limited</div>
    <h1>${escapeHtml(doc.title)}</h1>
    ${doc.subtitle ? `<div class="subtitle">${escapeHtml(doc.subtitle)}</div>` : ""}
    ${metaHtml ? `<div class="meta-grid">${metaHtml}</div>` : ""}
  </header>
  <main>
    ${sectionsHtml}
    ${tablesHtml}
  </main>
  <script>
    window.addEventListener('load', () => {
      window.print();
    });
  </script>
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();
}
