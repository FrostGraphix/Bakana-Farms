import { beforeEach, describe, expect, it, vi } from "vitest";

const { hasDatabase, execute } = vi.hoisted(() => ({
  hasDatabase: vi.fn(),
  execute: vi.fn(),
}));

vi.mock("@/server/db", () => ({
  hasDatabase,
  getDb: () => ({ execute }),
}));

import { isCommerceReady } from "@/server/health/readiness";
import { GET } from "@/app/api/health/route";

describe("commerce readiness", () => {
  beforeEach(() => {
    hasDatabase.mockReset();
    execute.mockReset();
  });

  it("fails closed without database configuration", async () => {
    hasDatabase.mockReturnValue(false);
    expect(await isCommerceReady()).toBe(false);
    expect(execute).not.toHaveBeenCalled();
  });

  it("returns a minimal unavailable response", async () => {
    hasDatabase.mockReturnValue(false);
    const response = await GET();
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "unavailable" });
  });

  it("reports ready after a database response", async () => {
    hasDatabase.mockReturnValue(true);
    execute.mockResolvedValueOnce([]);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ready" });
  });
});
