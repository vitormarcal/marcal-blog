// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  appConfig: {
      site: {
          baseUrl: 'https://www.marcal.dev',
          title: 'Marçal',
          description: "Escrevo para eu mesmo como uma forma de documentar e ter um Segundo Cerébro 🧠"
      },
      author: {
          name: 'Vítor Marçal',
          email: 'oi@marcal.dev'
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

  modules: [// make sure to add before content!
  'nuxt-content-assets', '@nuxt/content', "@nuxt/image"],

  nitro: {
      prerender: {
          crawlLinks: true,
          routes: ['/atom.xml','/rss.xml','/sitemap.xml']
      }
  },

  compatibilityDate: '2024-07-08'
})