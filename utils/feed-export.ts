import {Feed} from 'feed';
import type {ParsedContent} from "@nuxt/content/types";
import type {AppConfig} from "@nuxt/schema";
import {toHtml} from "hast-util-to-html";

export const generateFeed = (articles: ParsedContent[], appConfig: AppConfig) => {
    const BASE_URL = appConfig.site.baseUrl
    const feed = new Feed({
        title: appConfig.site.title,
        description: appConfig.site.description,
        id: BASE_URL,
        link: BASE_URL,
        language: "pt-BR",
        image: `${BASE_URL}/images/placeholder.png`,
        favicon: `${BASE_URL}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, ${appConfig.author.name}`,
        updated: new Date(),
        generator: "Nuxt static site generation + Feed for Node.js",
        feedLinks: {
            atom: `${BASE_URL}/atom.xml`,
            rss: `${BASE_URL}/rss.xml`
        },
        author: {
            name: appConfig.author.name,
            email: appConfig.author.email
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

        const content = getContent(article)


        feed.addItem({
            title: article.title ? article.title : "Missing Title",
            id: article._path,
            link: `${BASE_URL}${article._path}`,
            description: article.description,
            content: content,
            author: [
                {
                    name: article.author ? article.author : appConfig.author.name,
                    email: article.email ? article.email : appConfig.author.email
                },
            ],
            date: newDate(article),
            image: article.cover_image ? `${BASE_URL}/${article.cover_image}` : undefined,
        });
    });

    return feed
};

function getContent(doc: ParsedContent): string | undefined {
    const recursivelyPatchChildren = (node: any) => {
        if (node.type === 'text') {
            return node;
        } else if (node.tag === 'code' && node.props.language) {
            node.props.lang = node.props.language;
            node.children = [{type: 'text', value: node.props.code}];
            delete node.props.language;
            delete node.props.code;
        }
        node.tagName = node.tag;
        node.properties = node.props;
        node.children = node.children.map(recursivelyPatchChildren);
        return node;
    };
    if (doc.body) {
        doc.body.children = doc.body.children.map(recursivelyPatchChildren);
        // @ts-ignore
        return toHtml(doc.body)
    }
    return undefined


}
