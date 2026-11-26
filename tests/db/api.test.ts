// The same rules through the local Supabase API, which customers could call directly.
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { assertLocalUrl, connect } from "./helpers";
import { person } from "./people";

// Local development keys, read into memory only.
const env = Object.fromEntries(
  execFileSync("supabase", ["status", "-o", "env"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
    .split("\n").map((line) => /^([A-Z_]+)="(.*)"$/.exec(line)).filter(Boolean).map((m) => [m![1], m![2]]),
);
const apiUrl = assertLocalUrl(env.API_URL!);
const client = (key: string) => createClient(apiUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });

const sql = connect();
const service = client(env.SERVICE_ROLE_KEY!);
const anon = client(env.ANON_KEY!);
const receipt = `test/${randomUUID()}.png`;
const users: { id: string; email: string; client: SupabaseClient; orderId: string; customerId: string }[] = [];

beforeAll(async () => {
  for (let i = 0; i < 2; i++) {
    const email = `api-${randomUUID()}@example.test`;
    const password = randomUUID();
    const made = await service.auth.admin.createUser({ email, password, email_confirm: true });
    if (made.error) throw made.error;
    const p = await sql.begin((tx) => person(tx, made.data.user.id, false));
    const signedIn = client(env.ANON_KEY!);
    const login = await signedIn.auth.signInWithPassword({ email, password });
    if (login.error) throw login.error;
    users.push({ id: made.data.user.id, email, client: signedIn, orderId: p.order.id, customerId: p.customer.id });
  }
  const upload = await service.storage.from("receipts").upload(receipt, new Blob(["x"], { type: "image/png" }), { contentType: "image/png" });
  if (upload.error) throw upload.error;
});

afterAll(async () => {
  // local test data only
  await service.storage.from("receipts").remove([receipt]);
  for (const u of users) {
    for (const table of ["order_status_history", "payments", "order_addresses", "order_items"]) {
      await sql`delete from ${sql(table)} where order_id = ${u.orderId}`;
    }
    await sql`delete from orders where id = ${u.orderId}`;
    await sql`delete from customers where id = ${u.customerId}`;
    await service.auth.admin.deleteUser(u.id);
  }
  await sql.end();
});

describe("Supabase API", () => {
  it("lets anyone read published products", async () => {
    const { data, error } = await anon.from("products").select("id").limit(1);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it("refuses orders to anonymous visitors", async () => {
    const { data, error } = await anon.from("orders").select("id");
    expect(error?.code).toBe("42501");
    expect(data).toBeNull();
  });

  it("shows a signed-in customer only their own orders", async () => {
    const { data, error } = await users[0]!.client.from("orders").select("id");
    expect(error).toBeNull();
    expect(data).toEqual([{ id: users[0]!.orderId }]);
  });

  it("does not let anyone change stock through a function call", async () => {
    const args = { p_variant_id: randomUUID(), p_delta: 100, p_type: "restock", p_reason: "attack" };
    for (const c of [anon, users[0]!.client]) {
      const { error } = await c.rpc("adjust_stock", args);
      expect(["42501", "PGRST202"]).toContain(error?.code);
    }
  });

  it("keeps receipts private and refuses direct uploads", async () => {
    for (const c of [anon, users[0]!.client]) {
      expect((await c.storage.from("receipts").download(receipt)).error).not.toBeNull();
      for (const bucket of ["receipts", "catalog"]) {
        const attempt = await c.storage.from(bucket).upload(`attack/${randomUUID()}.png`, new Blob(["x"]), { contentType: "image/png" });
        expect(attempt.error, bucket).not.toBeNull();
      }
    }
  });

  it("limits what the two buckets accept", async () => {
    const rows = await sql`select id, public, file_size_limit::int as size, allowed_mime_types as types from storage.buckets order by id`;
    expect(rows).toEqual([
      { id: "catalog", public: true, size: 5242880, types: ["image/jpeg", "image/png", "image/webp"] },
      { id: "receipts", public: false, size: 10485760, types: ["image/jpeg", "image/png", "application/pdf"] },
    ]);
  });
});
