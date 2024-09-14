---
title: "De Volta ao Blog Estático: Simplicidade e Liberdade"
description: Mudei novamente a forma como distribuo conteúdo neste site.
author: Vítor Marçal
created_at: 2024-03-04T20:25:00
updated_at: 2024-03-04T20:25:00
is_post: true
tags:
  - tecnologia
  - programacao
related:
  - "[[tags/programacao]]"
language: pt
---
----

Até então, estava utilizando o [Ghost](https://github.com/TryGhost/Ghost), hospedado na internet por mim mesmo, em meu servidor em casa.

Não me leve a mal, eu não tenho críticas ao Ghost. Basicamente, você executa uma imagem Docker, configura uma conexão Mysql e pronto. Pode começar a criar conteúdo, de forma muito profissional, eu diria. Se você é uma pessoa não técnica, ou que não quer lidar com HTML, CSS e Javascript, com certeza, o Ghost é uma boa escolha.

Entretanto, as soluções tendem a ter ganhos e perdas. O que ganho em facilidade de criação de conteúdo e rapidez, eu perco em customização. Claro, você pode injetar código, criar seu próprio template, pode programar de acordo com as flexibilidades dadas pela ferramenta. Mas se vou precisar programar, por que devo fazer isso seguindo as regras do Ghost?

Outro ponto que me incomodava muito é que todo o meu conteúdo acabava sendo armazenado no banco de dados Mysql. Isso parece matar uma formiga usando uma bazuca. Ora, um blog pessoal é, basicamente, conteúdo estático. Texto e imagens, vez ou outra vídeos, áudios. Não foge muito disso.

Isso me fez voltar à minha estrutura anterior ao Ghost, onde basicamente servia um site totalmente estático, com os posts em markdown. [Aqui está o código fonte](https://github.com/vitormarcal/marcal-blog) livre para ser copiado e utilizado, se preferir. Repeti a mesma stack de tecnologia, Vue com Nuxt e Markdown. Somente isso.

Adaptei um pouco do tema anterior utilizado no Ghost, criei um sistema de tags com links, migrei as páginas do Ghost para markdown[^1],mas ainda quero mudar as paletas de cores, colocar um modo escuro e claro, reorganizar algumas áreas.

Ainda há muito o que fazer, mas estou hoje muito mais livre com o meu blog, sem estar preso a formatos e mecanismos proprietários. Quando me cansar do meu blog, só o que preciso fazer é aproveitar os posts em markdown e recomeçar novamente. Está tudo mais simples, não preciso de imagens docker, backends e nem banco de dados.

[^1]: Para migrar as páginas, utilizei [essa ferramenta online](https://urltomarkdown.com/), onde bastava colocar a URL da minha página, e ela gerava o markdown, e eu editava poucas coisas necessárias. Realmente útil.