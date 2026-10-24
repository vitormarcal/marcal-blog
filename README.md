# Marçal Blog

This is the source code for [www.marcal.dev](https://www.marcal.dev), my personal blog. It's a static site built with Nuxt Content, Vue.js, and Markdown. The site is pre-generated for optimal performance and simplicity.

## Features

- **Nuxt Content**: Enables effortless content creation and management using Markdown.
- **Vue.js**: A powerful JavaScript framework for building the site's dynamic components.
- **Static Generation**: The blog is pre-built as a static site for fast loading speeds and efficient delivery.
- **Markdown Support**: Write posts in Markdown for a clean and simple workflow.

## Installation and Usage

### Prerequisites

- Node.js (v16 or later)
- Yarn or npm

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/vitormarcal/marcal-blog.git
   cd marcal-blog
2. Install dependencies:
   ```
   yarn install
   ```
   or
   ```
   npm install
   ```
4. Run the development server:
   ```
   yarn dev
   ```
   or
   ```
   npm run dev
   ```
5. Build for production:
   ```
   yarn generate
   ```
   or
   ```
   npm run generate
   ```
7. Serve the generated site from the `/dist` folder.

## Edições visuais e arquivo histórico

A edição atual é **02 — Caderno pessoal**. `/arquivo` reúne as edições, com
entradas permanentes em `/arquivo/original` e `/arquivo/caderno-2026`.
O parâmetro `?edicao=original` mantém o visual anterior durante a navegação;
`?edicao=edition-02` seleciona a edição atual. A seleção é parte da URL, sem
cookie. As edições apresentam o conteúdo atual, não uma cópia histórica das publicações.

Os componentes e estilos de cada edição ficam versionados por número em
`components/editions/edition-NN/` e `assets/css/editions/edition-NN.css`.
Preserve esses arquivos quando criar uma edição nova. Assim, a atual continua
sendo `edition-02` e uma edição futura, como a de 2027, pode ser `edition-03`,
sem atrelar o nome do componente ao ano. Mantenha os componentes compartilhados
compatíveis ou copie-os para a pasta da edição antes de alterá-los de forma incompatível.

Antes de substituir uma edição, registre seu código com:

```sh
node scripts/preserve-edition.mjs nome-da-edicao
```

O comando inclui o código do diretório de trabalho e gera um `.tar.gz` com
manifesto e SHA-256 em `public/arquivo`. Recusa sobrescrever uma edição existente.
A biblioteca de imagens em `public` não é duplicada: preserve os seus URLs.
Para uma nova edição, crie componentes e CSS próprios, acrescente a seleção em
`useVisualEdition`/`layouts/default.vue`, registre a chave no middleware e adicione
uma rota permanente e um cartão em `/arquivo`. As edições antigas devem continuar
resolvendo para os seus componentes originais.

O arquivo `original-2026-10-24.tar.gz` foi extraído do commit anterior à mudança;
`caderno-2026.tar.gz` registra o código da edição 02. Esses arquivos são
registros de código; a navegação histórica usa o conteúdo atualizado do site.
