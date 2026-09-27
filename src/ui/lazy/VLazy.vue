<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { useObserver } from "@/api/containerObserver";
import type { ObserverTargetCallback } from "@/api/containerObserver/types";

const props = defineProps<{
    root?: Element | Document | null;
}>();
const isActive = ref(false);
const target = useTemplateRef("target");

const emit = defineEmits<{
    active: [];
}>();

const observerCallback: ObserverTargetCallback = (entry, observerProxy) => {
    if (entry.isIntersecting) {
        observerProxy.unobserve({ target: entry.target }, observerCallback);
        isActive.value = true;

        emit("active");
    }
};

onMounted(() => {
    if (target.value) {
        const observer = useObserver({ root: props.root });
        observer.observe(
            {
                target: target.value,
            },
            observerCallback,
        );
    }
});
</script>

<template>
    <div
        v-if="!isActive"
        ref="target"
    ></div>
    <template v-else>
        <slot></slot>
    </template>
</template>
