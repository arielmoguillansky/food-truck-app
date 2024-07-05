/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    MAP_ID: process.env.MAP_ID,
    NEXT_PUBLIC_DATA_SERVER_HOST: process.env.DATA_SERVER_HOST,
    NEXT_PUBLIC_DATA_SERVER_URL: process.env.DATA_SERVER_URL,
  },
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // delay before rebuilding
    };
    return config;
  },
};

export default nextConfig;
