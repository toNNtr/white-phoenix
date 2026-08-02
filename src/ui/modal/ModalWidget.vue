<script setup lang="ts" generic="T extends PopupCloseExtraParams = PopupCloseExtraParams">
import { ECloseReason, type PopupCloseExtraParams, type PopupCloseParams } from "@/api/popup";
import type { GetParameters } from "@/types/utility";
import { BaseButton } from "@/ui/button";
import { BaseIcon } from "@/ui/icon";
import type { Modal } from "./types";

const { modal } = defineProps<{ modal: Modal<T> }>();
defineEmits<{ close: GetParameters<Modal<T>["close"]> }>();
</script>

<template>
    <div class="modal-widget" @click.stop>
        <BaseButton
            @click="$emit('close', { reason: ECloseReason.CLOSE } as PopupCloseParams)"
            class="modal-widget__button-close"
            style="padding: 4px; border-radius: 4px"
            variety="primary"
        >
            <BaseIcon style="width: 16px; height: 16px" type="icon-cross" />
        </BaseButton>

        <component :is="modal.component" @close="$emit('close', $event)" />
    </div>
</template>

<style scoped>
.modal-widget {
    position: relative;

    padding: 24px;
    background-color: #fff;
    border-radius: 16px;
}

.modal-widget__button-close {
    position: absolute;
    top: 8px;
    right: 8px;
}
</style>
