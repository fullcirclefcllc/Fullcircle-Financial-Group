/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Lets admins upload filing documents up to 20 MB.
    serverActions: { bodySizeLimit: "20mb" },
  },
};
export default nextConfig;
