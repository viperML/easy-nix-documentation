<script setup lang="ts">
import type { RenderedNixosOption } from './loader';

interface Props {
    options: Record<string, RenderedNixosOption>,
    headingLevel?: "h2" | "h3" | "h4" | undefined,
    include?: RegExp | RegExp[] | undefined,
    exclude?: RegExp | RegExp[] | undefined,
}

const props = defineProps<Props>();
const headingLevel = props.headingLevel || "h3";

const optionsFiltered: Record<string, RenderedNixosOption> = Object.fromEntries( Object.entries(props.options).filter(([name, _]) => {
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
                <div>
                    <span class="nixos-btn">Type</span>
                </div>
                <div class="nixos-value" v-html="option.type" />
                    <!-- <code>{{ option.type }}</code> -->
                <!-- </div> -->

                <template v-if="option.default">
                    <div>
                        <span class="nixos-btn">Default</span>
                    </div>
                    <div class="nixos-value" v-html="option.default"></div>
                </template>

                <template v-if="option.example">
                    <div>
                        <span class="nixos-btn">Example</span>
                    </div>
                    <div class="nixos-value" v-html="option.example"></div>
                </template>

                <template v-if="option.declarations.length >= 1">
                    <div>
                        <span class="nixos-btn">Declaration</span>
                    </div>
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
    grid-template-columns: max-content auto;
    gap: 4px 20px;
    align-items: center;
}

.nixos-value {
    max-width: 100% !important;
    overflow-x: auto;
}

.nixos-btn {
    background-color: var(--vp-c-bg-soft);
    color: var(--vp-c-brand-1);
    font-size: .8rem;
    padding: .4rem .5rem;
    font-weight: 600;
    border-radius: .4rem;
}

.nixos-declaration {
    margin: .5rem 0;
    overflow-wrap: anywhere;
}

.nixos-value > div {
    margin: 0 !important;
}

.nixos-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.nixos-value .lang {
    display: none;
}

.nixos-value .language-plaintext .copy {
    display: none;
}
</style>
