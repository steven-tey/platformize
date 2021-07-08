module.exports = {
    publicRuntimeConfig: {
      NODE_ENV: process.env.NODE_ENV
    },
    images: {
      domains: ['og-image.vercel.app']
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    async redirects() {
      return [
        {
          source: '/publication',
          destination: '/',
          permanent: true,
        },
      ]
    },
    async redirects() {
      return [
        {
          source: '/post',
          destination: '/',
          permanent: true,
        },
      ]
    },
    async rewrites() {
        if (process.env.NODE_ENV === 'production') {
          return [
              /* {
                  source: '/(.*)',
                  has: [{
                      type: 'host',
                      value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
                  }],
                  destination: `/${process.env.APP_SLUG}*`,
              }, */
              {
                  source: '/',
                  has: [{
                      type: 'host',
                      value: '(?<url>.*)\\.platformize\\.co'
                  }],
                  destination: '/:url',
              },
              {
                  source: '/:path*',
                  has: [{
                      type: 'host',
                      value: '(?<url>.*)\\.platformize\\.co'
                  }],
                  destination: '/:url/:path*',
              },
              {
                  source: '/',
                  has: [{
                      type: 'host',
                      value: '(?<url>.*)'
                  }],
                  destination: '/:url',
              },
              {
                  source: '/:path*',
                  has: [{
                      type: 'host',
                      value: '(?<url>.*)'
                  }],
                  destination: '/:url/:path*',
              }
          ]
        } else {
        return [
              {
                  source: '/',
                  destination: `/${process.env.CURR_SLUG}`,
              }
          ]
        }
    },
}