<script setup lang="ts">
import { OptionsDoc } from './loader';
import { createMarkdownRenderer, type SiteConfig } from 'vitepress';

interface Props {
    options: OptionsDoc,
    headingLevel?: "h2" | "h3" | "h4"
}

const props = defineProps<Props>();
const headingLevel = props.headingLevel || "h3";
</script>

<template>
    <p class="check">Hello world</p>

    <div v-for="(option, name) of options">

        <!-- This is how vitepress generates headings, might change in the future -->
        <component :is="headingLevel" :id="name" tabindex="-1">
            {{ name }}
            <a class="header-anchor" :href="`#${name}`" :aria-label="`Permalink to &quot;${name}&quot;`">&ZeroWidthSpace;</a>
        </component>

        <div v-html="option.description"></div>

        <div class="nixos-props">
            <span>Type:</span>
            <div>
                <code>{{ option.type }}</code>
            </div>

            <template v-if="option.default !== undefined">
                <span>Default:</span>
                <div class="nixos-value" v-html="option.default.text"></div>
            </template>

            <template v-if="option.example !== undefined">
                <span>Example:</span>
                <div class="nixos-value" v-html="option.example.text"></div>
            </template>

            <template v-if="option.declarations.length >= 1">
                <span>Declaration</span>
                <template v-for="declaration of option.declarations">
                    <div v-html="declaration"></div>
                </template>
            </template>
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
</style>
