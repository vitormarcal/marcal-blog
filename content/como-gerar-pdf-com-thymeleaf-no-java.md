---
title: Como gerar pdf com thymeleaf no java
description: Como gerar documentos pdf facilmente no java, utilizando html, thymeleaf e Flying Saucer. Essa é um solução sem iReport.
author: Vítor Marçal
created_at: 2020-07-01T00:00:00
updated_at: 2024-03-03T12:35:00
is_post: true
tags:
  - tecnologia
  - programacao
  - portugues
related:
  - "[[tags/programacao]]"
  - "[[tags/portugues]]"
language: pt
---
Criar relatórios PDF no Java é bastante comum. Sem dúvidas, a ferramenta mais utilizada e bastante poderosa é o iReport. Entretanto, para alguns projetos ou situações usar iReport é como usar um canhão para matar uma formiga.

iReport dá uma camada a mais de complexidade à solução, tendo que manter aquelas centenas de xmls gerados, a necessidade de baixar uma IDE para criar e editá-los.

Criar templates PDF deveria ser tão simples quanto criar um html, popular os dados e então transformá-lo em PDF.

## Sumário

## A motivação


Certa vez, em um projeto, precisávamos de uma qualidade maior no design dos relatórios e fazê-los, apesar de possível, resultou em uma grande perca de produtividade da equipe. Arrastar e soltar, configurar caixas, tamanhos e alinhamentos com GUI, interfaces gráficas, não era a melhor solução para aquele caso.

A equipe era composta por um design e vários desenvolvedores. Dentre os desenvolvedores, todos tinham familiaridade com front-end, mas um em especial era especialista: enquanto os demais desenvolvedores faziam telas na velocidade 2, esse especialista construía o dobro na velocidade 5. Foi aí que decidimos que talvez seria mais produtivo, construir os modelos dos relatórios em HTML, em vez de na ferramenta iReport e assim ganhar velocidade bem como a qualidade do design dos relatórios. A solução era uma combinação de html, template engine e a transformação deste template para PDF.

## As ferramentas


Para o template engine usamos Thymeleaf que atualmente é um dos melhores templates engines que rodam no ambiente Java. Lembrando, os templates serão em HTML, populados dinamicamente com a ajuda do Thymeleaf para o template, então, ser convertido para um arquivo PDF. Abaixo, a dependência maven do tymeleaf:

```xml
    <dependency>
        <groupId>org.thymeleaf</groupId>
        <artifactId>thymeleaf</artifactId>
    </dependency>

```


Para transformar o template html para pdf foi ultilizada a biblioteca Flying Saucer. Abaixo a dependência:

```xml
    <dependency>
        <groupId>org.xhtmlrenderer</groupId>
        <artifactId>flying-saucer-pdf</artifactId>
        <version>9.1.20</version>
    </dependency>

```


## O código

Para nosso exemplo, vamos criar uma declaração de nada consta que receberá o seguinte objeto:

`class DadoDeclaracao`

```java
package br.com.vitormarcal.thymelafpdfexample;

import lombok.Value;

import java.time.LocalDate;

@Value
public class DadoDeclaracao {
    String nome;
    String cpf;
    LocalDate dataDeclaracao;
}

```


Iremos criar um diretório dentro da pasta padrão de resources, chamado `relatorios-pdf`, apenas para diferenciar nossos templates relatórios daqueles templates de visão da nossa aplicação, aqueles acessados pelo cliente no navegador. Neste diretório, um template html thymeleaf. Repare que precisamos da marcação `"xmlns:th="http://www.thymeleaf.org"` no elemento `html`.

`src/main/resources/relatorios-pdf/declaracao-nada-consta.html`

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Declaração de nada consta</title>
</head>
<body>
    <!--/*@thymesVar id="dado" type="br.com.vitormarcal.thymelafpdfexample.DadoDeclaracao"*/-->
    <h1>Declaração de nada consta</h1>

    <p>Declaro para os devidos fins que <strong th:text="${dado.nome}"></strong>
        cujo CPF número <strong th:text="${dado.cpf}"></strong>
        não possui débitos junto a este orgão, atá a presente data.
    </p>

    <p>Data: <strong th:text="${dado.dataDeclaracao}"></strong></p>
</body>
</html>

```


Precisamos configurar o template engine thymeleaf. Isso pode ser feito criando um bean em uma classe de configuração e injetando ele em nosso componente. Também podemos fazer essa configuração em nosso componente, neste caso no construtor dele.

```java
ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
templateResolver.setSuffix(".html");
templateResolver.setPrefix("templates-pdf/");
templateResolver.setTemplateMode(TemplateMode.HTML);

templateEngine = new TemplateEngine();
templateEngine.setTemplateResolver(templateResolver);

```


Para popular os dados dinâmicos do template precisaremos do nome do template e os objetos a serem populados:

```java
    private String parseThymeleafTemplate(String template, Context context) {
            return templateEngine.process(template, context);
    }

```


Uma vez que temos o html já com os dados populados, basta converter ele para um PDF:

```java
public byte[] gerarPdfDoHtml(String nomeTemplate, Context context) {

        String html = parseThymeleafTemplate(nomeTemplate, context);
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        }

        return new byte[0];
}

```


Isso é tudo o que precisamos. Uma chamada ao componente pode ser feita como:

```java
Context context = new Context();
DadoDeclaracao dadoDeclaracao = new DadoDeclaracao("fulano", "03490113101", LocalDate.now());
context.setVariable("dado", dadoDeclaracao);
bytes[] arquivo = componente.gerarPdfDoHtml("declaracao-nada-consta", contexto);

```


## Conclusão

Essa é uma forma simples de gerar relatórios aproveitando todas as skills que desenvolvedores têm no frontend. Lembrando que não substitui ferramentas poderosas como iReport, seu uso deverá ser ponderado de acordo com a necessidade e o valor agregado ao seu projeto.

Um problema dessa solução é que não existe suporte para features do `CSS3`, pela sua inviabilidade de desenvolver e calcular isso por dentro da biblioteca que trasforma html para pdf. Então, se você precisa muito dessas features, usar esta solução é um caso a se pensar.

A implementação completa deste exemplo pode ser [encontrada neste repositório do GitHub](https://github.com/vitormarcal/thymelaf-pdf-example "Código completo do artigo").