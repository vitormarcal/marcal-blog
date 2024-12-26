---
title: Copypastables
description: 
author: Vítor Marçal
is_post: false
related:
  - "[[tags/paginas-fixas]]"
language: pt
---
----
Isso é principalmente para minha própria referência. São trechos de código usados principalmente neste blog. Afinal, não dá para decorar tudo.
## Conteúdo

##  Vídeo do Youtube
<figure class="youtube">  
  <div class="inner-figure">  
    <div>      <iframe width="560" height="315" src="https://www.youtube.com/embed/ejOjC-mTfA0?si=2yLAJkJj7l5cy2qJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>  
    </div>  </div>  <figcaption>    Euphories, da dupla (ou banda?) VIDEOCLUB  
  </figcaption>  
</figure>

Versão copypastable:

```html
<figure class="youtube">  
  <div class="inner-figure">  
    <div>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/ejOjC-mTfA0?si=2yLAJkJj7l5cy2qJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
          </iframe>  
    </div>
  </div>
  <figcaption>Euphories, da dupla (ou banda?) VIDEOCLUB</figcaption>  
</figure>
```
## Expansão e Colapso

<details>
	<summary>Mostre ou Esconda</summary>
	<p>Este conteúdo é oculto por padrão e visível quando o resumo é clicado, tocado ou interagido com o uso de um teclado.</p>
</details>

Versão copypastable:

```html
<details>
	<summary>Mostre ou Esconda</summary>
	<p>Este conteúdo é oculto por padrão e visível quando o resumo é clicado, tocado ou interagido com o uso de um teclado.</p>
</details>
```

Para poder **animar** o atributo `height` para `auto` (navegadores baseados no Chrome apenas, por enquanto, veja a [tabela de compatibilidade](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size#browser_compatibility)):
```css
:root {
    interpolate-size: allow-keywords;
}

details {
	height: 1.5rem;
	transition: height 500ms ease;
}

details[open] {
	height: auto;
	overflow: clip;
}
```
