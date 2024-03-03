// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    hooks: {
        close: () => {
            // @see https://github.com/nuxt/cli/issues/169#issuecomment-1729300497
            // Workaround for https://github.com/nuxt/cli/issues/169
            process.exit(0)
        }
    },
    devtools: {enabled: true},
    app: {
      head: {

      }
    },
    content: {
        defaultLocale: 'pt-BR',
        documentDriven: true,
        markdown: {
            remarkPlugins: {
                'remark-toc': {
                    heading: '(table[ -]of[ -])?conteúdo|sumário|contents?|toc'
                },
                'remark-gfm': {},
            }

        },
        highlight: {
            theme: 'dracula',
            langs: [
                'java',
                'shell',
                'xml',
                'html',
            ]

        },
    },
    modules: [
        'nuxt-content-assets', // make sure to add before content!
        '@nuxt/content'
    ],
    nitro: {
        prerender: {
            crawlLinks: true,
            routes: ['/atom','/rss.xml','/sitemap.xml']
        }
    }

})
