<script setup lang="ts">
import type { ECloseReason } from "@/api/popup";
import { computed } from "vue";

const { type } = defineProps<{ type?: string }>();

defineEmits<{
    close: [params?: Partial<{ reason: ECloseReason }>];
}>();
</script>
<template>
    <div data-testid="modal">Modal - {{ type }}</div>
</template>
