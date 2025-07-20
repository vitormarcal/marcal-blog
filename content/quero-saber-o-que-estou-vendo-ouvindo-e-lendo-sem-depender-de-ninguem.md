---
title: Quero saber o que estou vendo, ouvindo e lendo (sem depender de ninguém)
description: 
author: Vítor Marçal
created_at: 2025-07-20T18:35:00
updated_at: 
is_post: true
tags:
  - notas-pessoais
  - tecnologia
  - programacao
  - portugues
related:
  - "[[tags/notas-pessoais]]"
  - "[[tags/tecnologia]]"
  - "[[tags/programacao]]"
  - "[[tags/portugues]]"
image: img/trabalhando-em-uma-especie-de-media-tracking.jpg
language: pt
---
Hoje em dia, existem várias ferramentas de _media tracking_, incluindo algumas _open source_, outras fechadas, com interfaces lindas e recursos completos. Eu poderia muito bem escolher uma delas e seguir em frente… mas venho sentindo vontade de criar minhas **próprias bases de mídia pessoal**, acessíveis de forma simples, via JSON, e servidas por uma API leve e unificada.

A ideia não é competir com os grandes. Seria ingenuidade minha achar que vou fazer um trabalho melhor do que ferramentas como Trakt, Last.fm, Letterboxd ou até o próprio Plex. O objetivo aqui é outro: **manter minha própria base de consumo de mídia, sob meu controle, com liberdade para integrar, experimentar e exibir como quiser**, inclusive no meu blog.

Quando os blogues estavam em alta, era comum ver widgets com uma rádio tocando no canto da tela. Era um charme à parte. Fiquei pensando: e se eu conseguisse recriar algo parecido… mas em vez de uma rádio genérica, mostrar o que **eu** estou ouvindo no momento? Ou então exibir minhas últimas músicas, filmes, episódios assistidos, livros lidos? Tudo isso seria ótimo de ter no meu blog mas seria bem trabalhoso manter manualmente.

Já é um pouco trabalhoso publicar manualmente os livros que leio no meu [Book Tracker](https://books.marcal.dev). Imagina fazer o mesmo para música, filmes e séries? Seria impraticável. O ideal seria algo automático, leve e que exigisse zero esforço da minha parte depois de configurado.

Essa vontade se conecta com algo que comentei na postagem [Pensando em mudar o blog (de novo?)](pensando-em-mudar-o-blog-de-novo): tornar meu blog mais dinâmico, mais vivo, mais integrado com o que eu realmente consumo no dia a dia. E foi assim que nasceu a ideia do **Media Pulse**, um sistema simples, cujo nome vem justamente dessa noção de “pulso constante” das mídias que acompanham meu cotidiano.

Ainda está no começo. Configurei um _webhook_ do Plex, que dispara eventos quando eu dou play, pause ou termino de ver/assistir algo. Esses eventos são capturados e gravados em uma base local. Só isso, por enquanto. Mas a estrutura está montada.

O próximo passo é **processar esses eventos**: entender os diferentes tipos, extrair os dados relevantes (qual episódio? que música? que hora?) e criar filtros para decidir o que realmente vale mostrar. Depois disso, quero criar endpoints simples de API para alimentar seções dinâmicas do meu blog, por exemplo:

- "Tocando agora" no rodapé
- "Últimos episódios assistidos"
- "Histórico de filmes e músicas"
- "Avaliações e comentários rápidos"

Tudo isso de forma automática, e quem sabe até se integrando com meu book tracker.

Enfim, a ideia do Media Pulse é bem simples: manter **minhas próprias batidas de mídia** sob meu controle, com liberdade para mostrar, ocultar, misturar e criar o que quiser em cima. Ainda tem muita coisa por vir… aguardem mais novidades!