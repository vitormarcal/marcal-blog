---
title: Responda por email 2 📩
description: Um pouco sobre endereços de emails públicos
author: Vítor Marçal
created_at: 2024-09-20T22:54:00
updated_at: 
is_post: true
tags:
  - notas-pessoais
  - portugues
  - privacidade
related:
  - "[[tags/notas-pessoais]]"
  - "[[tags/portugues]]"
image: 
language: pt
---
Como podem notar, neste espaço, a única forma de comentário é me mandando um e-mail. Eu [expliquei aqui](responda-por-email) por que não mantenho um sistema de comentários acoplado ao site. Já faz um pouco mais de dois meses que mantenho meu endereço aqui, público, em texto plano. No começo, testei algumas formas de ofuscação de e-mail para que robôs varrendo a internet não colocassem meu e-mail em alguma lista de spam.

Cheguei a usar algo como `meu arroba dominio ponto com`, para que o leitor entendesse que meu e-mail era `meu@dominio.com`.

Depois, implementei truques de CSS para enganar certos tipos de robôs. Por exemplo:

No CSS:
```css
span.obfuscated_email b {  
  display: none;  
}
```

E no HTML:
```html
<a><span class="obfuscated_email">meu@email<b>.nottodayrobot</b>.com</span></a>
```

Dessa forma, um visitante humano veria corretamente o e-mail como `meu@email.com`, enquanto um robô que pegasse o texto dentro do link de e-mail veria algo como `meu@email.nottodayrobot.com`. Acho que isso engana muitos robôs, mas obviamente dá para burlar esse tipo de regra com um pouco de esforço. Essas e outras técnicas eu encontrei nesta publicação: [Email Obfuscation](https://spencermortensen.com/articles/email-obfuscation/), e caso esteja inacessível, [veja o snapshot da página no Internet Archive](https://web.archive.org/web/20240316214801/https://spencermortensen.com/articles/email-obfuscation/).

Depois de um tempo, eu desencanei disso. Além de registrar coisas interessantes que encontro por aí na vida, o site é uma forma de quem tiver interesse saber um pouco mais sobre mim. Uma forma controlada até, pois o que está aqui é exatamente o que eu quero que esteja público na internet.

Se pesquisarem meu nome, vão encontrar este site (a propósito, não antes de ver o link do outro Marçal no topo das buscas, mas, ao contrário dele, não tenho vocação para charlatanismos e nem empatia por picaretas, isso eu asseguro).

Então, pelo caráter público da coisa, criei um e-mail público, um que eu comento em lugares onde não me importo de ter meu nome atrelado, como em outros blogs. E tenho outro e-mail de caráter privado (na verdade, vários), com o propósito de diminuir o vazamento de rastreamento sobre minha pessoa (e-mails para bancos, lojas, listas de e-mail, etc.).

Por isso, acabei removendo a implementação de "ofuscação de e-mail" no meu site, já que os robôs estão cada vez mais inteligentes e eu não tenho tempo para ficar estudando como contra-atacar. Então, o e-mail que está aqui é público, e não tenho problema nenhum dele estar assim, exposto.

Fico feliz em dizer que, até agora, não senti um aumento de e-mails de spam na minha caixa de entrada. E se eu passar a receber tantos e-mails quanto recebo de ligações de telemarketing, simplesmente bloqueio o recebimento neste e-mail e crio outro e-mail público.

Por outro lado, sei que, assim como eu me preocupo com privacidade, muitas pessoas também têm essa preocupação e talvez deixem de me enviar um e-mail de resposta para não expor seu próprio e-mail. Bom, não tenho interesse nenhum no seu e-mail.

Não vou vendê-lo, nem cadastrá-lo em listas de produtos, nem lhe enviar spam ou tentar vender cursos ou produtos. Estou apenas interessado na conversa. **Blogs são conversas**, afinal. Mas você, obviamente, não precisa confiar na minha palavra — e nem deveria. Ora bolas, sou apenas um estranho na internet.

Dito isso, se você tem receio de entrar em contato com seu e-mail privado, crie um e-mail público, como eu! Existem inúmeras formas de fazer isso. Você pode comprar seu próprio domínio ou usar e-mails alias. Eu gosto e uso as duas formas.

E-mails alias são endereços de e-mail que atuam como intermediários entre seu e-mail privado e o mundo. São e-mails descartáveis.

Quando você se cadastra em um serviço, usa o e-mail alias no lugar do seu e-mail real. O alias recebe os e-mails e os encaminha para o seu e-mail privado, sem que o serviço conheça seu verdadeiro endereço.

Imagine que você pode ter um alias para a Shopee, outro para o Mercado Livre, outro para o AliExpress. Sabe quando você vai comprar algo em uma loja, como no shopping, e pedem um endereço de e-mail — pra quê, né? Que tal criar um e-mail alias? Depois você desativa e vida que segue.

Como sugestão, você pode conhecer o [DuckDuckGo Email Protection](https://duckduckgo.com/email/) e o [Addy.io](https://addy.io/). Que tal começar agora e criar seu próprio e-mail público ou alias? Garanto que é mais simples do que parece.
