---
title: Comecei a utilizar o hardcover
description:
author: Vítor Marçal
created_at: 2026-01-29
updated_at:
is_post: true
tags:
  - livros
  - notas-pessoais
related:
  - "[[tags/livros]]"
  - "[[tags/notas-pessoais]]"
image: img/comecei-a-utilizar-o-hardcover.jpg
language: pt
localized_post_paths:
has_localized_posts: false
---
Desde pelo menos 2024 ou 2025 eu já não usava o Goodreads. Aquilo está largado às traças e a plataforma se tornou bem hostil ao acesso às APIs, o que significa que tudo o que você grava lá dificilmente consegue baixar depois.

Não sei como está hoje, mas lembro que ainda dava para exportar o registro dos livros lidos via um feed RSS. Depois de um tempo, soltaram algum comunicado dizendo que iriam restringir as APIs. Foi aí que deixei de usar de vez.

Cheguei a testar brevemente o Skoob e, depois de constatar que é uma bela porcaria, decidi registrar minhas leituras aqui mesmo, em formato de blog. Cada livro lido virava um post, sem nenhuma pretensão de ser conteúdo. Muitas vezes era só uma frase ou outra dizendo se gostei ou não.

Também criei posts de listas anuais, para ter uma noção do que li e do que planejava ler em cada ano. Fiz isso em [2024](leituras-de-2024) e em [2025](leituras-de-2025). Funcionou bem. Nada como o bom e velho HTML ou Markdown: você não precisa de planilha, não precisa de app proprietário, só seções bem definidas.

Em 2025 tive a ideia de ir além do post anual e criar um site separado, estático, muito parecido com este aqui, mas focado apenas nas minhas leituras. Sem um nome melhor, chamei de [Leituras do Vítor](https://books.marcal.dev/).

Gostei bastante do resultado, pelo menos visualmente. A ideia do fluxo parecia ser simples: criava o Markdown, gerava o site estático e a lista aparecia. O problema era a edição manual porque preencher dados do livro, caçar capa, escrever autor… isso me dava uma preguiça enorme, a ponto de adiar por dias.

Outro problema era a duplicação. O registro ficava lá e aqui. Dois sites para atualizar, dois deploys, era mais trabalho do que eu suportava.

Daí comecei a pensar em automatizar isso e eu já tinha a ideia do MediaPulse, que eu idealizava ser um sistema para agregar dados de mídia. Para música ele já está pronto, dá para ver na página de [músicas](musicas). Ele puxa dados do Plex e do Spotify quase em tempo real, enquanto eu ouço. A ideia para livros sempre foi essa também, e ainda é. Em algum momento eu coloco em prática.

Nesse meio-tempo comecei a usar o [hardcover.app](https://hardcover.app/). Diferente do Goodreads, ele é muito mais amigável, com um espírito mais indie. É tocado por desenvolvedores que passaram pela mesma frustração que eu tive com o Goodreads.

Eles ainda não conseguem viver do projeto, então não conseguem dedicar 100% do tempo a ele, mas espero muito que esse dia chegue. Os caras fizeram um produto bom! Visualmente bonito, bem organizado e, o mais importante, os dados são seus, dá para baixar tudo quando quiser. 

Daí me veio a ideia. Eu registro no Hardcover, onde o livro já entra com metadados completos: autor, ISBN, número de páginas, capa, edição, ano e tudo mais, numa interface intuitiva e bem feita, algo que eu definitivamente não tenho habilidade para implementar. Depois disso, eu só preciso ingerir esses dados no MediaPulse, do mesmo jeito que faço com Plex e Spotify. A partir daí, consigo exibir tudo neste site, assim como já faço com músicas. Chega de preencher formulário manual e de ficar criando Markdown.

Usando como referência a ingestão de músicas, levei uns bons meses até deixar tudo do jeito que eu queria, pelo menos estável. Não é algo tecnicamente complicado, mas sabe como é, a vida acontece, de modo que a funcionalidade de livros no MediaPulse ainda vai demorar um pouco.

Em 2026 vou manter a lista anual no formato tradicional, como nos outros anos. Mas espero que, em algum momento até dezembro, ela já esteja dinâmica. No momento estou com pouca vontade de manter o Leituras do Vítor, mas quem sabe ele não sirva de inspiração para o frontend da página de livros do MediaPulse.

Bora ver.