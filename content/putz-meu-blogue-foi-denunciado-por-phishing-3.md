---
title: Putz! Meu blogue foi denunciado por phishing 3
description: 
author: Vítor Marçal
created_at: 2025-01-29T19:32:00
updated_at: 
is_post: true
tags:
  - notas-pessoais
related:
  - "[[tags/notas-pessoais]]"
  - "[[tags/portugues]]"
language: pt
localized_post_paths: 
has_localized_posts: false
---
Mais uma vez, meus domínios foram marcados com o alerta de **"Site enganoso ou de engenharia social"**. Aff...

No Google Search Console, aparecem dois links com problemas detectados:

- `http://link.marcal.dev/bookmarks`
- `http://marcal.dev/login/`

Como o Google encontrou `http://marcal.dev/login/` se esse link nem existe? Não há página de login, apenas um redirecionamento para um **404**. Já o subdomínio `link.` é a minha instância do [Linkding](https://github.com/sissbruecker/linkding), onde salvo links interessantes para ler depois.

Na semana passada, abri [uma issue](https://github.com/sissbruecker/linkding/issues/956) no projeto Linkding no GitHub solicitando que adicionassem um **robots.txt** para impedir a indexação pelo Google. Eles já adicionaram, mas isso aparentemente não teve efeito.

Será que esse subdomínio tem uma má reputação por começar com `link.`? Talvez o Google o tenha classificado como potencialmente **enganoso**, achando que se trata de um encurtador de URLs (muitos são abusados para phishing).

Sem muito o que fazer, solicitei novamente a revisão ao Google. Vamos ver o que eles decidirão... Mas tenho a impressão de que terei esse problema para sempre a partir de agora.

Estou considerando mudar o subdomínio — quem sabe isso resolva o problema. Mas que chato, viu? `"link"` é um nome curto, memorável e simples, perfeito para o serviço. E o pior: ele é **privado**, protegido por senha. Ou seja, o Google está me "protegendo" do meu próprio site, **sendo que** eu sou o único usuário?