/**
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
module.exports = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config) => {
    config.optimization.minimize = true;

    return config;
  }
};
