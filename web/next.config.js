/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "csm-prod.s3.us-east-005.backblazeb2.com",
      "csm-assignment.s3.ap-south-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
