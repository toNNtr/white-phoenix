export type PagingOptions = {
    page?: number;
    maxItems?: number;
};

export interface FilterOptions {
    searchWord?: string;
}

export type Sorting = Record<string, "asc" | "desc">;

export type Catalog<T> = {
    items: T[];
    totalItems?: number;
    page?: number;
};

export type GetCatalogItemsMethod<T> = (params: {
    filter?: { searchWord?: string };
    sorting?: Sorting;
    paging?: PagingOptions;
}) => Promise<Catalog<T>>;
