import {Feed} from 'feed';
import type {ParsedContent} from "@nuxt/content/types";
import {ar} from "~/.output/public/_nuxt/entry.BSSshxk6";

const BASE_URL = "https://marcal-blog.vercel.app"
const AUTHOR_NAME = "Vítor Marçal"
export const generateFeed = (articles: ParsedContent[]) => {
    const feed = new Feed({
        title: "Marçal",
        description: "Escrevo para eu mesmo como uma forma de documentar e ter um Segundo Cerébro 🧠",
        id: BASE_URL,
        link: BASE_URL,
        language: "pt-BR",
        image: `${BASE_URL}/images/placeholder.png`,
        favicon: `${BASE_URL}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR_NAME}`,
        updated: new Date(),
        generator: "Nuxt static site generation + Feed for Node.js",
        feedLinks: {
            atom: `${BASE_URL}/atom`,
            rss: `${BASE_URL}/rss.xml`
        },
        author: {
            name: AUTHOR_NAME,
        }
    });

    function newDate(article: any) {
        if (!!article.updated_at) {
            return new Date(article.updated_at)
        } else if (!!article.created_at) {
            return new Date(article.created_at)
        } else {
            return new Date()
        }
    }

    articles.forEach((article) => {
        console.log(article)
        feed.addItem({
            title: article.title ? article.title : "Missing Title",
            id: article._path,
            link: `${BASE_URL}${article._path}`,
            description: article.description,
            author: [
                {
                    name: AUTHOR_NAME,
                },
            ],
            date: newDate(article),
            image: article.cover_image ? `${BASE_URL}/${article.cover_image}` : undefined,
        });
    });

    return feed
};
