<script setup lang="ts" generic="T extends CatalogItemBase">
import { onMounted, ref, useTemplateRef, watch, type Ref } from "vue";
import type { CatalogItemBase, CatalogLoadedCallback, CatalogProps } from "./types";
import type { GetParameters } from "@/types/utility";
import { useObserver } from "@/api/containerObserver";
import type { ObserverProxyBase, ObserverTargetCallback } from "@/api/containerObserver/types";

const {
    layout = "grid",
    filter,
    paging,
    sorting,
    infinite = false,
    getItems,
} = defineProps<CatalogProps<T>>();

const catalogClass = `catalog_${layout}`;
const catalogItems = ref([]) as Ref<T[]>;
const totalItems = ref<number | null>(null);
const loadedPage = ref<number | null>(null);
const isLoading = ref(false);
const error = ref("");
const loadTrigger = useTemplateRef("loadTrigger");
const observer = useObserver();
let page = 0;
let pageSize = 0;
let maxPage: number | null = null;

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

const emit = defineEmits<{
    loaded: GetParameters<CatalogLoadedCallback<T>>;
}>();

function initTrigger() {
    if (loadTrigger.value) {
        observer.observe({ target: loadTrigger.value }, infiniteLoaderCallback);
    }
}

function clearTrigger(observerProxy: ObserverProxyBase) {
    if (loadTrigger.value) {
        observerProxy.unobserve({ target: loadTrigger.value }, infiniteLoaderCallback);
    }
}

const infiniteLoaderCallback: ObserverTargetCallback = (entry, observerProxy) => {
    if (entry.isIntersecting) {
        clearTrigger(observerProxy);

        if (maxPage === null || page < maxPage) {
            page += 1;
            load();
        }
    }
};

function load() {
    if (!isLoading.value) {
        error.value = "";
        isLoading.value = true;

        getItems({ filter, sorting, paging: { page: page, maxItems: pageSize } })
            .then((result) => {
                if (!infinite) {
                    catalogItems.value = [...result.items];
                } else {
                    result.items.forEach((item) => {
                        if (!catalogItems.value.find((elem) => elem.id === item.id)) {
                            catalogItems.value.push(item);
                        }
                    });
                }

                totalItems.value = result.totalItems ?? null;
                loadedPage.value = result.page ?? null;

                if (loadedPage.value && loadedPage.value !== page) {
                    page = loadedPage.value;
                }

                if (result.totalItems) {
                    maxPage = Math.floor(result.totalItems / pageSize);
                }

                isLoading.value = false;

                emit("loaded", {
                    items: catalogItems.value,
                    totalItems: totalItems.value,
                    page: loadedPage.value,
                });

                initTrigger();
            })
            .catch((loadError) => {
                if (loadError instanceof Error && loadError.message) {
                    error.value = loadError.message;
                } else {
                    error.value = "Произошла ошибка при получении данных.";
                    console.error(loadError);
                }
            })
            .finally(() => (isLoading.value = false));
    }
}

watch(
    () => paging,
    (newPaging) => {
        page = newPaging?.page ?? 0;
        pageSize = newPaging?.maxItems ?? 0;
    },
    { immediate: true, deep: true },
);

watch([() => filter, () => sorting, () => paging], load, {
    immediate: true,
    deep: true,
});

onMounted(initTrigger);
</script>

<template>
    <div
        class="catalog"
        :class="catalogClass"
    >
        <div
            v-if="(!isLoading || infinite) && !error"
            class="catalog__body"
        >
            <div
                v-for="item in catalogItems"
                :key="item.id"
                class="catalog__item"
            >
                <slot v-bind="{ item, catalogItems, totalItems, page: loadedPage }"></slot>
            </div>
            <div
                v-if="infinite"
                class="catalog__infinite-load-trigger"
                ref="loadTrigger"
            ></div>
        </div>
        <slot
            v-else-if="!isLoading && error"
            name="error"
            :error="error"
            >{{ error }}</slot
        >
        <slot
            v-if="isLoading"
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

.catalog__infinite-load-trigger {
    margin-top: -10px;
}
</style>
