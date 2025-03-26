import dotenv from 'dotenv';

dotenv.config();  // Ensure .env.local is loaded

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,  // Explicitly add env var
    },
    webpack: (config, { dev, isServer }) => {
        // Disable webpack cache in development
        if (dev) {
            config.cache = false;
        }
        return config;
    },
    // Disable experimental features that might cause issues
    experimental: {
        optimizeCss: false,
    },
};

export default nextConfig;
