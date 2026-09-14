import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/server/auth/customer";

describe("customer authentication & password security", () => {
  it("generates a salted hash in salt:key format", () => {
    const password = "TestPassword123";
    const hash = hashPassword(password);
    const parts = hash.split(":");

    expect(parts.length).toBe(2);
    expect(parts[0]?.length).toBe(32); // 16 bytes in hex
    expect(parts[1]?.length).toBe(128); // 64 bytes in hex
  });

  it("produces distinct hashes for identical passwords due to salt randomization", () => {
    const password = "SamePassword123";
    const hash1 = hashPassword(password);
    const hash2 = hashPassword(password);

    expect(hash1).not.toBe(hash2);
    expect(verifyPassword(password, hash1)).toBe(true);
    expect(verifyPassword(password, hash2)).toBe(true);
  });

  it("verifies correct password and rejects invalid password", () => {
    const password = "SecretMasterPassword99";
    const hash = hashPassword(password);

    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("WrongPassword99", hash)).toBe(false);
    expect(verifyPassword("secretmasterpassword99", hash)).toBe(false); // Case sensitive
  });

  it("handles malformed hashes safely without throwing", () => {
    expect(verifyPassword("Test1234", "")).toBe(false);
    expect(verifyPassword("Test1234", "malformed")).toBe(false);
    expect(verifyPassword("Test1234", "bad:hash:parts")).toBe(false);
  });
});
