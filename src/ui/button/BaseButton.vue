<script setup lang="ts">
import { type ButtonProps } from "./types";
import { useButton } from "./useButton";
import { useTheme } from "@/theme";

const emit = defineEmits(["click"]);
const {
    type = "button",
    text = "",
    variety = "primary",
    replace = false,
} = defineProps<ButtonProps>();

const { buttonClass, click } = useButton({ type, text, variety, emit });
const theme = useTheme();
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

    font-family: inherit;
    font-size: inherit;
    color: inherit;

    cursor: pointer;
}

.button-replace:hover > :slotted(*) {
    color: inherit;
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
    --wp-color-button-text-normal: #fff;
    --wp-color-button-text-hover: #fff;
    --wp-color-button-text-active: #fff;
    --wp-color-button-text-disabled: #fff;

    --wp-color-button-bg-normal: v-bind(
        "`var(${theme.color.brand3})` || 'var(--wp-color-brand-3)'"
    );
    --wp-color-button-bg-hover: v-bind("`var(${theme.color.brand2})` || 'var(--wp-color-brand-2)'");
    --wp-color-button-bg-active: v-bind(
        "`var(${theme.color.brand3})` || 'var(--wp-color-brand-3)'"
    );
    --wp-color-button-bg-disabled: v-bind(
        "`var(${theme.color.gray6})` || 'var(--wp-color-gray-60)'"
    );
}

.button.button_outline,
.button-replace.button_outline {
    --wp-color-button-text-normal: var(--wp-color-gray-33);
    --wp-color-button-text-hover: #fff;
    --wp-color-button-text-active: #fff;
    --wp-color-button-text-disabled: #fff;

    --wp-color-button-bg-normal: #fff;
    --wp-color-button-bg-hover: var(--wp-color-brand-2);
    --wp-color-button-bg-active: var(--wp-color-brand-3);
    --wp-color-button-bg-disabled: var(--wp-color-gray-60);

    --wp-color-button-border-normal: var(--wp-color-brand-2);
}

.button,
.button-replace {
    background-color: var(--wp-color-button-bg-normal);
    border: 1px solid var(--wp-color-button-border-normal, var(--wp-color-button-bg-normal));
    border-radius: v-bind("theme.shape.border.radius.M");
    color: var(--wp-color-button-text-normal);
}

.button:hover,
.button-replace:hover {
    background-color: var(--wp-color-button-bg-hover);
    border-color: var(--wp-color-button-border-hover, var(--wp-color-button-bg-hover));
    color: var(--wp-color-button-text-hover);
}
.button:active,
.button-replace:active {
    background-color: var(--wp-color-button-bg-active);
    border-color: var(--wp-color-button-border-active, var(--wp-color-button-bg-active));
    color: var(--wp-color-button-text-active);
}
.button:disabled,
.button-replace[disabled] {
    background-color: var(--wp-color-button-bg-disabled);
    border-color: var(--wp-color-button-border-disabled, var(--wp-color-button-bg-disabled));
    color: var(--wp-color-button-text-disabled);
}

.button-replace[disabled],
.button-replace[disabled] > :slotted(*) {
    cursor: default;
}

.button:focus-visible,
.button-replace:focus-visible {
    outline-color: var(--wp-color-gray-10);
    outline-width: 2px;
    outline-offset: -2px;
    outline-style: solid;
}
</style>
