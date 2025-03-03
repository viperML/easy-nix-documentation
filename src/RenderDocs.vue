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

        <component :is="headingLevel" :id="name">{{ name }}</component>

        <div v-html="option.description"></div>

        <div class="nixos-props">
            <span>Type:</span>
            <code>{{ option.type }}</code>

            <template v-if="option.default !== undefined">
                <span>Default:</span>
                <div class="nixos-value" v-html="option.default.text"></div>
            </template>

            <template v-if="option.example !== undefined">
                <span>Example:</span>
                <div class="nixos-value" v-html="option.example.text"></div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.nixos-props {
    display: grid;
    grid-template-columns: max-content auto;
    gap: 2px 20px;
}

.nixos-value > * {
    margin: 0 !important;
}
</style>
