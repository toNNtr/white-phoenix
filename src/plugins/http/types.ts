export interface HttpGlobalProperty {
    fetch: <T = any>(
        input: RequestInfo | URL,
        init?: RequestInit,
    ) => Promise<Omit<Response, "json"> & { json(): Promise<T> }>;
    mock: (location: string, options?: MockOptions) => void;
    base?: string | null;
    options: HttpPluginOptions;
}

export type ApiSetup<T = any> = (options: { http: HttpGlobalProperty }) => T;

export type MockDataFunction = (request: {
    url: string;
    searchParams: URLSearchParams;
    method: string;
    headers: Record<string, string>;
    body?: BodyInit | null;
}) => string | Record<string, any>;

export type MockData = string | Record<string, any> | MockDataFunction;

export interface MockOptions {
    data?: MockData;
    method?: string;
    delay?: number;
}

export interface Mock {
    location: string;
    method?: string;
    data?: MockData;
    delay?: number;
}

export interface HttpPluginOptions {
    /** Use mocked requests */
    mockRequests?: boolean;
    /** Base part of URLs */
    base?: string;
    /** Records to be added to headers for every request */
    headers?: Record<string, string> | null;
}

declare module "vue" {
    interface ComponentCustomProperties {
        $http: HttpGlobalProperty;
    }
}
