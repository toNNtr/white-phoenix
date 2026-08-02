<script setup lang="ts">
import { ECloseReason } from "@/api/popup";
import { useHasOpenedModals, useOpenedModals } from "./useModal";

const openedModals = useOpenedModals();
const hasOpenedModals = useHasOpenedModals();
</script>

<template>
    <div v-if="hasOpenedModals" class="modal-list">
        <div class="modal" v-for="modal in openedModals" :key="modal.id">
            <div
                class="modal__backdrop"
                @click="modal.close({ reason: ECloseReason.BACKDROP_CLICK })"
            >
                <slot :modal="modal"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;

    z-index: 1000;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
}

.modal__backdrop {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    background-color: rgba(0 0 0 / 20%);
}

.modal:last-child > .modal__backdrop {
}
</style>
