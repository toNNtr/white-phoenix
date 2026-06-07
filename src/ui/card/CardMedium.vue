<script setup lang="ts">
const {
    title = "",
    description = "",
    overlayVisible = false,
} = defineProps<{ title?: string; description?: string; overlayVisible?: boolean }>();
</script>

<template>
    <div tabindex="0" class="card card_m" :aria-label="title">
        <div class="card__inner">
            <div class="card__content">
                <header class="card__header">
                    <div class="card__header-top">
                        <slot name="headerTop"></slot>
                    </div>
                    <div class="card__header-middle">
                        <slot name="header">
                            <h3>{{ title }}</h3>
                        </slot>
                    </div>
                </header>
                <div class="card__description">
                    <slot name="description">
                        <span>{{ description }}</span>
                    </slot>
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
    border-radius: 12px;
}

.card > .card__inner {
    position: relative;

    width: 100%;
    height: 100%;
}

.card.card_m > .card__inner > .card__content {
    display: flex;
    flex-direction: column;
    gap: 16px;

    width: 100%;
    height: 100%;
}

.card.card_m > .card__inner > .card__content > .card__header {
    display: flex;
    flex-direction: column;

    padding: 4px 4px 4px 16px;
}

.card.card_m > .card__inner > .card__content > .card__header > .card__header-top {
    min-height: 12px;
}

.card.card_m > .card__inner > .card__content > .card__description {
    padding: 0 16px 16px 16px;
}

.card.card_m > .card__inner > .card__overlay {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    border-radius: 12px;

    z-index: 2;
}
</style>
