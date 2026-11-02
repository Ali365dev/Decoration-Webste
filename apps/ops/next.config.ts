import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@dec-walls/ui",
    "@dec-walls/design-system",
    "@dec-walls/domain",
    "@dec-walls/auth",
    "@dec-walls/config",
    "@dec-walls/types",
    "@dec-walls/validation",
  ],
};

export default nextConfig;
