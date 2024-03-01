---
title: Como configurar um node bitcoin
description: Aqui estão documentados os procedimentos ao instalar e executar meu próprio nó Bitcoin.
author: Vítor Marçal
created_at: 2024-02-15T14:53:13.000Z
updated_at: 2024-02-20
is_post: true
tags:
  - bitcoin
---

![Como configurar um node bitcoin](img/bitcoin-node.jpg)

## Sumário

## Por que rodar um nó?

Existem diversos motivos para executar um nó Bitcoin, como a independência, já que você não depende de outros serviços para verificar informações na blockchain. Além disso, há a questão da privacidade, uma vez que ao usar serviços de terceiros, você pode ser rastreado, pois eles podem armazenar seu endereço IP e as transações que você consultou, podendo até mesmo compartilhar esses dados com governos ou outros terceiros. Outro motivo importante é contribuir para a rede Bitcoin, já que seu nó auxiliará na verificação de blocos.
Se preferir, achei [esse vídeo prático em inglês](https://youtu.be/fx_mLXISrfM?si=AE-1M1H8ssRXcKDt)[^1]. Você pode obter informações "do zero" sobre o Bitcoin a partir do [Guia Bitcoin](https://www.marcal.dev/guia-bitcoin/)[^2], o qual foi criado com base nas minhas anotações também. Não confie cegamente; verifique! ⚠️
Inicialmente, é necessário baixar e instalar o Bitcoin Core e, em seguida, baixar toda a blockchain desde o início. Os passos necessários estão documentados no próprio [site oficial](https://bitcoin.org/en/full-node)[^3].


## Instalação e configuração

Você pode instalá-lo em seu computador, desde que tenha armazenamento e recursos suficientes. Para executar um nó completo, com toda a blockchain, em 15 de fevereiro de 2024, são necessários aproximadamente 600GB. Caso não queira rodar um nó completo, ainda será preciso baixar toda a blockchain, mas depois é possível podar, reduzindo o armazenamento para cerca de 8GB.

Para conferir o hardware que escolhi para rodar o nó, você pode visitar este [link, onde detalho as configurações do meu servidor](https://www.marcal.dev/meu-segundo-homelab-montado/)[^4].

### Comandos básicos

Após baixar e instalar o Bitcoin Core, você terá acesso aos programas bitcoind, bitcoin-qt e bitcoin-cli. Para obter mais informações, você pode visitar a [página do desenvolvedor do Bitcoin](https://developer.bitcoin.org/examples/intro.html)[^5]. Para iniciar o Bitcoin Core, utilize o comando:

```shell
bitcoin -daemon

```


Dessa forma, ele identificará e verificará os blocos, iniciando o download dos blocos faltantes, o que resultará no download completo da blockchain do zero. Com as configurações do meu servidor, esse processo levou 3 dias. Você pode acompanhar o progresso com o seguinte comando:

```shell
tail -f ~/.bitcoin/debug.log 

```


É possível verificar as informações da blockchain com o comando:

```shell
bitcoin-cli getblockchaininfo

```


Para verificar as carteiras:

```shell
bitcoin-cli getwalletinfo

```


Para interromper o processo de forma segura:

```shell
bitcoin-cli stop

```

### Definindo o diretório de configurações do nó

Normalmente, o diretório `.bitcoin` é inicializado na pasta home do usuário que está executando o comando. Optei por definir outro local para a pasta do Bitcoin:

```shell
bitcoind -daemon -datadir=/outro/diretorio/qualquer/.bitcoin

```


O problema é que, dessa forma, é preciso sempre lembrar de fornecer o diretório nos comandos. E caso o arquivo _[bitcoin.conf](https://github.com/bitcoin/bitcoin/blob/master/doc/bitcoin-conf.md)_[^6] não esteja no diretório padrão (a pasta home), é necessário especificar a localização dele em outros comandos também. Portanto, resolvi criar um link simbólico do arquivo bitcoin.conf existente no diretório _/outro/diretorio/qualquer/general/.bitcoin_ dentro do diretório padrão do Bitcoin.

```shell
ln -s /outro/diretorio/qualquer/.bitcoin/bitcoin.conf .bitcoin/bitcoin.conf

```


Em seguida, editei o arquivo _bitcoin.conf_ para informar o diretório real. O arquivo bitcoin.conf ficou da seguinte forma:

```shell
datadir=/outro/diretorio/qualquer/.bitcoin

```


Dessa forma, para iniciar o Bitcoin Core, só preciso executar o comando simples sem parâmetros novamente:

```shell
bitcoin -daemon

```


É possível definir caminhos diferentes para sua carteira, blocos, etc. Optei por concentrar tudo nesse diretório, então deletei todos os arquivos dentro da pasta .bitcoin na home, exceto o link simbólico bitcoin.conf.

**⚠️ Tenha cuidado! ⚠️ Não deve ser um problema deletar esses arquivos se você acabou de realizar uma instalação limpa. No entanto, se já baixou a blockchain, criou carteiras, tome cuidado e faça sempre backup!⚠️**

### Evitando execuções remotas não autorizadas

É recomendável colocar uma senha para evitar execuções remotas não autorizadas. Para isso, baixei o rpcauth.py do código-fonte do [Bitcoin](https://github.com/bitcoin/bitcoin)[^7]:

```shell
wget https://raw.githubusercontent.com/bitcoin/bitcoin/master/share/rpcauth/rpcauth.py
chmod +x rpcauth.py
./rpcauth.py um_usuario_qualquer sua-senha-super-forte

```


No código acima, é baixado do repositório o rpcauth, é concedida permissão de execução ao script e, finalmente, é executado passando um usuário e uma senha, onde o usuário é _um\_usuario\_qualquer_ e a senha é _sua-senha-super-forte_; substitua com suas informações. O resultado será algo do tipo:

```shell
~$ ./rpcauth.py um_usuario_qualquer sua-senha-super-forte
String to be appended to bitcoin.conf:
rpcauth=um_usuario_qualquer:88d3ab05478ebca31b4aa61775949cd8$3035beb6aba42014ec7c490ba94128971089c037e463703c3d88e63192c72b77
Your password:
sua-senha-super-forte

```


⚠️ **Não compartilhe essas informações!** ⚠️

Após gerado, pegue o valor em rpcauth e salve no arquivo bitcoin.conf. Ele ficará assim, observe os IPs dos dispositivos que eu autorizo as chamadas:

```shell
~$ cat .bitcoin/bitcoin.conf 
datadir=/outro/diretorio/qualquer/.bitcoin
server=1
txindex=1
daemon=1
rpcport=8332
rpcbind=0.0.0.0
rpcallowip=127.0.0.1
rpcallowip=10.0.0.0/8
rpcallowip=172.0.0.0/8
rpcallowip=192.0.0.0/8
zmqpubrawblock=tcp://0.0.0.0:28332
zmqpubrawtx=tcp://0.0.0.0:28333
zmqpubhashblock=tcp://0.0.0.0:28334
whitelist=127.0.0.1
rpcauth=um_usuario_qualquer:88d3ab05478ebca31b4aa61775949cd8$3035beb6aba42014ec7c490ba94128971089c037e463703c3d88e63192c72b77

```

#### Análise das configurações

Aqui está uma análise das configurações:

**Geral:**

*   **datadir=/outro/diretorio/qualquer/.bitcoin:** Define o diretório de dados do Bitcoin para um local diferente do padrão.
*   **server=1:** Habilita o modo servidor, permitindo que outros nós se conectem para obter dados da blockchain.
*   **daemon=1:** Executa o Bitcoin em segundo plano como um daemon (serviço do sistema operacional).
*   **whitelist=127.0.0.1:** Apenas permite conexões locais (loopback) para interfaces RPC sensíveis.

**Interfaces RPC (Remote Procedure Call):**

*   **rpcport=8332:** Define a porta utilizada para comunicação remota com o nó Bitcoin.
*   **rpcbind=0.0.0.0:** Aceita conexões RPC em todas as interfaces de rede (pode ser um risco de segurança).
*   **rpcallowip=127.0.0.1:** Permite conexões RPC apenas do loopback local.
*   **rpcallowip=10.0.0.0/8, 172.0.0.0/8, 192.0.0.0/8:** Permitindo conexões RPC de redes privadas comuns.
*   **rpcauth=um\_usuario\_qualquer:88d3ab05478ebca31b4aa61775949cd8$3035beb6aba42014ec7c490ba94128971089c037e463703c3d88e63192c72b77:** Usa autenticação básica com um par usuário/senha para acesso RPC (não recomendado para exposição pública).

**Publicações ZeroMQ:**

*   **zmqpubrawblock=tcp://0.0.0.0:28332:** Habilita a publicação de blocos brutos através do ZeroMQ na porta especificada.
*   **zmqpubrawtx=tcp://0.0.0.0:28333:** Habilita a publicação de transações brutas através do ZeroMQ na porta especificada.
*   **zmqpubhashblock=tcp://0.0.0.0:28334:** Habilita a publicação de hashes de blocos através do ZeroMQ na porta especificada.

Existe uma relação entre as configurações `rpcbind` e `rpcallowip` no arquivo `bitcoin.conf`:

*   `rpcbind` determina em qual interface o daemon escuta por conexões RPC.
*   `rpcallowip` determina quais endereços IP podem se conectar ao daemon.

**Exemplo:**

*   Se `rpcbind` estiver definido como `0.0.0.0` (escuta em todas as interfaces) e `rpcallowip` estiver definido como `127.0.0.1` (permitir apenas loopback), o daemon só permitirá conexões RPC do loopback local.

### Criando um daemon service

Vá novamente ao repositório do Bitcoin no GitHub e procure pelo arquivo bitcoind.service. É necessário baixá-lo na pasta `/etc/systemd/system/`:

```shell
cd /etc/systemd/system/
wget https://raw.githubusercontent.com/bitcoin/bitcoin/master/contrib/init/bitcoind.service


```


Nesse arquivo, alterei algumas configurações que podem ou não fazer sentido, dependendo de cada um.

Aqui, acrescentei `-daemon` e removi `conf` e `datadir`:

```shell
[Service]
ExecStart=/usr/local/bin/bitcoind -daemon \
                            -pid=/run/bitcoind/bitcoind.pid \
                            -startupnotify='systemd-notify --ready' \
                            -shutdownnotify='systemd-notify --stopping'

```


Modifiquei as linhas `User=bitcoin` e `Group=bitcoin` para refletir o usuário e grupo correto que irá executar o bitcoind. Comentei `#ExecStartPre=/bin/chgrp bitcoin /etc/bitcoin` e `#ProtectHome=true`.

Por fim, habilitei, iniciei e verifiquei o status do serviço:

```shell
sudo systemctl enable bitcoind
sudo systemctl start bitcoind
sudo systemctl status bitcoind

```


Dessa forma, sempre que realizar um novo boot, o bitcoind iniciará automaticamente.
Mais Informações sobre configurações de serviço para bitcoind [aqui](https://github.com/bitcoin/bitcoin/blob/master/doc/init.md)[^8].

### ⚠️Tor⚠️

Utilizar o Tor é importante para evitar que seu IP seja vazado, proporcionando uma melhoria em sua privacidade quando configurado corretamente.

Instalo o Tor e, em seguida, verifico se o serviço está em execução:

```shell
sudo apt install tor
sudo systemctl status tor

```


Depois, edito o arquivo em `/etc/tor/torrc`, acrescentando estas linhas no final do arquivo:

```shell
ControlPort 9051 
CookieAuthentication 1
CookieAuthFileGroupReadable 1

```


Veja o que cada um significa:

*   `ControlPort`: Define a porta para comandos de controle do Tor.
*   `CookieAuthentication`: Habilita a autenticação por cookie para o serviço de controle.
*   `CookieAuthFileGroupReadable`: Define se o arquivo de cookie de autenticação pode ser lido por todos os membros do grupo do usuário.

Depois disso, é necessário reiniciar o serviço:

```shell
sudo systemctl restart tor

```


E então, é necessário adicionar o seu usuário ao grupo:

```shell
sudo usermod -a -G debian-tor seu-user-aqui

```


No arquivo `bitcoin.conf`, foram adicionadas as seguintes linhas para que o bitcoind rode utilizando a rede do Tor:

```shell
proxy=127.0.0.1:9051
listen=1
bind=127.0.0.1
onlynet=onion

```


Após reiniciar o computador, para confirmar que está utilizando a rede Tor, execute o comando `bitcoin-cli getnetworkinfo` e verifique se em `networks`, tanto _IPv4_ quanto _IPv6_, estão com o valor `"reachable": false,` e que em `localaddresses` há um _onion address_.

## Atualizando o node

Para fazer o upgrade de versão do bitcoind, pode seguir os mesmos passos da instalação inicial. O binário pode estar mais atualizado, com alguma versão experimental, disponível no [site do Bitcoin Core](https://bitcoincore.org/en/download/)[^9].

---

[^1]: Vídeo mão na massa instalando e rodando um node: [https://youtu.be/fx\_mLXISrfM?si=AE-1M1H8ssRXcKDt](https://youtu.be/fx_mLXISrfM?si=AE-1M1H8ssRXcKDt)

[^2]:  Guia Bitcoin: [https://www.marcal.dev/guia-bitcoin/](https://www.marcal.dev/guia-bitcoin/)

[^3]:  Sobre full nodes: [https://bitcoin.org/en/full-node](https://bitcoin.org/en/full-node)

[^4]: O hardware onde roda meu node: [https://www.marcal.dev/meu-segundo-homelab-montado/](https://www.marcal.dev/meu-segundo-homelab-montado/)

[^5]:  Documentação para pessoas técnicas: [https://developer.bitcoin.org/examples/intro.html](https://developer.bitcoin.org/examples/intro.html)

[^6]:  Sobre o arquivo bitcoin.conf [https://github.com/bitcoin/bitcoin/blob/master/doc/bitcoin-conf.md](https://github.com/bitcoin/bitcoin/blob/master/doc/bitcoin-conf.md)

[^7]:Repósitorio oficial do Bitcoin no Github: [https://github.com/bitcoin/bitcoin](https://github.com/bitcoin/bitcoin)

[^8]:  Informações sobre configurações de serviço para bitcoind [https://github.com/bitcoin/bitcoin/blob/master/doc/init.md](https://github.com/bitcoin/bitcoin/blob/master/doc/init.md)

[^9]:  Bitcoin Core: [https://bitcoincore.org/en/download/](https://bitcoincore.org/en/download/)