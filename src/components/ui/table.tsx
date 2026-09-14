"use client";

import * as React from "react";
import { DownloadSimple, Printer } from "@phosphor-icons/react";
import { exportCsv, printPdf, type Column } from "@/lib/export";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  subtitle?: string;
  filenameBase?: string;
  enableExport?: boolean;
  enableDensityToggle?: boolean;
  emptyMessage?: string;
  className?: string;
  keyExtractor: (row: T, index: number) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  title,
  subtitle,
  filenameBase = "bakana-export",
  enableExport = true,
  enableDensityToggle = true,
  emptyMessage = "No records found.",
  className,
  keyExtractor,
}: DataTableProps<T>) {
  const [density, setDensity] = React.useState<"normal" | "compact">("normal");

  const handleCsvExport = () => {
    exportCsv(filenameBase, data, columns);
  };

  const handlePrint = () => {
    printPdf({
      title: title || "Bakana Report",
      subtitle,
      tables: [
        {
          title: title || "Records",
          columns: columns.map((c) => c.header),
          rows: data.map((row) =>
            columns.map((c) => {
              const val = c.value(row);
              return val === null || val === undefined ? "" : String(val);
            })
          ),
        },
      ],
    });
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Table Toolbar */}
      {(title || enableExport || enableDensityToggle) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div>
            {title && (
              <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold text-[var(--text-primary)]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {enableDensityToggle && (
              <div className="inline-flex rounded-full border border-[var(--border-subtle)] p-0.5 text-[length:var(--text-caption)]">
                <button
                  type="button"
                  onClick={() => setDensity("normal")}
                  className={cn(
                    "rounded-full px-2.5 py-1 font-medium transition-colors",
                    density === "normal"
                      ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  onClick={() => setDensity("compact")}
                  className={cn(
                    "rounded-full px-2.5 py-1 font-medium transition-colors",
                    density === "compact"
                      ? "bg-[var(--action-primary-bg)] text-[var(--action-primary-text)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  Compact
                </button>
              </div>
            )}

            {enableExport && data.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCsvExport}
                  title="Export CSV"
                  aria-label="Export CSV"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[length:var(--text-caption)] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--text-primary)]"
                >
                  <DownloadSimple size={14} aria-hidden />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  title="Print / Save PDF"
                  aria-label="Print / Save PDF"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-[length:var(--text-caption)] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--text-primary)]"
                >
                  <Printer size={14} aria-hidden />
                  <span>Print</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Scrollable Table Container */}
      <div className="table-container" data-density={density}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-[var(--text-secondary)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={keyExtractor(row, index)}>
                  {columns.map((col) => (
                    <td key={col.key}>{String(col.value(row) ?? "")}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
