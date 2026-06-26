<script setup lang="ts">
defineEmits<{ close: [] }>();
</script>

<template>
    <div @click.stop class="modal-example">
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
    padding: 12px;

    background-color: #fff;
    border-radius: 16px;
    box-shadow: 4px 4px 10px #0000006a;
}
</style>
