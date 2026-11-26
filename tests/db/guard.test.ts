import { describe, expect, it } from "vitest";
import { assertLocalUrl } from "./helpers";

describe("database tests only run against a local database", () => {
  it("rejects a hosted pooler", () => {
    expect(() => assertLocalUrl("postgresql://u:p@aws-0-x.pooler.supabase.com:6543/postgres")).toThrow(/local/i);
  });
  it("is not fooled by a local address inside the password", () => {
    expect(() => assertLocalUrl("postgresql://u:127.0.0.1@db.example.com/postgres")).toThrow(/local/i);
  });
  it("accepts the local database", () => {
    expect(assertLocalUrl("postgresql://postgres:postgres@127.0.0.1:54322/postgres")).toContain("127.0.0.1");
  });
  it("rejects a host override in the query string", () => {
    expect(() => assertLocalUrl("postgresql://u:p@127.0.0.1:54322/postgres?host=db.example.com")).toThrow(/local/i);
  });
});
