---
title: How to Generate an RSS Feed for Your Nuxt Content Site
description: This guide provides step-by-step instructions to create a server route that generates an RSS feed for your site.
author: Vítor Marçal
created_at: 2024-11-30T18:52:00
updated_at: 2024-11-30T19:03:00
is_post: true
tags:
  - english
  - programacao
  - tecnologia
related:
  - "[[tags/programacao]]"
  - "[[tags/english]]"
language: en
localized_post_paths:
  - "[[como-criar-um-feed-rss-para-o-seu-site-com-nuxt-content]]"
has_localized_posts: true
---
----

If you're running a blog powered by Nuxt 3 and Nuxt Content v2, adding an RSS feed is a great way to let readers subscribe to your updates. In this guide, we'll walk you through creating a server route to generate an RSS feed for your site.

> **Note**: This guide is based on a post originally published on Maciej Pędzich's blog, which is no longer available online. However, you can access it via the [Web Archive](https://web.archive.org/web/20220802163409/https://journal.maciejpedzi.ch/generating-rss-feeds-for-a-nuxt-content-site).

####  Install Required Dependencies

First, install the `feed` package, a simple RSS feed generator for Node.js:

```bash
npm install feed
```
For transforming the Nuxt Content body into valid HTML, install the `hast-util-to-html` package:

```bash
npm install hast-util-to-html
```

#### Create the Server Route

In your Nuxt project, create a `server/routes/rss.xml.ts` file to define the server route. This will handle the RSS feed generation.

```typescript
import { Feed } from 'feed';
import { serverQueryContent } from '#content/server';
import { toHtml } from 'hast-util-to-html';

export default defineEventHandler(async (event) => {
  const blogUrl = 'https://www.example.com'; // Replace with your site URL
  const feed = new Feed({
    id: 'rss',
    title: 'Your Blog Title',
    description: 'RSS feed for Your Blog',
    link: blogUrl,
    copyright: `2024-present Your Blog Title`,
  });

  const docs = await serverQueryContent(event).find();

  const recursivelyPatchChildren = (node) => {
    if (node.type === 'text') {
      return node;
    } else if (node.tag === 'code' && node.props.language) {
      node.props.lang = node.props.language;
      node.children = [{ type: 'text', value: node.props.code }];
      delete node.props.language;
      delete node.props.code;
    }
    node.tagName = node.tag;
    node.properties = node.props;
    node.children = node.children.map(recursivelyPatchChildren);
    return node;
  };

  for (const doc of docs) {
    doc.body.children = doc.body.children.map(recursivelyPatchChildren);
    const content = toHtml(doc.body);
    feed.addItem({
      id: doc._id,
      title: doc.title,
      description: doc.description,
      link: new URL(doc._path, blogUrl).href,
      content,
    });
  }

  appendHeader(event, 'Content-Type', 'application/xml');
  return feed.rss2(); // Generate RSS feed
});
```

#### Pre-render the RSS Route

To make the RSS feed available as a static file, update your `nuxt.config.ts` file to include pre-rendering:

```bash
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/rss.xml'],
    },
  },
});
```

#### How It Works

1. **Feed Initialization**: The `Feed` object is set up with metadata such as the blog title, description, and link.
2. **Content Transformation**: The Nuxt Content AST is patched and transformed into valid HTML using `hast-util-to-html`.
3. **Feed Population**: Each blog post is added to the feed with properties like title, description, and content.
4. **Code Snippets**: The code snippet patch ensures code blocks are properly formatted without inline styles, adhering to RSS feed standards.
5. **RSS Output**: The feed is returned as an RSS 2.0 XML document.

With these steps, you now have a fully functional RSS feed for your Nuxt Content-powered site. Happy coding!

