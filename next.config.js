/* var PrismaClient = require('@prisma/client')
let prisma = new PrismaClient.PrismaClient()

const customDomainsFunction = async () => {
  const data = await prisma.publication.findMany({
    where: {
      NOT: {
        customDomain: null
      }
    },
    select: {
      customDomain: true,
      url: true
    }
  })
  return data
} */

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
            {
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
            },
            /* ...customDomains.map((customDomain) => ({
              source: '/',
              has: [{
                  type: 'host',
                  value: `${customDomain.customDomain}`
              }],
              destination: `/${customDomain.url}`,
            })),
            ...customDomains.map((customDomain) => ({
              source: '/p/:slug',
              has: [{
                  type: 'host',
                  value: `${customDomain.customDomain}`
              }],
              destination: `/${customDomain.url}/p/:slug`,
            })),
            ...customDomains.map((customDomain) => ({
              source: '/:path',
              has: [{
                  type: 'host',
                  value: `${customDomain.customDomain}`
              }],
              destination: `/${customDomain.url}/:path`,
            })) */
        ]
    },
}