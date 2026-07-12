<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "../BaseButton.vue";

const count = ref(0);

function increment() {
    count.value++;
}
</script>

<template>
    <BaseButton @click="increment">Increment</BaseButton>
    <span data-testid="clicked-count">{{ count }}</span>
</template>
