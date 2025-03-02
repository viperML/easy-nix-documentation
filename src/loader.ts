import { exec as exec_cb } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";

export interface Option {
    description: string,
}

export type OptionsDoc = Record<string, Option>;

export async function loadOptions(installable: string): Promise<OptionsDoc> {
    const exec = promisify(exec_cb);
    const { stdout } = await exec(`nix build ${installable} --no-link --print-out-paths`);

    const file = `${stdout.trim()}/share/doc/nixos/options.json`;

    const data = await readFile(file, { encoding: "utf-8" });

    const obj: OptionsDoc = JSON.parse(data);

    return obj;
}

