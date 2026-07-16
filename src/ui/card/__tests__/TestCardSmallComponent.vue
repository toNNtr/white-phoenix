<script setup lang="ts">
import { ref } from "vue";
import CardSmall from "../CardSmall.vue";

const showOverlay = ref(false);

function toggleOverlay() {
    showOverlay.value = !showOverlay.value;
}
</script>

<template>
    <CardSmall :overlay-visible="showOverlay">
        <template #overlay>
            <div data-testid="overlay">Is anyone can see this?</div>
        </template>
    </CardSmall>
    <button @click="toggleOverlay">Toggle overlay</button>
</template>
