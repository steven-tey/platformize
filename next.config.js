module.exports = {
    publicRuntimeConfig: {
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
      if (process.env.NODE_ENV === 'production') { // production mode
        return [   
          // redirects for app
          {
              source: '/publications/:path*',
              has: [{
                  type: 'host',
                  value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
              }],
              destination: `/${process.env.APP_SLUG}`,
              permanent: true
          },
          {
              source: `/${process.env.APP_SLUG}`,
              has: [{
                  type: 'host',
                  value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
              }],
              destination: `/${process.env.APP_SLUG}`,
              permanent: true
          },
          {
              source: `/${process.env.APP_SLUG}/:path*`,
              has: [{
                  type: 'host',
                  value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
              }],
              destination: `/${process.env.APP_SLUG}`,
              permanent: true
          },

          // redirects for subdomains
          {
              source: '/publications/:path*',
              has: [{
                  type: 'host',
                  value: `(?<url>.*).${process.env.ROOT_URL}`
              }],
              destination: '/publications/:url',
              permanent: true
          },
          {
              source: `/${process.env.APP_SLUG}`,
              has: [{
                  type: 'host',
                  value: `(?<url>.*).${process.env.ROOT_URL}`
              }],
              destination: '/publications/:url',
              permanent: true
          },
          {
              source: `/${process.env.APP_SLUG}/:path*`,
              has: [{
                  type: 'host',
                  value: `(?<url>.*).${process.env.ROOT_URL}`
              }],
              destination: '/publications/:url',
              permanent: true
          },

          // redirects for custom domains
          {
              source: '/publications/:path*',
              has: [{
                  type: 'host',
                  value: `(?<url>.*)`
              }],
              destination: '/publications/:url',
              permanent: true
          },
          {
              source: `/${process.env.APP_SLUG}`,
              has: [{
                  type: 'host',
                  value: `(?<url>.*)`
              }],
              destination: '/publications/:url',
              permanent: true
          },
          {
              source: `/${process.env.APP_SLUG}/:path*`,
              has: [{
                  type: 'host',
                  value: `(?<url>.*)`
              }],
              destination: '/publications/:url',
              permanent: true
          },
        ]
      } else { // development mode
        return [
          {
              source: `/${process.env.APP_SLUG}`,
              destination: `/`,
              permanent: true
          },
          {
              source: `/${process.env.APP_SLUG}/:path*`,
              destination: `/`,
              permanent: true
          },
          {
              source: '/publications',
              destination: `/`,
              permanent: true
          },
          {
              source: '/publications/:path*',
              destination: `/`,
              permanent: true
          },
        ]
      }
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
                  destination: '/publications/:url',
              },
              {
                  source: '/:path*',
                  has: [{
                      type: 'host',
                      value: `(?<url>.*).${process.env.ROOT_URL}`
                  }],
                  destination: '/publications/:url/:path*',
              },

              // rewrites for custom domains
              {
                  source: '/',
                  has: [{
                      type: 'host',
                      value: '(?<url>.*)'
                  }],
                  destination: '/publications/:url',
              },
              {
                  source: '/:path*',
                  has: [{
                      type: 'host',
                      value: '(?<url>.*)'
                  }],
                  destination: '/publications/:url/:path*',
              },
          ]
        } else { // development mode
          if (process.env.CURR_SLUG === process.env.APP_SLUG) {
            return [
                  {
                      source: '/',
                      destination: `/${process.env.CURR_SLUG}`,
                  },
                  {
                      source: '/api/:path*',
                      destination: `/api/:path*`,
                  },
                  {
                      source: '/:path*',
                      destination: `/${process.env.CURR_SLUG}/:path*`,
                  },
              ]
          } else {
            return [
              {
                  source: '/',
                  destination: `/publications/${process.env.CURR_SLUG}`,
              },
              {
                  source: '/:path*',
                  destination: `/publications/${process.env.CURR_SLUG}/:path*`,
              },
          ]
        }
      }
    },
}