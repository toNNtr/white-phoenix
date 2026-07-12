<script setup lang="ts">
import { computed } from "vue";
import type { Popup } from "../popup";

const { callback, popup } = defineProps<{ callback: () => void; popup: Popup }>();
const invertedIsOpened = computed(() => {
    callback();
    return !popup.isOpenedRef.value;
});

function toggle() {
    popup.toggle();
}
</script>

<template>
    <button type="button" @click="toggle">Toggle</button>
    <span data-testid="state" v-if="popup.isOpenedRef">Opened</span>
    <span data-testid="state" v-else>Closed</span>
    <span data-testid="invertedState" v-if="invertedIsOpened">Opened</span>
    <span data-testid="invertedState" v-else>Closed</span>
</template>
