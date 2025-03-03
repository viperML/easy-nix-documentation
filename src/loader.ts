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
    include?: RegExp[]
}

export async function loadOptions(installable: string, loaderConfig?: LoaderConfig): Promise<OptionsDoc> {
    const config = globalThis.VITEPRESS_CONFIG as SiteConfig
    const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger)

    const exec = promisify(exec_cb);
    const { stdout } = await exec(`nix build ${installable} --no-link --print-out-paths`);


    const file = `${stdout.trim()}/share/doc/nixos/options.json`;

    const data = await readFile(file, { encoding: "utf-8" });

    const obj: OptionsDoc = JSON.parse(data);

    const res = Object.fromEntries(
        Object.entries(obj).filter(([name, value]) => {
            if (loaderConfig?.include !== undefined) {
                for (const include of loaderConfig.include) {
                    const res = include.exec(name);
                    if (Array.isArray(res) && res.length) {
                        return true;
                    }
                }
                return false;
            } else {
                return true;
            }
        }).map(([name, value]) => {
            value.description = md.render(value.description);
            if (value.default !== undefined) {
                value.default = renderValue(value.default, md);
            }
            if (value.example !== undefined) {
                value.example = renderValue(value.example, md)
            }
            return [name, value];
        })
    )

    return res;
}
