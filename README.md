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

## Designs do site

A página `/design` apresenta dois layouts que marcaram o site: **Minimalista escuro**,
o visual de fundo preto e links verdes, e **Fanzine pessoal**, o design atual.
Cada um tem uma rota permanente (`/design/minimalista-escuro` e `/design/fanzine-pessoal`).
Ao navegar entre páginas, a escolha fica registrada em `?design=minimalista-escuro` ou
`?design=fanzine-pessoal`. As páginas mostram o conteúdo atual do blog.

Os componentes e estilos ficam em `components/designs/<nome>/` e
`assets/css/designs/<nome>.css`. Para criar um novo design, preserve os atuais,
crie uma pasta e um estilo próprios e acrescente a escolha em
`useVisualDesign`/`layouts/default.vue` e no middleware.

Os layouts antigos continuam disponíveis em suas rotas e seus arquivos-fonte.
O histórico do Git registra as alterações do código ao longo do tempo. A navegação
histórica usa o conteúdo atualizado do site.
