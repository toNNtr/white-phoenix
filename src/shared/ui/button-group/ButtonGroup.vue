<script setup lang="ts">
import { ref, type Component } from "vue";

const {
    element = "div",
    direction = "horizontal",
    rounded = false,
} = defineProps<{
    element?: keyof HTMLElementTagNameMap | Component;
    direction?: "horizontal" | "vertical";
    rounded?: boolean;
}>();

const buttonGroupClass = ref({
    "button-group_vertical": direction !== "horizontal",
    "button-group_rounded": rounded,
});
</script>

<template>
    <component :is="element" class="button-group" :class="buttonGroupClass">
        <slot class="button-group__item"></slot>
    </component>
</template>

<style scoped>
.button-group {
    display: flex;
    flex-direction: row;
    align-items: center;

    border-radius: 12px;
}

.button-group.button-group_vertical {
    flex-direction: column;
}

.button-group > :slotted(button),
.button-group > :slotted(a),
.button-group > :slotted(div),
.button-group > :slotted(div) > a {
    border-radius: 0;
}
.button-group.button-group_rounded > *:first-child,
.button-group.button-group_rounded > :slotted(div):first-child > a {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
}
.button-group.button-group_rounded > *:last-child,
.button-group.button-group_rounded > :slotted(div):last-child > a {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
}
</style>
