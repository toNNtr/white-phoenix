export interface HttpGlobalProperty {
    fetch: <T = any>(
        input: RequestInfo | URL,
        init?: RequestInit,
    ) => Promise<Omit<Response, "json"> & { json(): Promise<T> }>;
    mock: (location: string, options?: MockOptions) => void;
    base?: string | null;
}

export type ApiSetup<T = any> = (options: { http?: HttpGlobalProperty }) => T;

export type MockData =
    | string
    | Record<string, any>
    | ((request: {
          url: string;
          searchParams: URLSearchParams;
          method: string;
          headers: Record<string, string>;
          body?: BodyInit | null;
      }) => string | Record<string, any>);

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
    headers?: HeadersInit;
}

declare module "vue" {
    interface ComponentCustomProperties {
        $http: HttpGlobalProperty;
    }
}
