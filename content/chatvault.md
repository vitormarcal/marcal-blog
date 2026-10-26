---
title: Chatvault
description: Como preservo meu Histórico do WhatsApp com o ChatVault
author: Vítor Marçal
created_at: 2024-12-25T20:30:00
updated_at: 
is_post: true
tags:
  - notas-pessoais
  - portugues
  - privacidade
  - programacao
related:
  - "[[tags/notas-pessoais]]"
  - "[[tags/portugues]]"
  - "[[tags/privacidade]]"
  - "[[tags/programacao]]"
image: https://visu.marcal.dev/shared-images/uqZYlCLla2ejcyJdRwn3rhWThIfyu8X_XIWzqfxgTvk
language: pt
localized_post_paths:
  - "[[en/chatvault]]"
has_localized_posts: true
---
## Conteúdo

## Chatvault

![Print de tela da Interface do chatvault exibe um efeito de desfoque (blur) aplicado sobre o texto das mensagens. À esquerda, há uma área com a lista de chats, onde cada chat é acompanhado pela imagem de perfil correspondente. No centro, o chat aberto exibe o conteúdo das mensagens de forma visível. À direita, é possível ver a galeria de imagens do chat, mostrando as miniaturas das imagens disponíveis na galeria.](https://visu.marcal.dev/shared-images/uqZYlCLla2ejcyJdRwn3rhWThIfyu8X_XIWzqfxgTvk)


Há pelo menos dois anos, eu vinha com uma ideia na cabeça: encontrar uma solução independente para registrar e acessar minhas conversas do WhatsApp. Sempre odiei a forma como o backup funciona — dependendo de circunstâncias como a troca de celular, acabei perdendo muitas mensagens preciosas. Além disso, não gosto de depender do Google para armazenar esses dados, tanto por ideologia quanto por querer explorar alternativas.

Apesar de preferir apps como o Telegram, reconheço que é difícil escapar do WhatsApp, já que ele é essencial para se manter conectado com amigos e familiares. Foi buscando uma forma de fazer backup e ler minhas conversas fora do app que comecei a desenvolver minha própria solução: o **[ChatVault](https://github.com/vitormarcal/chatvault)**.

### Como o ChatVault Funciona

O **ChatVault** é uma aplicação que importa os chats do WhatsApp e os disponibiliza em um frontend amigável (pelo menos, em teoria). O maior desafio foi contornar a falta de uma API oficial para exportação de mensagens. Soluções que acessam diretamente o banco de dados do WhatsApp são problemáticas porque:

1. **Criptografia:** A chave de criptografia é difícil de acessar e, geralmente, exige root no dispositivo, o que implica formatar o celular e apagar as conversas.
2. **Mudanças constantes na estrutura do banco:** Tabelas e campos mudam frequentemente, tornando o código de importação obsoleto a cada atualização do app.

Felizmente, o WhatsApp oferece uma funcionalidade de exportação de mensagens para arquivos texto ou ZIP. Embora limitada — só exporta até 100 mil mensagens (em 2023 eram apenas 10 mil) e deixa de fora algumas mídias de forma aleatória — essa abordagem foi suficiente para criar uma solução robusta.

### Desenvolvimento e Desafios

Desde 2013, venho aprimorando o ChatVault. O projeto passou por várias reescritas: troquei o backend de Node.js para Kotlin, mudei o banco de dados de SQLite para PostgreSQL e reformulei o frontend para melhorar a experiência do usuário.

Hoje, uso o ChatVault regularmente. O processo é simples: gero o ZIP no meu Android, transfiro para o computador e clico em "importar" na interface da aplicação. Também implementei uma funcionalidade para importar diretamente de e-mails, mas prefiro fazer tudo manualmente.

### Feedback e Limitações

Apesar de ser um projeto de nicho, o ChatVault já alcançou 114 estrelas no GitHub. A maior dificuldade relatada pelos usuários é a configuração inicial, especialmente devido aos diferentes formatos de data nos arquivos exportados. Por exemplo, um dispositivo pode gerar datas no formato `2021.01.12 - 05:01:01`, enquanto outro usa `21/01/12 05:01:01`. Resolvo esses problemas à medida que recebo feedback, mas não consigo prever todas as variações possíveis.

Documentei essas limitações no README do projeto e sempre incentivo os usuários a abrirem issues no GitHub para que possamos resolver juntos.

### Planos Futuros

Ainda há várias melhorias que gostaria de implementar, como:

- Busca de mensagens similar ao app do WhatsApp.
- Melhorias na galeria de mídias.
- Suporte a armazenamento em nuvem (Dropbox, Google Drive, etc.).
- Possibilidade de voltar a usar SQLite.

Infelizmente, como único desenvolvedor do projeto, o progresso é lento. Outros interesses competem pelo meu tempo, mas, para as minhas necessidades, o **ChatVault** já está no “estado da arte.”

### Reflexão

Manter um projeto por tanto tempo pode ser cansativo, mas também é gratificante. O ChatVault me permite acessar minhas conversas fora do WhatsApp e, quem sabe no futuro, até usá-las com IA para gerar insights interessantes.

Com este post, espero apresentar e registrar esse projeto que consumiu tanto do meu tempo, foi divertido de criar e continua sendo útil. É provável que eu reduza meu envolvimento aos poucos, mas ele já alcançou seu objetivo principal.

Se ficou curioso, dá uma olhada no [repositório do ChatVault no GitHub](https://github.com/vitormarcal/chatvault). 😉

---

## Ei, olha isso!
Achei bem legal colocar uma sessão de links legais e isso deve aparecer de vez quando - quando eu tiver links interessantes de alguma forma. Se quiser pode conferir os [links da última edição](descobri-retrowave#ei-olha-isso).

1. **[Forums Are Still Alive, Active, And A Treasure Trove Of Information](https://aftermath.site/best-active-forums-internet-today)** uma rica coletânea de foruns que ainda estão disponiveis por aí.
2. **[Writing Examples](https://writingexamples.com/)** é uma plataforma gratuita dedicada a celebrar e analisar grandes obras da literatura. O objetivo é fornecer exemplos práticos que ajudem escritores e entusiastas a aprimorar suas habilidades, inspirando-se nos mestres da literatura.
3. **[Personal Website Ideas](https://jamesg.blog/2024/02/19/personal-website-ideas/)** de James G. tem algumas ideias legais para o que se fazer em um site pessoal.
4. **[Ideas for Your Personal Website](https://32bit.cafe/websiteideas/)** Mesma ideia do link anterior: você acabou de fazer um site, e agora o que fazer?