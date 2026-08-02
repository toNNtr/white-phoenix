<script setup lang="ts">
import type { ECloseReason } from "@/api/popup";

const { type, fnClick } = defineProps<{ type?: string; fnClick?: () => void }>();

defineEmits<{
    close: [params?: Partial<{ reason: ECloseReason }>];
}>();

function buttonClick() {
    fnClick?.();
}
</script>
<template>
    <div data-testid="modal">Modal - {{ type }}</div>
    <button @click="buttonClick" data-testid="modal-button">Inside click</button>
</template>
