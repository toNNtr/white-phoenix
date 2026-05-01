<script setup lang="ts">
import { type ButtonProps } from "./types";
import { useButton } from "./useButton";

const emit = defineEmits(["click"]);
const {
    type = "button",
    text = "",
    variety = "primary",
    replace = false,
} = defineProps<ButtonProps>();

const { buttonClass, click } = useButton({ type, text, variety, emit });
</script>

<template>
    <button
        tabindex="0"
        v-if="!replace"
        class="button"
        @click="click"
        :class="buttonClass"
        :type="type"
    >
        <slot v-if="$slots.default"></slot>
        <span v-else>{{ text }}</span>
    </button>
    <div v-else class="button-replace" :class="buttonClass">
        <slot></slot>
    </div>
</template>

<style scoped>
.button,
.button-replace > :slotted(*) {
    display: flex;
    flex-direction: row;
    gap: 4px;
    justify-content: center;
    align-items: center;

    padding: 10px 16px;
    border: unset;
    border-radius: 12px;

    font-family: inherit;
    font-size: inherit;
    color: inherit;

    cursor: pointer;
}

.button-replace > :slotted(*) {
    text-decoration: none;
}

.button > *,
.button-replace > :slotted(*) > * {
    min-width: 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.button-replace:hover {
    cursor: pointer;
}

.button.button_primary,
.button-replace.button_primary {
    --color-button-text-normal: #fff;
    --color-button-text-hover: #fff;
    --color-button-text-active: #fff;
    --color-button-text-disabled: #fff;

    --color-button-bg-normal: var(--color-gray-60);
    --color-button-bg-hover: var(--color-gray-33);
    --color-button-bg-active: var(--color-gray-40);
    --color-button-bg-disabled: var(--color-gray-60);
}

.button,
.button-replace {
    border-radius: 12px;
    background-color: var(--color-button-bg-normal);
    color: var(--color-button-text-normal);
}

.button:hover,
.button-replace:hover {
    background-color: var(--color-button-bg-hover);
    color: var(--color-button-text-hover);
}
.button:active,
.button-replace:active {
    background-color: var(--color-button-bg-active);
    color: var(--color-button-text-active);
}
.button:disabled,
.button-replace[disabled] {
    background-color: var(--color-button-bg-disabled);
    color: var(--color-button-text-disabled);
}

.button-replace[disabled],
.button-replace[disabled] > :slotted(*) {
    cursor: default;
}

.button:focus-visible,
.button-replace:focus-visible {
    outline-color: var(--color-gray-10);
    outline-width: 2px;
    outline-offset: -2px;
}
</style>
