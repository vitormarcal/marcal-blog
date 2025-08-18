---
title: Meu Túnel do Tempo Musical
description: Registrando o que ouço com o Media Pulse
author: Vítor Marçal
created_at: 2025-08-17T22:04:00
updated_at: 
is_post: true
tags:
  - musica
  - notas-pessoais
  - programacao
related:
  - quero-saber-o-que-estou-vendo-ouvindo-e-lendo-sem-depender-de-ninguem
  - musicas
language: pt
localized_post_paths: 
has_localized_posts: false
---

Eu já tinha escrito um pouco sobre o desejo de registrar o que ouço, assisto e leio, na publicação [Quero saber o que estou vendo, ouvindo e lendo (sem depender de ninguém)](quero-saber-o-que-estou-vendo-ouvindo-e-lendo-sem-depender-de-ninguem),e sobre a vontade de ter isso em um sistema que chamei de **Media Pulse**. Pois bem, finalmente acho que já tenho algo a mais: uma página que representará meu [🎶 Túnel do Tempo Musical](musicas).

Por enquanto, ele é extremamente básico, apenas em formato de grid, mostrando o que ouvi na última hora, no último dia, semana, mês, ano e década. Tudo dinâmico, capturado pelo meu **Media Pulse**.

Ainda há muito o que fazer. É preciso dar personalidade à página, adicionar imagens dos discos e encontrar uma forma mais interessante de mostrar minhas últimas tendências musicais. Além disso, quero capturar dados do Spotify e do Google Music, embora nem saiba se isso é possível neste último. Isso é trabalho para semanas, afinal é um projeto de tempo livre.

Mas já estou bastante satisfeito com esse início. Provavelmente vou deixar um pouco a funcionalidade de música de lado e iniciar a funcionalidade de séries e filmes, que, como pode imaginar, registrará o que estou assistindo. Estou bastante empolgado.

Sobre o **Media Pulse**, ele ainda está em beta. Falta muito para eu ter uma versão 1.0 estável que eu possa realmente recomendar. Para ter uma ideia, já refiz a modelagem do banco algumas vezes. Mas algo que me previni desde o começo é que todo evento que recebo é gravado primeiro antes de ser processado. Dessa forma, posso sempre reprocessar os eventos, não importa o quanto eu mude a estrutura das tabelas.

Outra coisa que quero fazer é pré-gravar o resultado da API em arquivos JSON, apenas para reduzir chamadas à base de dados.

É bastante trabalho, mas é divertido. Já comentei os motivos para fazer isso, mas honestamente o maior é simplesmente porque é desafiador e muito legal ver que é **algo possível**, mesmo que não seja trivial.

Caso queira conferir, a página fica em [/musicas](musicas), também listada na minha página legalzinha chamada [/slashes](slashes).