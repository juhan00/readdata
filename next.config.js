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
};

module.exports = nextConfig;
