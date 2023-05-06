/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['**/*.test.{ts,tsx}'],
  tailwind: true,
  future: {
    v2_routeConvention: true,
    v2_meta: true,
    v2_errorBoundary: true,
  },
}
