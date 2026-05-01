<script setup lang="ts">
defineEmits<{ modalBackdropClick: [] }>();
</script>

<template>
    <div class="modal" v-if="$slots.modal" @wheel.prevent @touchmove.prevent>
        <div class="modal__backdrop" @click="$emit('modalBackdropClick')">
            <slot name="modal"></slot>
        </div>
    </div>
    <div class="layout main-layout">
        <div v-if="$slots.header || $slots.announcement" class="header-container">
            <div class="header-inner-container">
                <header v-if="$slots.header" class="header" role="banner" aria-label="Главное меню">
                    <slot name="header"></slot>
                </header>
                <div v-if="$slots.announcement" class="announcement-container">
                    <div class="announcement">
                        <slot name="announcement"></slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <main>
                <slot></slot>
            </main>
            <div class="aside-wrapper">
                <aside v-if="$slots.aside">
                    <slot name="aside"></slot>
                </aside>
            </div>
        </div>
        <footer>
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<style scoped>
.layout {
    min-height: 100%;
    width: 100%;
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
}

.main-layout {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.header-container {
    display: flex;
    flex-direction: row;
    justify-content: center;

    margin-top: 10px;
    padding: 0 10px 0 16px;
}

.header-inner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    width: 100%;
}

.header {
    width: 100%;
}

.announcement-container {
    width: 100%;
}

.announcement {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    align-items: center;

    padding: 10px 12px;
    min-height: 60px;

    background-color: var(--color-gray-60);
    border-radius: 12px;

    color: #fff;
}

.content {
    display: flex;
    flex-direction: row;
    flex: 1;

    padding-left: 16px;
    padding-right: 10px;
}

main {
    flex: 1;
}

.aside-wrapper {
    position: relative;
    height: 100%;
}

aside {
    position: absolute;
    right: 0;

    height: 100%;

    z-index: 10;
}

.modal {
    position: relative;
}

.modal__backdrop {
    position: fixed;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;

    background-color: rgb(0 0 0 / 30%);

    z-index: 100;
}

.modal__backdrop > :slotted(*) {
    width: 1080px;
    max-height: 100%;
}
</style>
