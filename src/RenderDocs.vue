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

        <h4>Description:</h4>
        <p v-html="option.description"></p>

        <div class="sbs">
            <h4>Type</h4>
            <code>{{ option.type }}</code>
        </div>

        <div class="sbs" v-if="option.default !== undefined">
            <h4>Default</h4>
            <div v-html="option.default.text"></div>
        </div>

        <div class="sbs" v-if="option.example !== undefined">
            <h4>Example</h4>
            <div v-html="option.example.text"></div>
        </div>
    </div>
</template>

<style scoped>
p {
    background-color: red;
}
</style>
