---
title: Como configurar conexão vpn do ubuntu para Check Point
description: Aqui explico de forma objetiva como conectar ao VPN Checkpoint no ubuntu. Com poucas mudanças, serve para outras distribuições também.
author: Vítor Marçal
created_at: 2020-08-19T00:00:00
updated_at: 
is_post: true
tags:
  - tecnologia
  - portugues
related:
  - "[[tags/tecnologia]]"
  - "[[tags/portugues]]"
language: pt
---

Para configurar siga esses passos:

Instale primeiro os pré-requisitos de acordo com o comando abaixo, [ou conforme esta página](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk65210):

Caso a arquitetura do seu sistema seja 32x:

```shell
sudo apt-get install libpam0g:i386 libx11-6:i386 libstdc++6:i386 libstdc++5:i386
```
 
 Caso a arquitetura do seu sistema seja 64x:

```shell
sudo apt install libpam0g:i386 libx11-6:i386 libstdc++6:i386 libstdc++5:i386 libnss3-tools
```

Baixe o script de instalação do [snx aqui](https://supportcenter.checkpoint.com/supportcenter/portal/user/anon/page/default.psml/media-type/html?action=portlets.DCFileAction&eventSubmit_doGetdcdetails=&fileid=22824 "Página de download do SNX").

Dê permissão de execução ao script baixado. Verifique o nome do script baixado no comando e troque, se necessário:

```shell
sudo chmod + x snx snx_install_linux30.sh

```

  Instale o snx. Verifique o nome do script baixado no comando e troque, se necessário:
  
```shell
sudo ./snx_install_linux30.sh

```

 Conecte-se com o comando:
 
```shell
snx -s sua.vpn.aqui.com.br -u seu_usuario_aqui

```
 
Desconecte-se da vpn com o comando:  

```shell
snx -d

```
