// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
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
            routes: ['/atom','/feed.xml','/sitemap.xml']
        }
    }

})
