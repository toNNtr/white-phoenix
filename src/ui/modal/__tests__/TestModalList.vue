<script setup lang="ts">
import { onMounted } from "vue";
import ModalList from "../ModalList.vue";
import { useOpenedModals } from "../useModal";

const { fnClick, fnMounted } = defineProps<{
    fnClick?: () => void;
    fnInsideClick?: () => void;
    fnMounted?: () => void;
    modalProps?: Record<string, unknown>;
}>();
const openedModals = useOpenedModals();

function buttonClick() {
    fnClick?.();
}

onMounted(() => {
    fnMounted?.();
});
</script>

<template>
    <ModalList data-testid="list">
        <template #default="{ modal }">
            <component :is="modal.component" :type="modal.type" :fn-click="fnInsideClick" />
        </template>
    </ModalList>
    <button data-testid="button" @click.stop="buttonClick">Click</button>
    <span data-testid="opened-number">{{ openedModals.length }}</span>
</template>
