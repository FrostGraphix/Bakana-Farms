"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/table";
import { formatMoney, type Currency } from "@/lib/utils";

export interface AdminOrderRecord {
  id: string;
  reference: string;
  status: string;
  channel: string;
  currency: Currency;
  total: number;
  createdAt: Date | string | null;
}

export function AdminOrdersTable({ orders }: { orders: AdminOrderRecord[] }) {
  const columns = React.useMemo(
    () => [
      {
        key: "reference",
        header: "Order Reference",
        value: (order: AdminOrderRecord) => order.reference,
      },
      {
        key: "status",
        header: "Status",
        value: (order: AdminOrderRecord) =>
          order.status.replaceAll("_", " "),
      },
      {
        key: "channel",
        header: "Channel",
        value: (order: AdminOrderRecord) => order.channel.toUpperCase(),
      },
      {
        key: "total",
        header: "Total",
        value: (order: AdminOrderRecord) =>
          formatMoney(order.total, order.currency),
      },
      {
        key: "date",
        header: "Created Date",
        value: (order: AdminOrderRecord) =>
          order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—",
      },
    ],
    []
  );

  return (
    <DataTable
      title="Recent Storefront & Wholesale Orders"
      subtitle="Exportable operations ledger with real-time currency reconciliation."
      filenameBase="bakana-recent-orders"
      columns={columns}
      data={orders}
      keyExtractor={(order) => order.id}
    />
  );
}
