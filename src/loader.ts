import { exec as exec_cb } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { createMarkdownRenderer, MarkdownRenderer, type SiteConfig } from "vitepress";

export interface NixosOption {
    description: string,
    declarations: string[],
    readOnly: boolean,
    type: string,
    loc: string[],
    default?: NixosValue,
    example?: NixosValue,
}

export interface LiteralMD {
    _type: "literalMD",
    text: string,
}

export interface LiteralExpression {
    _type: "literalExpression",
    text: string,
}

export type NixosValue = LiteralMD | LiteralExpression

function renderValue(value: NixosValue, md: MarkdownRenderer): NixosValue {
    if (value._type === "literalMD") {
        return {
            _type: "literalMD",
            text: md.render(value.text)
        }
    } else if (value._type == "literalExpression") {
        return {
            _type: "literalExpression",
            text: `<code>${value.text}</code>`
        }
    } else {
        console.log("Unknown Value")
        console.log(value)
        return value;
    }
}

export type OptionsDoc = Record<string, NixosOption>;


export interface LoaderConfig {
    include?: RegExp[],
    mapDeclarations?: (location: string) => string | undefined,
}

export function stripNixStore(storePath: string): string {
    return storePath.replace(/^\/nix\/store\/[^/]+-[^/]+\//, "");
}

export async function loadOptions(installable: string, loaderConfig?: LoaderConfig): Promise<OptionsDoc> {
    const config = globalThis.VITEPRESS_CONFIG as SiteConfig
    const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger)

    const exec = promisify(exec_cb);
    const storePath = await (async () => {
        // User passes just a pre-built derivation
        if (installable.startsWith("/nix/store")) {
            return installable;
        } else {
            const { stdout } = await exec(`nix build ${installable} --no-link --print-out-paths`);
            return stdout.trim();
        }
    })();

    const file = `${storePath}/share/doc/nixos/options.json`

    const data = await readFile(file, { encoding: "utf-8" });

    const obj: OptionsDoc = JSON.parse(data);

    const res = Object.fromEntries(
        Object.entries(obj)
            .filter(([name]) => loaderConfig?.include?.some(include => include.test(name)) ?? true)
            .map(([name, value]) => {
                value.description = md.render(value.description);

                // Simply drop these
                value.description = value.description.replace("{file}", "");
                value.description = value.description.replace("{command}", "");

                if (value.default) value.default = renderValue(value.default, md);
                if (value.example) value.example = renderValue(value.example, md);

                if (loaderConfig?.mapDeclarations !== undefined) {
                    value.declarations = value.declarations.map(loaderConfig.mapDeclarations).filter(x => x !== undefined);
                } else {
                    value.declarations = value.declarations.map(declaration => `<code>${declaration}</code>`)
                }

                return [name, value];
            })
    );

    return res;
}
