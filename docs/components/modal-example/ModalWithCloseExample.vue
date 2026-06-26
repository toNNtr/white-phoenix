<script setup lang="ts">
import { BaseButton } from "@/ui/button";

defineEmits<{ close: [] }>();
</script>

<template>
    <div @click.stop class="modal-example">
        <span style="text-align: center">Клик по кнопке или&nbsp;снаружи закроет окно.</span>
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
    padding: 12px;

    background-color: #fff;
    border-radius: 16px;
    box-shadow: 4px 4px 10px #0000006a;
}
</style>
