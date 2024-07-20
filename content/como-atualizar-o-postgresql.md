---
title: Como atualizar o PostgreSQL
description: Atualize o PostgreSQL em Debian, Ubuntu e derivados
author: Vítor Marçal
created_at: 2024-04-24T22:00:00
updated_at: 
is_post: true
tags:
  - tecnologia
related:
  - "[[tags/tecnologia]]"
---
----

Esse guia mostra os passos para atualizar a versão 15 para 16 no Ubuntu (ou Debian e derivados) mas eventualmente, deverá funcionar ao fazer a atualização do 16 para 17 (quando essa sair).

Esse guia foi baseado na versão em Inglês [deste outro guia](https://www.kostolansky.sk/posts/upgrading-to-postgresql-15/) que ensina o upgrade da versão 14 para a 15. Caso a página esteja indisponivel, veja pelo [snapshot do guia no Internet Archive](https://web.archive.org/web/20231128145207/https://www.kostolansky.sk/posts/upgrading-to-postgresql-15/).

Instale a nova versão, no exemplo é a versão 16 do PostgreSQL:

```shell
sudo apt-get update
sudo apt-get install postgresql-16 postgresql-server-dev-16
```
 
Verifique se há alguma diferença entre os arquivos de configuração:

```shell
diff /etc/postgresql/15/main/postgresql.conf /etc/postgresql/16/main/postgresql.conf
diff /etc/postgresql/15/main/pg_hba.conf /etc/postgresql/16/main/pg_hba.conf
```

Pare o serviço PostgreSQL:

```shell
sudo systemctl stop postgresql.service
```

Conecte-se com o usuário **postgres**:

```shell
sudo su - postgres
```

Verifique os clusters (observe o argumento *--check*, isso não alterará nenhum dado):

```shell
/usr/lib/postgresql/16/bin/pg_upgrade \
  --old-datadir=/var/lib/postgresql/15/main \
  --new-datadir=/var/lib/postgresql/16/main \
  --old-bindir=/usr/lib/postgresql/15/bin \
  --new-bindir=/usr/lib/postgresql/16/bin \
  --old-options '-c config_file=/etc/postgresql/15/main/postgresql.conf' \
  --new-options '-c config_file=/etc/postgresql/16/main/postgresql.conf' \
  --check
```

Migre os dados (sem o argumento *--check*):

```shell
/usr/lib/postgresql/16/bin/pg_upgrade \
  --old-datadir=/var/lib/postgresql/15/main \
  --new-datadir=/var/lib/postgresql/16/main \
  --old-bindir=/usr/lib/postgresql/15/bin \
  --new-bindir=/usr/lib/postgresql/16/bin \
  --old-options '-c config_file=/etc/postgresql/15/main/postgresql.conf' \
  --new-options '-c config_file=/etc/postgresql/16/main/postgresql.conf'
```

Desconecte-se do usuário **postgres**:

```shell
exit
```

Troque as portas pelas versões antiga e nova do PostgreSQL:

```shell
sudo vim /etc/postgresql/16/main/postgresql.conf
# ...e mude "port = 5433" para "port = 5432"

sudo vim /etc/postgresql/15/main/postgresql.conf
# ...e mude "port = 5432" para "port = 5433"
```

Inicie o serviço PostgreSQL:

```shell
sudo systemctl start postgresql.service
```

Faça login como usuário **postgres** novamente:

```shell
sudo su - postgres
```

Verifique a nova versão do PostgreSQL: 

```shell
psql -c "SELECT version();"
```

Execute o comando **vacuumdb**:

```shell
/usr/lib/postgresql/16/bin/vacuumdb --all --analyze-in-stages
```

Desconecte-se novamente do usuário **postgres**:

```shell
exit
```

Verifique quais pacotes antigos do PostgreSQL estão instalados:

```shell
apt list --installed | grep postgresql
```

Remova os pacotes antigos do PostgreSQL (da listagem acima):

```shell
sudo apt-get remove postgresql-15 postgresql-server-dev-15
```

Remova a configuração antiga:

```shell
sudo rm -rf /etc/postgresql/15/
```

Faça login como usuário **postgres** mais uma vez:

```shell
sudo su - postgres
```

Por fim, elimine os dados antigos do cluster:

```shell
./delete_old_cluster.sh
```

Feito!