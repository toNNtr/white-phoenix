<script setup lang="ts">
import { BaseButton } from "@/ui/button";

defineEmits<{ close: [] }>();
</script>

<template>
    <div @click.stop class="modal-example">
        <span style="text-align: center">Клик по кнопке или снаружи закроет окно.</span>
        <BaseButton @click="$emit('close')">Закрыть</BaseButton>
    </div>
</template>

<style scoped>
.modal-example {
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    align-items: center;

    width: 300px;
    height: 150px;
}
</style>
