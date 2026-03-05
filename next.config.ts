import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "softwave-labs-backend.onrender.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;