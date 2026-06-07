import type { PagingOptions } from "@/types/common";

export type CatalogProps<T> = {
    layout?: "grid" | "horizontal";
    title?: string;
    items?: T[];
    getItems?: (params: {
        filter?: { searchWord?: string };
        paging?: PagingOptions;
    }) => Promise<T[]>;
};
