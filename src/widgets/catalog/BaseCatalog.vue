<script setup lang="ts" generic="T extends { id: symbol | string | number }">
import { onMounted, ref, type Ref } from "vue";
import { type CatalogProps } from "./types";
import type { FilterOptions, PagingOptions } from "@/shared/api/types/common";

const { layout = "grid", title = "", items = [], getItems } = defineProps<CatalogProps<T>>();
const catalogClass = `catalog_${layout}`;
const catalogItems = ref([...items]) as Ref<T[]>;
const isLoading = ref(true);
const filter = ref<FilterOptions>({});
const paging = ref<PagingOptions>({});

defineSlots<{
    header(): unknown;
    card(props: { item: T }): unknown;
}>();

onMounted(() => {
    if (getItems) {
        getItems({ filter: filter.value, paging: paging.value })
            .then((result) => {
                catalogItems.value = [...result];
            })
            .catch((error) => console.error(error))
            .finally(() => {
                isLoading.value = false;
            });
    } else {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="catalog" :class="catalogClass" :aria-label="title">
        <header class="catalog__header">
            <slot name="header">
                <h2>{{ title }}</h2>
            </slot>
        </header>
        <div v-if="!isLoading" class="catalog__body">
            <div v-for="item in catalogItems" :key="item.id" class="catalog__card">
                <slot name="card" :item="item"></slot>
            </div>
        </div>
        <span v-else>Загрузка</span>
    </div>
</template>

<style scoped>
.catalog {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.catalog > header.catalog__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
}

.catalog.catalog_grid > .catalog__body {
    display: grid;
    column-gap: 10px;
    row-gap: 10px;
    grid-template-columns: repeat(6, minmax(200px, 1fr));
    grid-auto-flow: row;
    grid-auto-rows: 200px;
}

.catalog.catalog_horizontal > .catalog__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
