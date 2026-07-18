<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";
import DropdownBase from "../DropdownBase.vue";
const dropdown = useTemplateRef("dropdown");
const { fnClick, fnMounted } = defineProps<{
    fnClick?: (dropdownRef: typeof dropdown) => void;
    fnMounted?: (dropdownRef: typeof dropdown) => void;
}>();

function buttonClick() {
    fnClick?.(dropdown);
}

onMounted(() => {
    fnMounted?.(dropdown);
});
</script>

<template>
    <DropdownBase ref="dropdown">
        <template #controls="{ dropdownBodyId, isOpened }">
            <button @click.stop="buttonClick" data-testid="button" :aria-controls="dropdownBodyId">
                {{ isOpened ? "Close" : "Open" }}
            </button>
        </template>

        <template #body>
            <div data-testid="body">You can't see me</div>
        </template>
    </DropdownBase>
</template>
