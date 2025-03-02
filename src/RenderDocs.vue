<script setup lang="ts">
import { OptionsDoc } from './loader';
import { createMarkdownRenderer, type SiteConfig } from 'vitepress';

interface Props {
    options: OptionsDoc,
    include?: RegExp[],
    exclude?: RegExp[],
}

const props = defineProps<Props>();
const config = globalThis.VITEPRESS_CONFIG as SiteConfig

const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger)

const options = (() => {
    if (props.include !== undefined) {
        return Object.fromEntries(
            Object.entries(props.options).filter(([name, value]) => {
                // @ts-ignore
                for (const rule of props.include) {
                    const matches = rule.exec(name);
                    if (matches !== null) {
                        return true;
                    }
                }
                return false;
            })
        )
    } else {
        return props.options;
    }
})();
</script>

<template>
    <div v-for="(option, name) of options">
        <h3>{{ name }}</h3>
        <p>
            {{ md.render(option.description) }}
        </p>
    </div>
</template>
