import { loadOptions } from "easy-nix-documentation/loader"

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'


export default {
    async load() {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        return await loadOptions(`-f ${__dirname}/example.nix optionsJSON`);
    }
}
