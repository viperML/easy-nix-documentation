---
title: Usage
---

# {{ $frontmatter.title }}

Easy-Nix-Documentation is a nodejs library that uses Vue to generate a pretty display of your NixOS options to be displayed with [VitePress](https://vitepress.dev/).

The goals of this library are:

- Making it as simple as possible for library authors to document their Nix proejcts.
- Come batteries-included, without much setup from the user.
- Provide abstractions that compose with existing solutions, like VitePress.

If you are already convinved, that's great, let's get you started.

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

::: tip
Read the cookbook for more examples, like documenting a NixOS module from a Nix flake.
:::

## First setup

1. Get Node and NPM (or NPPM, Yarn, etc), you can start by adding them to your existing nix shell:
   ```nix
   with import <nixpkgs>;
   mkShell {
     packages = [
       nodejs
     ];
   }
   ```

2. Init a new project, and add `vitepress`, `vue` and `easy-nix-documentation` as your dependencies.
   ```console
   $ npm init
   $ npm add -D vitepress vue easy-nix-documentation
   ```

3. Init your vitepress project.
   ```console
   $ npx vitepress init
   ```

4. Create a [data loader](https://vitepress.dev/guide/data-loading). The loader will be called by vitepress at startup, and will cache its result when modifying the markdown pages. In loader, we call the loader function from this library, which calls `nix build` under the hood, and parses the documentation. **You need to pass in an installable which builds the optionsJSON attribute from the nixosOptionsDoc output**.
   ```ts
   // myoptions.data.ts
   import { dirname } from 'node:path'
   import { fileURLToPath } from 'node:url'
   import { loadOptions } from "easy-nix-documentation/loader"
   export default {
       async load() {
           const __dirname = dirname(fileURLToPath(import.meta.url));
           return await loadOptions(`-f ${__dirname}/example.nix optionsJSON`)
       }
   }
   ```

5. Load the data into the Vue component that this library provides
   ```vue
   <!-- index.md -->
   ---
   title: My Documentation
   ---

   <script setup>
   import { data } from "./nixos.data.js";
   import { RenderDocs } from "easy-nix-documentation";
   </script>

   ## Options

   <RenderDocs :options="data" />
   ```

6. Optionally, you can tweak the loader options. For example, filter the options with some regex rule, and map the declarations to a GitHub page:

   ```ts
   import { dirname } from 'node:path'
   import { fileURLToPath } from 'node:url'
   import { loadOptions, stripNixStore } from "easy-nix-documentation/loader"
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

## Cookbook

These are some configurations of the library that diverge from a bare-bones setup.

_TODO_
