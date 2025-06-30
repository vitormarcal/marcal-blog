---
title: Pensando em mudar o blog (de novo?)
description: Tentando simplificar (ou complicar?)
author: Vítor Marçal
created_at: 2025-06-30T13:24:00
updated_at: 
is_post: true
tags:
  - notas-pessoais
  - portugues
related:
  - "[[tags/notas-pessoais]]"
  - "[[tags/portugues]]"
language: pt
---
Há algum tempo venho pensando em mudar a forma como publico neste site. Atualmente, ele é um site estático, sem banco de dados, apenas textos em Markdown, com a ajuda do Nuxt e do Nuxt Content para renderizá-los. Caso queira saber mais sobre como funciona, leia em  [Como funciona esse blog](como-funciona-esse-blogue).

Funciona muito bem, não acho que haja muita fricção. Já expliquei o motivo dessa estratégia de publicação em [De Volta ao Blog Estático: Simplicidade e Liberdade](de-volta-ao-blog-estatico-simplicidade-e-liberdade).

Mas, ultimamente, tenho pensado cada vez mais em mudar a abordagem. Talvez algo híbrido: manter algumas coisas estáticas e outras dinâmicas, armazenadas em banco de dados. Por exemplo, minhas postagens regulares poderiam continuar como textos em Markdown, enquanto as postagens relacionadas às minhas leituras poderiam estar, ao menos em parte, numa base de dados.

Por quê? Não sei se tenho um motivo forte. Mas eu poderia manter a lista de livros, o tempo que levei para ler, se gostei ou não... tudo isso num banco, o que facilitaria portar essas informações para outro app, caso eu queira.

Atualmente, estou num desafio ouvindo um álbum por dia. Ainda não publiquei nada sobre isso aqui no blog, mas a lista e as avaliações do que ouvi estão em uma aplicação proprietária. Posso exportar os dados — a plataforma permite —, mas me pergunto se não deveria manter tudo em formato Markdown, como faço com minhas leituras.

Aliás, tenho até um site separado para esse tracking de leituras, embora ainda seja experimental: [books.marcal.dev](https://books.marcal.dev). As postagens daqui sobre livros são espelhadas lá, mas em outro formato, na ideia de um _book tracker_. Tenho pensado em centralizar essas informações em um único lugar, mas a forma como construí o site com Nuxt e Nuxt Content acabou me deixando um pouco preso à estrutura de pastas e à rigidez dos layouts, e isso tem me irritado um pouco.

Por exemplo: se quiser criar uma nova postagem, preciso criar um arquivo Markdown. Se quiser criar uma página puramente em HTML, sem Markdown, preciso fazer algumas gambiarras, como incluir um arquivo Markdown vazio... Se quero outro layout, os estilos acabam se misturando um pouco. Isso tudo por conta do uso do Nuxt e do Nuxt Content — bibliotecas Vue.

Já pensei em abandonar o Vue, apesar de ele me atender muito bem, e usar apenas HTML, CSS e JavaScript puro, sem frameworks como Vue ou React. Isso me daria mais flexibilidade, embora também mais trabalho para “reinventar a roda”. Mas, como é um projeto pessoal, não vejo problema nisso. E como o que eu preciso são coisas simples, talvez nem dê tanto trabalho assim...

Ainda estou pensando no que fazer. Talvez a melhor saída seja mesmo uma abordagem híbrida: continuar com o formato atual no blog e usar algo dinâmico (com servidor ou não) para o tracking de dados como filmes, músicas, livros e jogos.

Por enquanto, é só um pensamento, uma coceira na mente. Mas eu sou desenvolvedor, adoro problemas, desafios, pensar em como posso automatizar sem perder a simplicidade das soluções. Veremos o que sai disso.
