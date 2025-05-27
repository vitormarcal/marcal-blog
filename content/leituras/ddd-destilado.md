---
title: Domain-Driven Design Destilado
description: nunca seremos capazes de antecipar todas as necessidades futuras de uma só vez
author: Vítor Marçal
created_at: 2025-05-26T21:09:00
is_post: true
tags:
  - livros
  - portugues
  - programacao
related:
  - "[[tags/portugues]]"
  - "[[leituras-de-2025]]"
  - "[[tags/programacao]]"
image: /img/ddd-destilado.jpg
language: pt
feedback:
  - gostei
book_author:
  - Vaughn Vernon
volume: 
series: 
favorite: 
format:
  - físico
date_read: 2025-05-26T12:00:00
is_book: true
quote: nunca seremos capazes de antecipar todas as necessidades futuras de uma só vez
page_number: 160
publisher:
  - Alta Books
publication_year: 2024
isbn: 978-8550821245
reading_status:
  - completed
genre:
  - educação
  - programação
  - engenharia de software
dominant_color: "#2c9540"
---

![Domain-Driven Design Destilado](/img/ddd-destilado.jpg)


Esse é um resumo, um trabalho bem sucinto. Como o título diz, é um trabalho _destilado_, para quem não tem pressa e é muito bom!

Eu já havia lido _Implementando DDD_, do mesmo autor, o livro da capa vermelha. Aquele é bem denso, detalhista e muito bom também; pretendo reler, inclusive. Mas eu deveria ter começado por este. Vernon destilou muito bem, em 160 páginas, muitos conceitos importantes do DDD, trazendo informações essenciais para quem não sabe nada sobre o assunto e ajudando a se situar com clareza.

Existem muitos motivos para se utilizar DDD. Ele pode facilmente ajudar equipes a evitarem problemas que vão desde níveis comerciais até técnicos:

* Desenvolvimento de software sendo considerado centro de custo, vistos como incômodos necessários, em vez de fontes de vantagem estratégica.
- Desenvolvedores muito focados em tecnologia, em vez de design e pensamento detalhado, perseguindo constantemente novos "objetos brilhantes", ou seja, os modismos tecnológicos mais recentes.
- A maioria das discussões sobre soluções gira em torno do banco de dados, em vez dos processos e operações de negócio.
- Desenvolvedores não dão a devida ênfase à nomeação de objetos e operações de acordo com o propósito do negócio, o que leva a um grande abismo entre o modelo mental do negócio e o software entregue.
- O problema anterior geralmente é resultado da má colaboração com o negócio. As partes interessadas também gastam muito tempo trabalhando isoladamente, produzindo especificações que ninguém utiliza.
- Lógicas de negócio nos componentes de interface do usuário e operações de persistência misturadas no meio da lógica de negócio.
- Consultas quebradas, lentas e bloqueantes no banco de dados.
- Abstrações erradas, que tentam atender todas as necessidades atuais e futuras imaginadas, generalizando excessivamente as soluções em vez de atender às reais necessidades do negócio.
- Serviços fortemente acoplados, resultando em processos de negócio quebrados, dados não reconciliados e sistemas difíceis de manter.

Depois de ler, você estará familiarizado com termos importantes do DDD, como **Contexto Delimitado**, que é um limite contextual semântico onde, dentro de certos limites, cada componente do modelo de software tem um significado específico e realiza funções específicas. Os componentes dentro de um Contexto Delimitado são próprios daquele contexto e semanticamente motivados.

O Contexto Delimitado é o local onde um modelo é implementado, e você terá artefatos de software separados para cada contexto. Um Contexto Delimitado, quando desenvolvido como uma iniciativa estratégica chave da organização, é chamado de **Domínio Central**. Esse Domínio Central é desenvolvido para diferenciar sua organização competitivamente das demais, já que nenhuma organização consegue se destacar em tudo.

O modelo de software dentro dos limites do contexto reflete uma linguagem criada pela equipe que trabalha naquele Contexto Delimitado. Essa linguagem é falada por todos os membros da equipe e implementada no modelo de software, ela é chamada de **Linguagem Ubíqua**, porque é compartilhada pela equipe e refletida diretamente no código. Por isso, precisa ser rigorosa, precisa, exata e estrita, conforme as palavras do autor.

Nesse sentido, o livro alerta que **nunca seremos capazes de antecipar todas as necessidades futuras de uma só vez**. Portanto, ele recomenda que não caiamos na armadilha de uma implementação altamente abstrata e sedutora.

Há muito o que se falar sobre DDD. E esse livro, novamente, é um _destilado_. Mas a principal dica que fica é: **design é inevitável**. Você terá um desempenho ruim como resultado de um design ruim, ou poderá alcançar sucesso com um design eficaz  e, quem sabe, até um bom design. O DDD nos possibilita atender às demandas do tempo de forma direta e projetar de maneira acelerada, usando abordagens que ajudam a entregar o melhor design possível dentro das restrições de tempo que enfrentamos.

Para mais detalhes, só lendo o livro da capa vermelha. Mas este é um ótimo começo para qualquer um!