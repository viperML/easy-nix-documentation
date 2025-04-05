<script setup lang="ts">
import { type OptionsDoc } from './loader';

interface Props {
    options: OptionsDoc,
    headingLevel?: "h2" | "h3" | "h4" | undefined,
    include?: RegExp | RegExp[] | undefined,
    exclude?: RegExp | RegExp[] | undefined,
}

const props = defineProps<Props>();
const headingLevel = props.headingLevel || "h3";

const optionsFiltered: OptionsDoc = Object.fromEntries( Object.entries(props.options).filter(([name, _]) => {
    if (props.exclude !== undefined) {
        if (Array.isArray(props.exclude)) {
            return !props.exclude.some((exclude) => exclude.test(name));
        } else {
            return !props.exclude.test(name);
        }
    }
    if (props.include === undefined) {
        return true;
    } else {
        if (Array.isArray(props.include)) {
            return props.include.some((include) => include.test(name));
        } else {
            return props.include.test(name);
        }
    }
}));
</script>

<template>
    <div class="nixos-container">
        <div v-for="(option, name) of optionsFiltered">

            <!-- This is how vitepress generates headings, might change in the future -->
            <component :is="headingLevel" :id="name" tabindex="-1">
                {{ name }}
                <a class="header-anchor" :href="`#${name}`" :aria-label="`Permalink to &quot;${name}&quot;`">&ZeroWidthSpace;</a>
            </component>

            <div v-html="option.description"></div>

            <div class="nixos-props">
                <span>Type:</span>
                <div class="nixos-value">
                    <code>{{ option.type }}</code>
                </div>

                <template v-if="option.default">
                    <span>Default:</span>
                    <div class="nixos-value" v-html="option.default.text"></div>
                </template>

                <template v-if="option.example">
                    <span>Example:</span>
                    <div class="nixos-value" v-html="option.example.text"></div>
                </template>

                <template v-if="option.declarations.length >= 1">
                    <span>Declaration</span>
                    <template v-for="declaration of option.declarations">
                        <div class="nixos-declaration" v-html="declaration"></div>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<style>
.nixos-props {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 2px 20px;
}

.nixos-value {
    max-width: 100% !important;
    overflow-x: auto;
}

.nixos-value > * {
    margin: 0 !important;
    display: inline-block;
}

.nixos-props code {
    white-space: nowrap;
}

.nixos-props span {
    font-weight: 600;
}

.nixos-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.nixos-declaration {
    word-break: break-all;
}

.nixos-container pre {
    margin: 0;
}
</style>
