import { execSync } from "node:child_process";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isGithubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/MT-Immigration";

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.1.6", "localhost", "127.0.0.1"],
  serverExternalPackages: ["@upstash/redis", "resend"],

  compress: true,
  output: "export",
  trailingSlash: true,
  ...(isGithubPages
    ? {
        basePath: githubPagesBasePath,
        assetPrefix: githubPagesBasePath,
      }
    : {}),

  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion",
      "react-hook-form",
      "@hookform/resolvers",
    ],
    optimizeCss: true,
    scrollRestoration: true,
    webVitalsAttribution: ["CLS", "LCP"],
  },

  generateBuildId: async () => {
    try {
      return execSync("git rev-parse HEAD").toString().trim();
    } catch {
      return "development";
    }
  },
};

export default withNextIntl(nextConfig);
