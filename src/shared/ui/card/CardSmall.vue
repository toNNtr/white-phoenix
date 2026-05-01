<script setup lang="ts">
import { computed, useSlots } from "vue";

const {
    title = "",
    description = "",
    overlayVisible = false,
} = defineProps<{ title?: string; description?: string; overlayVisible?: boolean }>();

const slots = useSlots();
const cardClass = computed(() => ({
    "card_with-end": slots.end,
    "card_overlay-visible": overlayVisible,
}));
</script>

<template>
    <div tabindex="0" class="card card_s" :class="cardClass" :aria-label="title">
        <div class="card__inner">
            <div class="card__content">
                <div class="card__start">
                    <header>
                        <slot name="start">
                            <h3>{{ title }}</h3>
                        </slot>
                    </header>
                </div>
                <div class="card__center">
                    <slot name="center">
                        <span>{{ description }}</span>
                    </slot>
                </div>
                <div v-if="$slots.end" class="card__end">
                    <slot name="end"></slot>
                </div>
            </div>

            <div v-if="$slots.overlay" :hidden="!overlayVisible" class="card__overlay">
                <slot name="overlay"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    width: 100%;
    height: 100%;

    background-color: #fff;
    border-radius: 16px;
}

.card > .card__inner {
    position: relative;

    width: 100%;
    min-height: 50px;
}

.card.card_s > .card__inner > .card__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 46px;

    padding: 12px 18px;
}

.card.card_s.card_with-end > .card__inner > .card__content {
    padding-right: 8px;
}

.card.card_s .card__end {
    margin-left: auto;
}

.card.card_s > .card__inner > .card__overlay {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;

    padding: 4px 8px 4px 16px;

    background: linear-gradient(to right, transparent, var(--color-gray-80) 10px);
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
}

.card.card_s.card_overlay-visible {
    background-color: var(--color-gray-80);
}
</style>
