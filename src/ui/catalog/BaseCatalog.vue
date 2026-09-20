<script setup lang="ts" generic="T extends { id: symbol | string | number }">
import { ref, watch, type Ref } from "vue";
import type { CatalogProps } from "./types";

const { layout = "grid", filter, paging, sorting, getItems } = defineProps<CatalogProps<T>>();
const catalogClass = `catalog_${layout}`;
const catalogItems = ref([]) as Ref<T[]>;
const totalItems = ref<number | null>(null);
const page = ref<number | null>(null);
const isLoading = ref(true);
const error = ref("");

defineSlots<{
    default(props: {
        item: T;
        catalogItems: T[];
        totalItems?: number | null;
        page?: number | null;
    }): unknown;
    loader(): unknown;
    error(props: { error: string }): unknown;
}>();

async function loadData() {
    const result = await getItems({ filter, sorting, paging });
    catalogItems.value = [...result.items];
    totalItems.value = result.totalItems ?? null;
    page.value = result.page ?? null;
}

watch(
    [() => filter, () => sorting, () => paging],
    () => {
        error.value = "";
        isLoading.value = true;
        loadData()
            .catch((loadError) => {
                if (loadError instanceof Error && loadError.message) {
                    error.value = loadError.message;
                } else {
                    error.value = "Произошла ошибка при получении данных.";
                    console.error(loadError);
                }
            })
            .finally(() => (isLoading.value = false));
    },
    {
        immediate: true,
        deep: true,
    },
);
</script>

<template>
    <div
        class="catalog"
        :class="catalogClass"
    >
        <div
            v-if="!isLoading && !error"
            class="catalog__body"
        >
            <div
                v-for="item in catalogItems"
                :key="item.id"
                class="catalog__item"
            >
                <slot v-bind="{ item, catalogItems, totalItems, page }"></slot>
            </div>
        </div>
        <slot
            v-else-if="!isLoading && error"
            name="error"
            :error="error"
            >{{ error }}</slot
        >
        <slot
            v-else
            name="loader"
        >
            Загрузка...
        </slot>
    </div>
</template>

<style scoped>
.catalog {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-auto-flow: row;
    grid-auto-rows: 200px;
}

.catalog.catalog_vertical > .catalog__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
