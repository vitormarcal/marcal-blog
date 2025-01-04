---
title: Como Criar um Feed RSS para o Seu Site com Nuxt Content
description: Esta guia fornece instruções passo a passo para criar uma rota no servidor que gera um feed RSS para o seu site.
author: Vítor Marçal
created_at: 2024-11-30T18:52:00
updated_at: 2024-11-30T19:03:00
is_post: true
tags:
  - programacao
  - tecnologia
  - portugues
related:
  - "[[tags/programacao]]"
  - "[[tags/portugues]]"
language: pt
localized_post_paths:
  - "[[en/how-to-generate-an-rss-feed-for-your-nuxt-content-site]]"
has_localized_posts: true
---
Se você possui um blog que utiliza Nuxt 3 e Nuxt Content v2, adicionar um feed RSS é uma ótima maneira de permitir que seus leitores acompanhem suas atualizações. Neste guia, mostrarei como criar uma rota no servidor para gerar um feed RSS para o seu site.

> **Nota**: Este guia é baseado em um post originalmente publicado no blog de Maciej Pędzich, que não está mais disponível online. No entanto, você pode acessá-lo através do [Web Archive](https://web.archive.org/web/20220802163409/https://journal.maciejpedzi.ch/generating-rss-feeds-for-a-nuxt-content-site).

#### Instalar Dependências Necessárias

Primeiro, instale o pacote `feed`, um gerador de feeds RSS simples para Node.js:

```bash
npm install feed
```
Para transformar o corpo do conteúdo do Nuxt Content em HTML válido, instale também o pacote `hast-util-to-html`:

```bash
npm install hast-util-to-html
```

#### Criar a Rota do Servidor

No seu projeto Nuxt, crie o arquivo `server/routes/rss.xml.ts` para definir a rota do servidor que será responsável por gerar o feed RSS.

```typescript
import { Feed } from 'feed';
import { serverQueryContent } from '#content/server';
import { toHtml } from 'hast-util-to-html';

export default defineEventHandler(async (event) => {
  const blogUrl = 'https://www.seusite.com'; // Substitua pela URL do seu site
  const feed = new Feed({
    id: 'rss',
    title: 'Título do Seu Blog',
    description: 'Feed RSS do Seu Blog',
    link: blogUrl,
    copyright: `2024-presente Título do Seu Blog`,
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
  return feed.rss2(); // Gera o feed RSS
});
```

#### Pré-renderizar a Rota do RSS

Para tornar o feed RSS disponível como um arquivo estático, atualize o arquivo `nuxt.config.ts` para incluir a pré-renderização:

```bash
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/rss.xml'],
    },
  },
});
```

#### Como Funciona

1. **Inicialização do Feed**: O objeto `Feed` é configurado com metadados como título, descrição e link do blog.
2. **Transformação do Conteúdo**: O AST (Abstract Syntax Tree) do Nuxt Content é ajustado e transformado em HTML válido usando o `hast-util-to-html`.
3. **População do Feed**: Cada post do blog é adicionado ao feed com propriedades como título, descrição e conteúdo.
4. **Trechos de Código**: Um patch garante que os blocos de código sejam formatados corretamente, sem estilos inline, conforme os padrões do RSS.
5. **Geração do RSS**: O feed é retornado como um documento XML no formato RSS 2.0.

Com essas etapas, você terá um feed RSS funcional para o seu site criado com Nuxt Content. Divirta-se!

