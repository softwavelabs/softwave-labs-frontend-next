import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    poweredByHeader: false,
    images: {
        dangerouslyAllowLocalIP: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "softwave-labs-backend.onrender.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "1337",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;