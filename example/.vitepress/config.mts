import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "easy-nix-documentation",
  description: "Documentation generator for your Nix projects",
  base: "/easy-nix-documentation/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: 'Home', link: '/' },
    // ],

    sidebar: [
      {
        items: [
          { text: "Usage", link: "/usage", },
          // { text: 'Cookbook', link: '/cookbook' },
          { text: 'Example', link: '/example' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/viperML/easy-nix-documentation' }
    ],

    outline: {
      level: "deep",
    }
  }
})
