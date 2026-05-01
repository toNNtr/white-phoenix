<script setup lang="ts">
import { openedModals } from "./useModal";
</script>

<template>
    <div class="modal-list">
        <div class="modal" v-for="modal in openedModals" :key="modal.id">
            <slot :modal="modal"></slot>
        </div>
    </div>
</template>
