// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    content: {
        documentDriven: true,
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

})
