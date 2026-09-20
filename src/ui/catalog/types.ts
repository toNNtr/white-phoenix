import type { FilterOptions, GetCatalogItemsMethod, PagingOptions, Sorting } from "@/types/common";

export type CatalogProps<T> = {
    layout?: "grid" | "vertical";
    filter?: FilterOptions;
    paging?: PagingOptions;
    sorting?: Sorting;
    getItems: GetCatalogItemsMethod<T>;
};
