---
title: Responda por email 📩
description: Uma forma simples e surpreendentemente eficaz de entrar na conversa
author: Vítor Marçal
created_at: 2024-07-08T19:31:00
updated_at: 
is_post: true
tags:
  - notas-pessoais
related:
  - "[[tags/notas-pessoais]]"
image: 
language: pt
---
----

Blogs são conversas. Para participar de uma, é necessário que algum visitante consiga entrar nessa conversa. Eu já havia implementado uma forma de comentários em meu blog, mas decidi alterá-la mais uma vez para algo mais simples e menos invasivo: respostas por email.

Da primeira vez que implementei um sistema de comentários, utilizei o [Disqus](https://disqus.com/). Não posso dizer que ele não funciona. É facilmente configurável, com várias opções de moderação, e sua adoção é quase universal. Existem dois problemas principais ao utilizar o Disqus, a meu ver:

1. Não é uma ferramenta que respeita a privacidade dos dados. Pelo contrário, você será facilmente rastreado e categorizado.
2. Você não é o dono do seu conteúdo. Se a ferramenta deixar de existir ou você não estiver satisfeito com ela, não é fácil mover seus dados para outro provedor similar ao Disqus. Para falar a verdade, nem sei se é possível.

Ciente dessas limitações, busquei outra forma que possibilitasse receber comentários. Acabei encontrando uma boa alternativa em [Sistemas de comentários livres](https://sol2070.in/2022/10/Sistemas-de-coment%C3%A1rios-livres) no blog da [sol2070](https://sol2070.in/): o projeto [Isso Comments](https://github.com/isso-comments/isso/). Ele é uma alternativa similar ao Disqus, mas auto-hospedada. O Isso Comments funciona bem e tem funcionalidades como moderação, anti-spam, notificação por e-mail, etc. Do lado do servidor, apenas precisei de uma imagem Docker e um arquivo de configuração para o Isso. Ele armazena as informações em um banco de dados SQLite.

Contudo, comecei a achar que, mesmo na simplicidade da ferramenta Isso, ainda era uma bala de canhão para o que eu queria resolver. Eu não tenho um tráfego alto, _longe disso_. Meu site já é totalmente estático, renderizado no momento da compilação, portanto, não preciso de um backend como o Node para servi-lo na internet. Manter um backend apenas para gerenciar os poucos e raros comentários que recebo me pareceu um exagero.

Percebi que vários blogs preferiam respostas por e-mail em vez do esquema comum de threads de respostas públicas. Boas razões foram apresentadas, como as de Manuel Morale em [Online Conversations](https://manuelmoreale.com/online-conversations), que argumenta que responder por e-mail nos permite uma área segura onde podemos sumarizar e revisar nossas ideias de forma livre, longe dos limites impostos pelas redes sociais.

Kev Quirk, em [Online Conversations & Website Engagement](https://kevquirk.com/blog/online-conversations-website-engagement), diz que, apesar de ter perdido alguns comentários úteis, visto que algumas pessoas são menos propensas a escrever um e-mail, essa barreira foi justamente o que o livrou de comentários de trolls desejando-lhe a morte. Aqueles que entram em contato estão genuinamente interessados no assunto da publicação e só querem discutir isso mais a fundo.

Cris Coyer, em seu blog [Email is Good](https://email-is-good.com/), acerta o alvo em sua publicação [Text Me, Yo](https://email-is-good.com/2023/07/10/text-me-yo/). Assim como ele, eu prefiro o e-mail para discussões mais lentas ou que exigem que eu pense e pesquise. Não gosto da ideia de uma notificação como no Instagram ou Facebook, onde as discussões são sempre quentes, o que nos condiciona a responder rápida e emocionalmente de formas muitas vezes impensadas a outras publicações e comentários.

Nik, do [Nick With Q](https://niqwithq.com), também compartilha dessa opinião. Em [Reply by email](https://niqwithq.com/posts/reply-by-email), ele argumenta que, com e-mails, não há pressão para responder imediatamente, o que faz com que sejam escritos com uma mentalidade mais ponderada. Outro ponto interessante é que e-mails são auto-contidos. Sabe quando alguém lhe manda uma mensagem no WhatsApp do tipo "Oi, tudo bem?", sem mais nada? E-mails tendem a ter uma estrutura bem definida, como uma saudação, conteúdo principal e fechamento.

Outro ponto que Nik destaca é que o e-mail é universal. Usuários do Gmail podem se comunicar com usuários do Protonmail, pois o protocolo utilizado permite a interoperabilidade: o protocolo SMTP. Até hoje, é impossível alguém do WhatsApp se comunicar com um usuário do Telegram, por exemplo.

Esses são todos ótimos argumentos e pontos de vista, e concordo com todos eles. No meu caso, adicionei essa funcionalidade e removi os sistemas anteriores por simplificação tecnológica. Em outras palavras: **preguiça**.

Veja bem, como eu disse, meu site já é estático. Eu não quero lidar com um backend para algo tão simples como um blog. Inserir um backend de comentários me obriga a me preocupar com atualização de software, consumo de recursos computacionais, vulnerabilidades e ataques. Definitivamente, eu não quero esse trabalho.

Por outro lado, eu realmente gosto de e-mails e estou bem mais preparado para armazená-los! Já tenho uma política de backup de e-mails, de modo que qualquer comentário que eu receba estará instantaneamente seguro e pesquisável como registro histórico pessoal. Da mesma forma, quem me enviar um comentário terá a cópia desse e-mail em sua própria caixa de saída e na de entrada, quando eu responder. De fato, muitos que poderiam comentar deixarão de fazê-lo apenas por se tratar de um e-mail, mas no final, acho que o ganho é muito maior. É o melhor para ambos os lados da comunicação.

Então, está aí, logo abaixo, uma forma simples e surpreendentemente eficaz de entrar na conversa. Está convenientemente em todas as publicações do meu blog.

Faça bom uso!