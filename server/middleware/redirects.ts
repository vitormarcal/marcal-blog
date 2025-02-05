export default defineEventHandler((event) => {
    const url = getRequestURL(event)

    if (url.pathname.startsWith("/blog/")) {
        const newPath = url.pathname.replace(/^\/blog\//, "/")
        return sendRedirect(event, newPath, 301)
    }
})
