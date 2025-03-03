<script setup lang="ts">
import { OptionsDoc } from './loader';
import { createMarkdownRenderer, type SiteConfig } from 'vitepress';

interface Props {
    options: OptionsDoc,
}

const props = defineProps<Props>();
</script>

<template>
    <div v-for="(option, name) of options">
        <h3>{{ name }}</h3>
        <h4>Description:</h4>
        <p v-html="option.description"></p>

        <h4>Type</h4>
        <code>{{ option.type }}</code>

        <div v-if="option.default !== undefined">
            <h4>Default</h4>
            <div v-html="option.default.text"></div>
        </div>

        <div v-if="option.example !== undefined">
            <h4>Example</h4>
            <div v-html="option.example.text"></div>
        </div>
    </div>
</template>
