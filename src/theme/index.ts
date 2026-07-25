import { computed, ref, type Ref } from "vue";
import defaultTheme from "./default";
import type { CustomThemeConfig, ThemeConfig } from "./types";
import type { RecursivePartial } from "@/types/utility";
import { mergeObjects } from "@/api/helpers";

const extraTheme: Ref<RecursivePartial<ThemeConfig>> = ref({});

export function applyTheme(config?: CustomThemeConfig) {
    if (config) {
        extraTheme.value = config;
    } else {
        extraTheme.value = {};
    }
}

export function useTheme() {
    return computed(() => mergeObjects(defaultTheme, extraTheme.value));
}
