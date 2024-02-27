import { serverQueryContent } from '#content/server';
import {generateFeed} from "~/utils/feed-export";
export default defineEventHandler(async (event) => {
    const articles = await serverQueryContent(event).find();

    return generateFeed(articles).atom1()
});


