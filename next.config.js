/**
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
module.exports = {
  compress: false,
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config) => {
    config.optimization.minimize = true;

    return config;
  }
};
