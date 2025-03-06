---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: easy-nix-documentation
  text: VitePress Powered Nix Module Documentation Generator
  tagline: Nix and Markdown to Beautiful in Minutes
  actions:
    - theme: brand
      text: Usage
      link: /usage
    # - theme: alt
    #   text: Cookbook
    #   link: /cookbook
    - theme: alt
      text: Example
      link: /example
    - theme: alt
      text: GitHub
      link: https://github.com/viperML/easy-nix-documentation

features:
  - title: Easy to use
    details: Document your Nix project with as little boilerplate as possible.
    icon: 🚀
  - title: Batteries-included
    details: All you need to generate a beautiful page with just VitePress and this library.
    icon: 🔋
  - title: Composable
    details: Easy-Nix-Documentation integrates into a VitePress project as another component.
    icon: 🧩
---

Easy-Nix-Documentation is a NodeJS library that adapts a Nix/NixOS module into a [VitePress](https://vitepress.dev/) site.
Create a VitePress site, point easy-nix-documentation to your modules, and publish your site with GitHub pages!
