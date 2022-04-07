const withPlugins = require('next-compose-plugins');
const withSvgr = require('next-svgr');
const path = require('path');
/** @type {import('next').NextConfig} */
module.exports = withPlugins([withSvgr], {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push(
      {
        test: /\.(glb|gltf)$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      }
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline-loader',
      //   options: {
      //     removeTags: false,
      //   },
      // }
    );

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "main.scss";`,
  },
  images: {
    domains: [
      'cdn.sanity.io',
      'pbs.twimg.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'localhost',
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:1337/api/v1/:path*', // Proxy to Backend
      },
    ];
  },
});
