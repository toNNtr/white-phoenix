<script setup lang="ts">
import { ref } from "vue";
import CardMedium from "../CardMedium.vue";

const showOverlay = ref(false);

function toggleOverlay() {
    showOverlay.value = !showOverlay.value;
}
</script>

<template>
    <CardMedium :overlay-visible="showOverlay">
        <template #overlay>
            <div data-testid="overlay">Is anyone can see this?</div>
        </template>
    </CardMedium>
    <button @click="toggleOverlay">Toggle overlay</button>
</template>
