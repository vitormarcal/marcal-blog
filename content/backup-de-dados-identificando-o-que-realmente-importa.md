---
title: "Backup de Dados: Identificando o que Realmente Importa 🔒"
description: 
author: Vítor Marçal
created_at: 2024-08-25T21:44:00
updated_at: 
is_post: true
tags:
  - homelab
  - notas-pessoais
  - tecnologia
  - portugues
related:
  - "[[tags/homelab]]"
  - "[[tags/notas-pessoais]]"
  - "[[tags/tecnologia]]"
  - "[[tags/portugues]]"
language: pt
---

Existem muitas possibilidades quando se trata de backup de dados. Eu pesquisei bastante, ou pelo menos, pesquisei até perder o interesse. Há algum tempo, desenvolvi uma forma de criar processos de backup para os meus dados mais importantes. Esta publicação mostra como eu defini e identifiquei o que realmente é importante para mim a ponto de precisar ser armazenado.

Primeiramente, é essencial saber o que é importante para você, e foi exatamente o que fiz. Levantei todos os dados que são valiosos para mim de alguma forma, desde os de maior importância até aqueles de menor relevância.

Que tipo de dado é tão importante para você que de forma alguma pode ser perdido? Para mim, são as fotos minhas e da minha família, registros de lembranças da minha infância, aniversários, amigos e parentes já falecidos. Documentos como contratos, comprovantes, escritos digitalizados, notas fiscais, recibos; todos esses também são muito importantes, alguns mais, outros menos. Esses são os tipos de documentos que me deixariam emocionalmente arrasado caso eu os perdesse, ou que poderiam me colocar em uma posição legal bastante inconveniente. Imagine a Receita Federal lhe cobrando um imposto indevido de quatro anos atrás que você poderia contestar graças a um recibo ou comprovante que já não possui mais.

Quando fiz o levantamento, identifiquei dados como:

- **Recordações:** Fotos e vídeos de memórias pessoais.
- **Documentos:** Pasta pessoal no servidor com arquivos em texto plano ou criptografados, registros de e-mails, documentos armazenados no Paperless, como comprovantes, notas fiscais, documentos relacionados ao imposto de renda, registros médicos, educacionais, etc.
- **Mídias:** Filmes, séries, animações, livros em diversos formatos, músicas, scans de quadrinhos e mangás.
- **Dados de serviços Docker:** São dados gerados ao instalar um serviço como Nextcloud, Paperless, Plex, que não são guardados em um banco de dados, mas sim em arquivos no diretório de volume do serviço.
- **Banco de dados de serviços:** No meu caso, normalmente são bases Postgres, mas aqui entram quaisquer outros bancos, como Mongo, MySQL, etc.
- **Arquivos gerais:** São arquivos que não se encaixam bem nas outras categorias, como binários de instalação de jogos ou programas, seja para Linux, Windows ou Android. Aqui eu também guardo meus repositórios Git, meus arquivos de save de jogos, esse tipo de coisa.

Esses são os dados que considero importantes para mim. Existem outros dados que, para mim, não são tão relevantes, como os dados do meu desktop principal. Se está lá e é importante, eu normalmente copio imediatamente para o meu servidor. Isso funciona bem para mim, mas houve um tempo em que eu fazia o backup automático das minhas pastas de Documentos, Imagens e algumas pastas de configurações da minha home diretamente para o meu servidor, em um script que rodava de hora em hora. Hoje, de acordo com meu fluxo de trabalho, isso se tornou desnecessário, mas entendo que pode voltar a ser necessário algum dia.

Dentre esses dados que identifiquei como importantes, diferenciei aqueles que são dados de "vida ou morte" e aqueles que não são. Os dados de "vida ou morte" são aqueles aos quais eu deveria ter acesso o mais rápido possível através dos meus backups, no mesmo dia ou instantaneamente.

Por exemplo, os dados do tipo "documentos" podem conter informações que me ajudariam a tomar uma decisão legal, como um comprovante ou um e-mail arquivado. Portanto, é sensato dizer que preciso desse tipo de dado o mais rápido possível.

