// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

const packages = Object.keys(pkg.dependencies).filter((name) =>
  name.includes('@mochary')
);

/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextTranspileModules = require('next-transpile-modules')(
  [...packages],
  {
    resolveSymlinks: true,

    debug: false,
  }
);

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
    externalDir: true,
  },
};

const config = withNextTranspileModules(nextConfig);

module.exports = config;