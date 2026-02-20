export interface StorySlide {
  image: string
  strong: string
  text: string
}

export interface StoryItem {
  slug: string
  title: string
  subtitle?: string
  cover: string
  layout?: 'slide-layout' | 'default'
  slides: StorySlide[]
}

export const stories: StoryItem[] = [
  {
    slug: 'gostos',
    title: 'Goûts',
    subtitle: "Les choses que j'aime (et que je n'aime pas)",
    cover: '/img/gostos-e-desgostos/img-ipe-jaune.jpg',
    layout: 'slide-layout',
    slides: [
      {
        image: '/img/gostos-e-desgostos/img-ipe-jaune.jpg',
        strong: 'Salut! Je suis Vitor',
        text: "et voici les choses que j'aime (et que je n'aime pas)."
      },
      { image: '/img/gostos-e-desgostos/img-vin.jpg', strong: "J'aime", text: 'le vin 🍷.' },
      { image: '/img/gostos-e-desgostos/img-biere.jpg', strong: "Je n'aime pas", text: 'la bière. 🍺' },
      {
        image: '/img/gostos-e-desgostos/img-lecture.jpg',
        strong: "J'aime",
        text: 'la lecture, les livres et les bandes dessinées 📚.'
      },
      {
        image: '/img/gostos-e-desgostos/img-chocolat.jpg',
        strong: "J'aime",
        text: 'les gâteaux au chocolat et les bonbons 🍫🎂🤤.'
      },
      {
        image: '/img/gostos-e-desgostos/img-cigarettes.jpg',
        strong: "Je n'aime pas",
        text: 'les cigarettes ni leur odeur. 🚬 🤢'
      },
      {
        image: '/img/gostos-e-desgostos/img-echecs.jpg',
        strong: "J'aime",
        text: "le jeu d'échecs. J'aime pratiquer les échecs ♟️♔."
      },
      {
        image: '/img/gostos-e-desgostos/img-ordinateurs.jpg',
        strong: "J'aime",
        text: 'jouer avec des ordinateurs. 💻'
      },
      {
        image: '/img/gostos-e-desgostos/img-bruit.jpg',
        strong: "Je n'aime pas",
        text: 'le bruit, les voitures et les gens bruyants. 🔊 🙉️'
      },
      {
        image: '/img/gostos-e-desgostos/img-region-boisee.jpg',
        strong: "J'aime",
        text: "visiter les régions de l'intérieur. J'aime visiter les régions boisées. 🌳"
      },
      {
        image: '/img/gostos-e-desgostos/img-ma-petite-fille.jpg',
        strong: "J'aime",
        text: 'ma petite fille.👧'
      },
      {
        image: '/img/gostos-e-desgostos/img-ipe-jaune.jpg',
        strong: "C'est tout,",
        text: 'à bientôt !'
      }
    ]
  }
]

export const getStoryBySlug = (slug: string) => {
  return stories.find((story) => story.slug === slug) || null
}

