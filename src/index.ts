import { exec } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";

export interface NixosOption {
    description: string,
}

export async function loadOptions(): Promise<string> {
    console.log("Loading options");

    const exec2 = promisify(exec);
    const { stdout } = await exec2("pwd");
    console.log(stdout);

    return "Hello";
}
