import type { FilterOptions, GetCatalogItemsMethod, PagingOptions, Sorting } from "@/types/common";

export type CatalogItemBase = { id: symbol | string | number };

export type CatalogProps<T> = {
    layout?: "grid" | "vertical";
    filter?: FilterOptions;
    paging?: PagingOptions;
    sorting?: Sorting;
    infinite?: boolean;
    stopWatch?: boolean;
    getItems: GetCatalogItemsMethod<T>;
};

export type CatalogLoadedCallback<T extends CatalogItemBase> = (params: {
    items: T[];
    totalItems?: number | null;
    page?: number | null;
}) => void;
