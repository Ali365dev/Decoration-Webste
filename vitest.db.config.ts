import { defineConfig } from "vitest/config";

// Database tests. They need the local Supabase stack: npm run db:rehearse
export default defineConfig({
  test: {
    include: ["tests/db/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
    testTimeout: 30000,
  },
});
