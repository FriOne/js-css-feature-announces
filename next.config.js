/** @type {import('next').NextConfig} */
const nextConfig = {
  esmExternals: 'loose',
  serverComponentsExternalPackages: ['mongoose'],
};

module.exports = nextConfig;
