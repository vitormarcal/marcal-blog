---
title: Craftsmanship Limpo - Disciplinas, Padrões e Ética
description: Você não reserva tempo para refatoração. Você não perde permissão para refatorar. Você refatora sempre o tempo todo.
author: Vítor Marçal
created_at: 2025-05-26T20:22:00
is_post: true
tags:
  - livros
  - portugues
  - programacao
related:
  - "[[tags/portugues]]"
  - "[[leituras-de-2025]]"
  - "[[tags/programacao]]"
image: /img/craftsmanship-limpo.jpg
language: pt
feedback:
  - gostei
book_author:
  - Robert C. Martin
volume: 
series: 
favorite: 
format:
  - físico
date_read: 2025-05-26T12:00:00
is_book: true
quote: Você não reserva tempo para refatoração. Você não perde permissão para refatorar. Você refatora sempre o tempo todo.
page_number: 416
publisher:
  - Alta Books
  - Artmed
publication_year: 2023
isbn: 978-6555209549
reading_status:
  - completed
genre:
  - educação
  - programação
  - engenharia de software
dominant_color: "#213558"
---

![Craftsmanship Limpo - Disciplinas, Padrões e Ética](/img/craftsmanship-limpo.jpg)

Um bom livro. Tem a proposta de apresentar os princípios que definem a profissão de desenvolvimento de software. Em certo ponto, ele se torna mais um livro sobre TDD do que sobre outros temas, mas ainda assim traz provocações valiosas.

O TDD é uma disciplina que tem os seguintes objetivos:

- Criar uma suíte de testes que permita a refatoração e seja confiável, de modo que, se a suíte for aprovada, o sistema possa ser implementado.
- Desenvolver um código de produção que seja suficientemente desacoplado para que possa ser testado e refatorado.
- Criar um ciclo de feedback extremamente curto.
- Criar testes e códigos de produção que sejam suficientemente desacoplados entre si, permitindo a manutenção funcional de ambos.

Dessa forma, é importante não escrever nenhum código de produção antes de elaborar um teste que falhe devido à ausência desse código. Também é importante não escrever mais testes do que o necessário para identificar a falha. Quando o teste falhar, não se deve escrever mais código de produção do que o suficiente para corrigir aquela falha específica. Juntas, essas afirmativas compõem as três regras do TDD e elas envolvem um ciclo de apenas alguns segundos!

Diante disso, o livro traz uma provocação interessante: "Não é muito legal ser fera em debugar", já que essa, segundo Martin, não é uma habilidade desejável! Nessa lógica, ele defende que devemos gastar o máximo de tempo possível escrevendo código que funcione , em vez de perder tempo depurando e tentando entender como o código está funcionando. É aí que os ciclos curtos e o feedback constante do TDD ajudam.

Os ciclos são divididos em três etapas: (1) vermelho, (2) verde e (3) refatorar. Nesse "semáforo", primeiro você escreve um teste que falha (1), depois escreve o código de produção que faz o teste passar (2), e então refatora (3). A refatoração nunca muda o comportamento do código. Ela também nunca aparece em cronogramas ou planejamentos.

> Você não reserva tempo para refatoração. Você não perde permissão para refatorar. Você refatora sempre, o tempo todo.


Acho que metade do livro fala sobre TDD; a outra metade aborda diversos assuntos, inclusive ética. Certa feita, Martin fala sobre a importância de dizer “não” quando a resposta for realmente não. Isso é fundamental e, nesses anos todos, já vi muitas situações em que dizer "não" na hora certa poderia ter economizado dinheiro e evitado constrangimentos. Martin argumenta que somos engenheiros, e nossa tarefa é encontrar uma forma de dizer "sim", mas, às vezes, o "sim" não é uma opção. Se a resposta for "não", **"agarre-se com unhas e dentes a essa resposta e não ceda à pressão."**

Como disse, é um livro carregado de TDD. Diria até que Martin queria escrever mais sobre TDD e acabou incluindo bastante conteúdo no texto. Mesmo assim, é um livro valioso. Recomendo!
