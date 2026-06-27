<script setup lang="ts">
import { useOpenedModals } from "./useModal";

const openedModals = useOpenedModals();
</script>

<template>
    <div class="modal-list">
        <div class="modal" v-for="modal in openedModals" :key="modal.id">
            <slot :modal="modal"></slot>
        </div>
    </div>
</template>
