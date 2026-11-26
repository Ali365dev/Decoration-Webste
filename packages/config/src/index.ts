import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_STOREFRONT_URL: z
    .string()
    .url()
    .default("http://127.0.0.1:3000"),
  NEXT_PUBLIC_OPS_URL: z.string().url().default("http://127.0.0.1:3001"),
  PAYMENT_PROVIDER: z.enum(["noop", "stripe"]).default("noop"),
  EMAIL_PROVIDER: z.enum(["noop", "resend"]).default("noop"),
  SEARCH_PROVIDER: z.enum(["noop", "meilisearch"]).default("noop"),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

export function getEnv(overrides?: Record<string, string | undefined>): AppEnv {
  if (cached && !overrides) return cached;
  const parsed = envSchema.safeParse({
    ...process.env,
    ...overrides,
  });
  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration: ${parsed.error.message}`,
    );
  }
  if (!overrides) cached = parsed.data;
  return parsed.data;
}

export function hasSupabase(): boolean {
  const env = getEnv();
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  );
}

export function hasDatabase(): boolean {
  return Boolean(getEnv().DATABASE_URL);
}
