module.exports = {
    images: {
        domains: ['og-image.vercel.app', 'pbs.twimg.com', 'avatars.githubusercontent.com']
    },
    i18n: {
      locales: ['en-US', 'fr', 'nl-NL'],
      defaultLocale: 'en-US',
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
}