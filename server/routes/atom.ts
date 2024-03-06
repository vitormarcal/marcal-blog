import {serverQueryContent} from '#content/server';
import {generateFeed} from "~/utils/feed-export";

export default defineEventHandler(async (event) => {
    const articles = await serverQueryContent(event)
        .where({is_post: true, _partial: false})
        .sort({ created_at: -1})
        .find();

    const appConfig = useAppConfig()

    const feedString = generateFeed(articles, appConfig).atom1()

    event.node.res
    event.node.res.setHeader('content-type', 'text/xml');
    event.node.res.end(feedString);
});


