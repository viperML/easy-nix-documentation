import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadOptions, stripNixStore } from "easy-nix-documentation/loader"


export default {
    async load() {
        const __dirname = dirname(fileURLToPath(import.meta.url));

        return await loadOptions(`-f ${__dirname}/example.nix optionsJSON`, {
            include: [
                /programs\.neovim\.*/,
                /services\.rsnapshot\.*/
            ],
            mapDeclarations: declaration => {
                const relDecl = stripNixStore(declaration);
                return `<a href="http://github.com/NixOS/nixpkgs/tree/nixos-unstable/${relDecl}">&lt;${relDecl}&gt;</a>`
            },
        })
    }
}
