import { loadOptions, stripNixStore } from "easy-nix-documentation/loader"
import { exit } from 'node:process';


export default {
    async load() {
        const optionsJSON = process.env.OPTIONS_JSON;
        if (optionsJSON === undefined) {
            console.warn("OPTIONS_JSON undefined");
            exit(1);
        }

        return await loadOptions(optionsJSON, {
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
