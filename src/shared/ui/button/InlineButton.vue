<script setup lang="ts">
import { type ButtonProps } from "./types";
import { useButton } from "./useButton";

const emit = defineEmits(["click"]);
const { type = "button", text = "" } = defineProps<Omit<ButtonProps, "variety">>();
const { click } = useButton({ type, text, emit });
</script>

<template>
    <button class="inline-button" @click="click" :type="type">
        <slot v-if="$slots.default"></slot>
        <span v-else>{{ text }}</span>
    </button>
</template>

<style scoped>
.inline-button {
    display: inline-block;
    border: unset;
}

.inline-button:focus {
    outline: none;
}
.inline-button:focus-visible {
    outline-color: var(--color-gray-10);
    outline-width: thin;
    outline-offset: 2px;
}
</style>
