import { defineAsyncComponent } from "vue";
import type { LayoutParams } from "./types";

export type * from "./types";

export const emptyLayout: LayoutParams = {
    name: "EmptyLayout",
    component: defineAsyncComponent(() => import("./EmptyLayout.vue")),
};

export const mainLayout: LayoutParams = {
    name: "MainLayout",
    component: defineAsyncComponent(() => import("./MainLayout.vue")),
};
