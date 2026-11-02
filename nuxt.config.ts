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

  runtimeConfig: {
    public: {
      mediaPulseBaseUrl: 'https://media-pulse.marcal.dev'
    }
  },

  content: {
      defaultLocale: 'pt-BR',
      documentDriven: true,
      markdown: {
          remarkPlugins: {
              'remark-toc': {
                  heading: '(table[ -]of[ -])?conteúdo|contenu|sumário|contents?|toc'
              },
              'remark-gfm': {},
          }

      },
      highlight: {
          theme: 'dracula',
          langs: [
              'java', 'shell', 'xml', 'html', 'json', 'js', 'ts', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml'
          ]

      },
  },

  modules: ['@nuxt/content',
      //'@nuxt/image' commented to resolve a bug after upgrade nuxt
  ],

  css: ['~/assets/css/resets.css'],

  // Applied by Nitro when running the Nuxt server. Static deployments must
  // configure equivalent headers in their hosting provider.
  routeRules: {
      '/img/**': { headers: { 'cache-control': 'public, max-age=604800' } },
      '/favicon.ico': { headers: { 'cache-control': 'public, max-age=604800' } },
      '/favicon-fanzine.svg': { headers: { 'cache-control': 'public, max-age=604800' } },
  },

  nitro: {
      prerender: {
          crawlLinks: true,
          routes: ['/atom.xml','/rss.xml','/sitemap.xml'],
      }
  },

  public: {
      mdc: {
          useNuxtImage: false,
      },
  },

  compatibilityDate: '2025-01-12',
})
