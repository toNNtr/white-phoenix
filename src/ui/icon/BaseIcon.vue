<script setup lang="ts">
import { type IconProps } from "./types";
import { useIcon } from "./useIcon";

const { type } = defineProps<IconProps>();
const { icon } = useIcon({ type });
</script>

<template>
    <div class="icon" v-html="icon" aria-hidden="true"></div>
</template>

<style>
.icon {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 16px;
}

.icon > svg {
    width: 100%;
    height: 100%;

    pointer-events: none;
}
</style>