Já os dados do tipo "recordação" são ainda muito importantes, alguns deles até mais importantes que alguns documentos, mas via de regra são arquivos que posso esperar uma semana ou mais para recuperar. Não imagino uma situação em que precisaria de uma foto imediatamente para comprovar algo; não vou perder dinheiro ou ser preso por não conseguir mostrar uma foto a tempo. E se essa foto ou vídeo for tão importante assim, ela também estará duplicada na minha pasta pessoal no servidor, categorizada como "documento".

Outro exemplo de dados que não são de "vida ou morte" são os dados de "mídia". São dados que, se eu precisasse acessar o backup, poderia tranquilamente esperar muito tempo até acessá-los. De fato, eu poderia até mesmo escolher ignorar o backup e baixar novamente um filme ou uma música. Mesmo que isso seja possível, escolhi fazer o backup desse tipo de arquivo porque investi bastante tempo procurando as fontes, e muitos nem estão mais disponíveis na internet.

Uma vez identificado o que é importante e o que não é, o que é de acesso urgente ("vida ou morte") e o que não é, posso definir ciclos de backup para cada tipo de arquivo. Por exemplo, posso decidir que, para arquivos do tipo "documentos", eu tenha um ciclo diário de backup, enquanto para arquivos do tipo "mídia", eu tenha um ciclo semanal ou até mensal. 

Existe uma estratégia de backup bastante consolidada chamada "3-2-1". Isso significa que:

- **3 Cópias dos Dados:** O dado original mais duas cópias para reduzir o risco de perda em caso de algo acontecer com alguma das versões.
- **2 Tipos Diferentes de Mídia:** Armazenadas em tipos diferentes de mídia, como uma cópia em um disco rígido externo e outra na nuvem, ou uma em um disco rígido e outra em DVDs Blu-ray. Assim, você pode se proteger de uma falha comum em um tipo de mídia, mas que não ocorre em outro.
- **1 Cópia Offsite:** Pelo menos uma cópia dos dados armazenada fora do local principal. Imagine sua casa sofrer um incêndio e suas 3 cópias estarem localizadas lá. Nesse caso, você perderia todos os seus dados.

Pensando nisso, minha estratégia é a seguinte:

1. **3 Cópias de dados:**
    - HD de Produção (a cópia original) com snapshots automáticos do ZFS.
    - HD de Backup (cópia 1).
    - Backup na nuvem (cópia 2).
2. **2 Tipos diferentes de Mídia:**
    - HDs internos (no mesmo computador).
    - Nuvem (armazenamento remoto).
3. **1 Cópia Offsite:**
    - Backup na nuvem (armazenamento fora do local físico).

Os snapshots ZFS adicionam uma camada extra de proteção ao HD com as cópias originais (o HD de produção), permitindo a recuperação de versões anteriores dos arquivos no caso de corrupção. Imagine que meu servidor seja alvo de um ataque e todos os arquivos sejam criptografados ou corrompidos. Sem perceber, meus backups acabam fazendo cópias do arquivo original corrompido. Nesse caso, posso simplesmente restaurar o snapshot ZFS adequado, sem precisar restaurar a partir de backups completos. Isso é bastante útil para uma recuperação rápida dos dados corrompidos ou acidentalmente modificados.

Para essa publicação não ficar muito extensa, em uma próxima vou entrar em detalhes sobre como tudo isso funciona, como os scripts são executados, agendados, etc. Acredito que essa reflexão inicial é muito importante para que se tenha noção do valor dos dados que se possui. Você pode se surpreender e perceber que, afinal, pode ter um dado tão importante quanto a "única foto da sua mãe em vida" e, mesmo assim, não estar dedicando nenhum esforço relevante para preservá-lo.

E para você, que tipo de dado é importante? Atualmente, tem algum plano B para o caso de seu computador queimar, ou de alguma Big Tech como o [Google deletar sua conta](https://g1.globo.com/tecnologia/noticia/2023/05/16/google-vai-excluir-contas-com-2-anos-ou-mais-sem-uso-veja-como-nao-perder-acesso.ghtml) sem avisar ou você perceber?

