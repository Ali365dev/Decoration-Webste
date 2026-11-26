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
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "bareezehome.com.pk", pathname: "/cdn/shop/files/**" },
      { protocol: "https", hostname: "pyariwalls.pk", pathname: "/cdn/shop/**" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  // Local design assets from desgin/homePage
  turbopack: {},
};

export default nextConfig;
