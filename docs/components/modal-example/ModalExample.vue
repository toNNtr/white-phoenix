<script setup lang="ts">
defineEmits<{ close: [] }>();
</script>

<template>
    <div class="modal-example">
        <span style="text-align: center">Клик снаружи закроет окно.</span>
    </div>
</template>

<style scoped>
.modal-example {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 300px;
    height: 150px;
}
</style>
