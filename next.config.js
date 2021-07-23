module.exports = {
    publicRuntimeConfig: {
      NODE_ENV: process.env.NODE_ENV, 
      APP_SLUG: process.env.APP_SLUG,
      ROOT_URL: process.env.ROOT_URL,
    },
    images: {
      domains: ['og-image.vercel.app', 'pbs.twimg.com']
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
          source: '/post',
          has: [{
            type: 'host',
            value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
          }],
          destination: '/',
          permanent: true,
        },
        {
          source: '/publication',
          has: [{
            type: 'host',
            value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
          }],
          destination: '/',
          permanent: true,
        },
      ]
    },
    async rewrites() {
        if (process.env.NODE_ENV === 'production') { // production mode
          return [
              // rewrites for app
              {
                  source: '/',
                  has: [{
                      type: 'host',
                      value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
                  }],
                  destination: `/${process.env.APP_SLUG}`,
              },
              {
                  source: '/api/:path*',
                  has: [{
                      type: 'host',
                      value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
                  }],
                  destination: `/api/:path*`,
              },
              {
                  source: '/:path*',
                  has: [{
                      type: 'host',
                      value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
                  }],
                  destination: `/${process.env.APP_SLUG}/:path*`,
              },
              
              // rewrites for subdomains
              {
                  source: '/',
                  has: [{
                      type: 'host',
                      value: `(?<url>.*).${process.env.ROOT_URL}`
                  }],
                  destination: '/:url',
              },
              {
                  source: '/:path*',
                  has: [{
                      type: 'host',
                      value: `(?<url>.*).${process.env.ROOT_URL}`
                  }],
                  destination: '/:url/:path*',
              },

              // rewrites for custom domains
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
        } else { // development mode
        return [
              {
                  source: '/',
                  destination: `/${process.env.CURR_SLUG}`,
              }
          ]
        }
    },
}