require("dotenv").config();
const path = require("path");
const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  experimental: {
    esmExternals: "loose",
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "src/styles/_mixin"; @import "src/styles/_variables";`,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.symlinks = false;
      config.resolve.modules.push(__dirname + "/node_modules");
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `${process.env.NEXT_PUBLIC_DEFAULT_API_URL}:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
