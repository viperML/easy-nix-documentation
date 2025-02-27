import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Easy Nix Documentation",
  description: "A VitePress Site",
  base: "/easy-nix-documentation/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    // sidebar: [
    //   {
    //     // text: 'Examples',
    //     items: [
    //       { text: 'Options', link: '/options' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    outline: {
      level: "deep",
    }
  }
})
