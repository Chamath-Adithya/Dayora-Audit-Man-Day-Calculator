
/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export", // Enables static exports for Electron
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

