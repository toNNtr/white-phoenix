<script setup lang="ts">
import { usePopup } from "@/shared/api/popup";
import { computed, onMounted, useId, useTemplateRef } from "vue";

const bodyWrapperRef = useTemplateRef("bodyWrapperRef");
const dropdown = usePopup();
const uid = useId();
const dropdownBodyId = `dropdown-body-${uid}`;

const dropdownClass = computed(() => ({ dropdown_expanded: dropdown.isOpened.value }));
const dropdownControlsClass = computed(() => ({ "drop-shadow": dropdown.isOpened.value }));
const dropdownBodyClass = computed(() => ({ "drop-shadow": dropdown.isOpened.value }));

onMounted(() => {
    if (bodyWrapperRef.value) {
        dropdown.assignElement(bodyWrapperRef.value);
    }
});

defineExpose({ toggle: dropdown.toggle, open: dropdown.open, close: dropdown.close });
</script>

<template>
    <div ref="currentRootRef" class="dropdown" :class="dropdownClass">
        <div class="dropdown__controls" :class="dropdownControlsClass">
            <slot
                name="controls"
                :dropdown-body-id="dropdownBodyId"
                :is-opened="dropdown.isOpened.value"
            ></slot>
        </div>
        <div
            ref="bodyWrapperRef"
            class="dropdown__body-wrapper"
            style="width: 100%; position: relative"
            :id="dropdownBodyId"
        >
            <div class="dropdown__body" :class="dropdownBodyClass">
                <div class="dropdown__body-background"></div>
                <div class="dropdown__body-inner">
                    <slot name="body">
                        <div class="dropdown__default-body"></div>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dropdown {
    display: flex;
    flex-direction: column;
}

.dropdown__body-wrapper {
    position: relative;
}

.dropdown__body {
    position: absolute;
    overflow: hidden;

    display: none;
    width: 100%;

    background-color: var(--color-gray-80);
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

.dropdown__body-inner {
    position: relative;

    margin-top: 2px;
    z-index: 1;
}

.dropdown__body-background {
    position: absolute;

    width: 100%;
    height: 100%;

    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    background-color: #fff;
}

.dropdown__default-body {
    min-height: 40px;
}

.dropdown_expanded > .dropdown__body-wrapper > .dropdown__body {
    display: initial;
}

.dropdown.dropdown_expanded > .dropdown__controls {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.dropdown.dropdown_expanded > .dropdown__controls > :slotted(*),
.dropdown.dropdown_expanded > .dropdown__controls > :slotted(*) > * {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
</style>
