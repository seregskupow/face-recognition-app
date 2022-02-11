const withPlugins = require('next-compose-plugins');
const withSvgr = require('next-svgr');
const path = require('path');
/** @type {import('next').NextConfig} */
module.exports = withPlugins([], {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: [
        {
          loader: 'url-loader',
        },
      ],
    });
    config.module.push({
      test: /\.svg$/,
      loader: 'svg-inline-loader',
      options: {
        removeTags: false,
      },
    });

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
});
