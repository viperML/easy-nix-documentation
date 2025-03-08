---
title: Usage
---

# {{ $frontmatter.title }}


Easy-Nix-Documentation is a NodeJS library that adapts a Nix/NixOS module into a [VitePress](https://vitepress.dev/) site.
Create a VitePress site, point easy-nix-documentation to your modules, and publish your site with GitHub pages!
The goals of this library are:

- Making it as simple as possible for library authors to document their Nix projects.
- Come batteries-included, without much setup from the user.
- Provide abstractions that compose with existing solutions, like VitePress.

If you are already convinced, that's great, let's get you started.

## Adapting your module with `pkgs.optionsDoc`

Nixpkgs provides this function called `pkgs.optionsDoc`:

```
pkgs.optionsDoc {
  options = ...;
}

  ==>
  {
    optionsAsciiDoc = «derivation /nix/store/...-options.adoc.drv»;  <== What we use
    optionsCommonMark = «derivation /nix/store/...-options.md.drv»;
    optionsJSON = «derivation /nix/store/...-options.json.drv»;
    optionsNix = { ... };
  }
```

It takes an attribute set with the key `options`, which is the result of evaluating the module system.
If you want to use this documentation generator, you are either:

1. Writing a module for NixOS, Home-manager, etc.
2. Calling `lib.evalModules` directly.

If you are calling `lib.evalModules` directly, you can get the `options` from its result, for example:

```nix
let
  pkgs = import <nixpkgs> {};

  mySystem = pkgs.lib.evalModules {
    # ...
  };
in
  pkgs.optionsDoc {
    inherit (mySystem) options;
  }
```

Similarly, if you are writing a module for NixOS, you must evaluate the module system with your module on top:

```nix
# Calling optionsDoc for documenting a NixOS module
let
  pkgs = import <nixpkgs> {};

  myNixos = import <nixpkgs/nixos> {
    configuration.imports = [
      ./my-module.nix
    ];
  };
in
  pkgs.optionsDoc {
    inherit (myNixos) options;
  }
```

The data loader will take an **installable** for Nix to build the `optionsJSON` attribute of the `optionsDoc` function.
So, for the previous examples, we would use `nix build -f ./file.nix optionsJSON`, that's the installable you have to pass
to the loader.

```console
$ nix build -f ./file.nix optionsJSON
$ file result/share/doc/nixos/options.json
result/share/doc/nixos/options.json: ASCII text, with very long lines (65536), with no line terminators
```

::: tip
Read the cookbook for more examples, like documenting a NixOS module from a Nix flake.
:::

## First setup

1. Get Node and NPM (or PNPM, Yarn, etc.), you can start by adding them to your existing nix shell:
   ```nix
   with import <nixpkgs>;
   mkShell {
     packages = [
       nodejs
     ];
   }
   ```

2. Init a new VuePress project:
   ```console
   $ npm init
   $ npm pkg set type="module" # IMPORTANT
   $ npm add -D vitepress
   $ npx vitepress init
   $ eza --tree --all --git-ignore
   .
   ├── .gitignore
   ├── .vitepress
   │   └── config.mts
   ├── api-examples.md
   ├── index.md
   ├── markdown-examples.md
   ├── package-lock.json
   └── package.json
   ```

3. Add `easy-nix-documentation` to the project, and configure Vite properly:
   ```
   $ npm add -D easy-nix-documentation
   ```

   ```ts
   // .vitepress/config.mts
   import { defineConfig } from 'vitepress'
   export default defineConfig({
     // ...
     vite: { // [!code ++]
       ssr: { // [!code ++]
         noExternal: 'easy-nix-documentation', // [!code ++]
       } // [!code ++]
     } // [!code ++]
   })
   ```

5. Create a [data loader](https://vitepress.dev/guide/data-loading). This is a separate script that loads the module information once when VitePress starts.

   As the parameter, pass the installable that builds the output of `pkgs.nixosOptionsDoc`, as we saw earlier.
   ```ts
   // myoptions.data.ts
   import { dirname } from 'node:path'
   import { fileURLToPath } from 'node:url'
   import { loadOptions } from "easy-nix-documentation/loader"
   export default {
       async load() {
           const __dirname = dirname(fileURLToPath(import.meta.url));
           return await loadOptions(`-f ${__dirname}/example.nix`)
       }
   }
   ```

   ```nix
   # build_docs.nix
   let
     pkgs = import <nixpkgs> {};
     nixos = import <nixpkgs/nixos> {
       configuration.imports = [
         ./mymodule.nix
       ];
     };
   in
     (pkgs.nixosOptionsDoc {
       inherit (nixos) options;
     }).optionsJSON
   ```

   ```bash
   $ npx vitepress init
   $ eza --tree --all --git-ignore
   .
   ├── .gitignore
   ├── .vitepress
   │   └── config.mts
   ├── api-examples.md
   ├── build_docs.nix  # [!code ++]
   ├── index.md
   ├── markdown-examples.md
   ├── mymodule.nix  # [!code ++]
   ├── myoptions.data.ts  # [!code ++]
   ├── package-lock.json
   └── package.json
   ```

1. In any of the Markdown files, call the loader and pass it to the component to render it.
   ```vue
   ---
   title: My Documentation
   ---
   <!-- docs.md -->

   <script setup>
   import { data } from "./myoptions.data.js";
   import { RenderDocs } from "easy-nix-documentation";
   </script>

   ## Options

   <RenderDocs :options="data" />
   ```

2. _Optionally_, filter the options to load, and map the declarations:

   ```ts
   import { dirname } from 'node:path'
   import { fileURLToPath } from 'node:url'
   import { loadOptions, stripNixStore } from "easy-nix-documentation/loader" // [!code ++]
   export default {
       async load() {
           const __dirname = dirname(fileURLToPath(import.meta.url));

           return await loadOptions(`-f ${__dirname}/example.nix optionsJSON`, {
               include: [/programs\.neovim\.*/], // [!code ++]
               mapDeclarations: declaration => { // [!code ++]
                   const relDecl = stripNixStore(declaration); // [!code ++]
                   return `<a href="http://github.com/NixOS/nixpkgs/tree/nixos-unstable/${relDecl}">&lt;${relDecl}&gt;</a>` // [!code ++]
               }, // [!code ++]
           })
       }
   }
   ```

If you feel like this documentation could be improved, don't hesitate to [open an issue](https://github.com/viperML/easy-nix-documentation/issues).
