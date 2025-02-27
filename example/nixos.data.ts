import { loadOptions } from "easy-nix-documentation"


export default {
    async load() {
        const res = await loadOptions();
        return res;
    }
}
