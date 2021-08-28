module.exports = {
    publicRuntimeConfig: {
      ROOT_URL: process.env.ROOT_URL
    },
    i18n: {
        locales: ['en-US', 'fr', 'nl-NL'],
        defaultLocale: 'en-US',
    },
    images: {
        domains: ['og-image.vercel.app', 'pbs.twimg.com', 'avatars.githubusercontent.com']
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
}