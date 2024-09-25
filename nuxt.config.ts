// https://nuxt.com/docs/api/configuration/nuxt-config
const baseUrl = 'https://www.marcal.dev'
export default defineNuxtConfig({
  appConfig: {
      site: {
          baseUrl: baseUrl,
          title: 'Marçal',
          description: "Escrevo para eu mesmo como uma forma de documentar e ter um Segundo Cerébro 🧠"
      },
      author: {
          name: 'Vítor Marçal',
          email: 'feed@marcal.dev'
      },
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

  i18n: {
      customRoutes: 'config',
      pages: {
          posts: {
              en: '/posts',
              fr: '/publications',
              pt: '/publicacoes'
          },
          likes: {
              en: '/likes',
              fr: '/gouts',
              pt: '/gostos',
          }
      },
      locales: [
          { code: 'en', name: 'English'},
          { code: 'fr', name: 'Français'},
          { code: 'pt', name: 'Português'}
      ],
      defaultLocale: 'pt'
  },
  modules: ['nuxt-content-assets', '@nuxtjs/i18n', '@nuxt/content',
      //'@nuxt/image' commented to resolve a bug after upgrade nuxt
  ],

  css: ['~/assets/css/main.scss'],

  vite: {
      css: {
          preprocessorOptions: {
              scss: {
                  additionalData: '@use "~/assets/css/_variables.scss" as *;'
              }
          }
      }
  },

  nitro: {
      prerender: {
          crawlLinks: true,
          routes: ['/atom.xml','/rss.xml','/sitemap.xml']
      }
  },

    public: {
        mdc: {
            useNuxtImage: false,
        },
    },

  compatibilityDate: '2024-09-13'
})