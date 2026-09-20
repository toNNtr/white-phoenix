<script setup lang="ts">
import { CardMedium } from "@/ui/card";
import style from "./style.module.css";
</script>

<template>
    <CardMedium :class="[style.loader, 'card-medium-loader']" />
</template>

<style scoped>
.card-medium-loader {
    height: 100px;
    --padding: 16px;
    --title-width: calc(50%);
    --title-height: 24px;

    --title-x: var(--padding);
    --title-y: var(--padding);
    --title-position: var(--title-x) var(--title-y);
    --title-skeleton: linear-gradient(var(--bg-color), var(--bg-color));
    --title-margin-bottom: 16px;

    --text-line-first-width: calc(100% - var(--padding) - var(--padding));
    --text-line-first-height: var(--text-line-height);
    --text-line-first-x: var(--padding);
    --text-line-first-y: calc(var(--title-y) + var(--title-height) + var(--title-margin-bottom));
    --text-line-first-position: var(--text-line-first-x) var(--text-line-first-y);
    --text-line-first-skeleton: linear-gradient(var(--bg-color), var(--bg-color));
}
</style>
