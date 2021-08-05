module.exports = {
    publicRuntimeConfig: { // only being used in /components/header.tsx, might wanna figure out how to remove
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
      // here we are defining a few redirects to prevent security breaches
      return [
        // redirect from login to home if session token is present
        {
            source: '/login',
            has: [
                {
                    type: 'cookie',
                    key: 'next-auth.session-token',
                },
            ],
            permanent: false,
            destination: '/',
        },
        {
            source: '/login',
            has: [
                {
                    type: 'cookie',
                    key: '__Secure-next-auth.session-token',
                },
            ],
            permanent: false,
            destination: '/',
        },
        // users shouldn't be able to access the /app route and its children canonically
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
        // users shouldn't be able to access the /publications route canonically
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
        // redirects for empty routes – /publication and /post (for app)
        {
            source: '/publication',
            destination: `/`,
            permanent: true
        },
        {
            source: '/post',
            destination: `/`,
            permanent: true
        },
      ]
    },
    async rewrites() {
        // we use async rewrites to control the behavior of subdomains & custom domains

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