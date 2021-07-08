module.exports = {
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
        //const customDomains = await customDomainsFunction()
        return [
            /* {
                source: '/(.*)',
                has: [{
                    type: 'host',
                    value: 'app.platformize.co'
                }],
                destination: '/app*',
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
                source: '/p/:slug',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)\\.platformize\\.co'
                }],
                destination: '/:url/p/:slug',
            },
            {
                source: '/:path',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)\\.platformize\\.co'
                }],
                destination: '/:url/:path',
            },
            // these two can be combined, parse everything in getStaticProps
            /* {
                source: '/',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)'
                }],
                destination: '/:url',
            },
            {
                source: '/p/:slug',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)'
                }],
                destination: '/:url/p/:slug',
            },
            {
                source: '/:path',
                has: [{
                    type: 'host',
                    value: '(?<url>.*)'
                }],
                destination: '/:url/:path',
            }, */
        ]
    },
}