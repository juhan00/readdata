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
  async rewrites() {
    return [
      {
        source: "/api_default/:path*",
        destination: `${process.env.NEXT_PUBLIC_DEFAULT_API_URL}:path*`,
      },
      {
        source: "/api_address/:path*",
        destination: `${process.env.NEXT_PUBLIC_ADDRESS_API_URL}:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
