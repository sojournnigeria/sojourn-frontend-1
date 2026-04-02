/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    // Warning: only use this if you really understand
    // that TS errors might hide runtime bugs!
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  trailingSlash: false,
  crossOrigin: "use-credentials",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "kwatsltiwynjmybhooal.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "sojourn-v1-assets.s3.eu-north-1.amazonaws.com",
        port: "",
      },
    ],
  },

  async headers() {
    return [
      // {
      //   source: "/(.*)",
      //   headers: [
      //     {
      //       key: "Content-Security-Policy",
      //       value: "default-src 'self';  object-src 'none';",
      //     },
      //   ],
      // },
      /**
       * default-src 'self': Only allow resources from the same origin.
script-src 'self': Only allow scripts from the same origin.
object-src 'none': Block embedding of objects like Flash or PDFs.
       */
      {
        source: "/about-us", // Apply to about us route
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // destination: "http://localhost:3000/api/v1/:path*",
        destination: "https://sojourn-backend-gczm.onrender.com/api/v1/:path*", // Proxy to Backend/
        // destination: "http://92.112.192.73/api/v1/:path*",
      },
      {
        source: "/photo/:path*",
        destination:
          "https://kwatsltiwynjmybhooal.supabase.co/storage/v1/object/public/sojourn_dev/:path*", // Proxy to Backend
        // destination: "https://sojourn-backend-api.onrender.com/api/v1/:path*",
      },
      {}
    ];
  },

  async redirects() {
    return [
      {
        source: "/hosts/dashboard",
        permanent: true,
        destination: "/hosts/dashboard/properties",
      },
      {
        source: "/hosts/login",
        permanent: true,
        destination: "/hosts/signup?login=1",
      },
    ];
  },
};

export default nextConfig;
