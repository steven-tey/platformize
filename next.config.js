module.exports = {
    publicRuntimeConfig: {
      NODE_ENV: process.env.NODE_ENV, 
      APP_SLUG: process.env.APP_SLUG
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
                  source: '/:path*',
                  has: [{
                      type: 'host',
                      value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
                  }],
                  destination: `/${process.env.APP_SLUG}/:path*`,
              },
              {
                  source: '/api/:path*',
                  has: [{
                      type: 'host',
                      value: `${process.env.APP_SLUG}.${process.env.ROOT_URL}`
                  }],
                  destination: `/api/:path*`,
              },
              
              // rewrites for subdomains
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