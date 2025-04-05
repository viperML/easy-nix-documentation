---
title: Example
---

# {{ $frontmatter.title }}


The following is an example of using the library to document the `programs.neovim` options from NixOS.

## Base files

This document is created simply by loading the Vue component with the data from the loader.
Please read the [documentation](/usage).

```vue
<!-- index.md -->
## Title

Some text

<script setup>
import { data } from "./nixos.data.js";
import { RenderDocs } from "easy-nix-documentation";
</script>

## Options

<RenderDocs :options="data" />
```

```ts
// nixos.data.ts
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadOptions, stripNixStore } from "easy-nix-documentation/loader"


export default {
    async load() {
        const __dirname = dirname(fileURLToPath(import.meta.url));

        return await loadOptions(`-f ${__dirname}/example.nix optionsJSON`, {
            include: [/programs\.neovim\.*/],
            mapDeclarations: declaration => {
                const relDecl = stripNixStore(declaration);
                return `<a href="http://github.com/NixOS/nixpkgs/tree/nixos-unstable/${relDecl}">&lt;${relDecl}&gt;</a>`
            },
        })
    }
}
```

```nix
# example.nix
let
  pkgs = import <nixpkgs> { };
  nixos = import <nixpkgs/nixos> {
    configuration = { };
  };
in
pkgs.nixosOptionsDoc {
  inherit (nixos) options;
}
```

---

<script setup lang="ts">
// @ts-ignore
import { data } from "./nixos.data.js";
import { RenderDocs } from "easy-nix-documentation";
</script>

## Neovim Options

<RenderDocs :options="data" :include="/programs\.neovim\.*/" />

## Rsnapshot Options

<RenderDocs :options="data" :include="/services\.rsnapshot\.*/" />

## Xmonad Options

<RenderDocs :options="data" :include="/services\.xserver\.windowManager\.xmonad\.*/" />

## Test Options

<RenderDocs :options="data" :include="/^test\.*/" />
