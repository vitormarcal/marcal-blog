// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
        '@nuxt/content'
    ],
    nitro: {
        prerender: {
            routes: ['/atom','/rss.xml','/sitemap.xml']
        }
    }

})
