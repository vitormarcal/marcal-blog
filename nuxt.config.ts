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
          script: [
              {
                  src: 'https://isso.marcal.dev/js/embed.min.js',
                  'data-isso': 'https://isso.marcal.dev/',
                  'data-isso-avatar': 'true',
                  'data-isso-page-author-hashes':  'c87cd8fc107c',
                  'data-isso-vote': 'true',
                  'data-isso-vote-levels': "-5,5"
              }
          ]
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
            ]

        },
    },
    modules: [
        'nuxt-content-assets', // make sure to add before content!
        '@nuxt/content'
    ],
    nitro: {
        prerender: {
            routes: ['/atom','/rss.xml','/sitemap.xml']
        }
    }

})
