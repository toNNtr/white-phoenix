import { hasInjectionContext, inject, type InjectionKey, type ObjectPlugin } from "vue";
import type { ApiSetup, HttpGlobalProperty, HttpPluginOptions, Mock } from "./types";
import { mergeObjects } from "@/api/helpers";

export const httpKey = Symbol() as InjectionKey<HttpGlobalProperty>;

export const createHttp: (createOptions?: HttpPluginOptions) => ObjectPlugin<[HttpPluginOptions?]> =
    function (createOptions = {}) {
        return {
            install(app, pluginOptions) {
                const options = mergeObjects<HttpPluginOptions>(
                    {
                        base: window.location.origin ?? "",
                        headers: {},
                        mockRequests: false,
                    },
                    createOptions,
                    pluginOptions ?? {},
                );
                options.headers = sealHeaders(
                    createOptions.headers ?? {},
                    pluginOptions?.headers ?? {},
                );
                const mocks: Mock[] = [];

                const http: HttpGlobalProperty = {
                    fetch(input, init) {
                        const headers = sealHeaders(options.headers ?? {}, init?.headers ?? {});

                        if (typeof input === "string") {
                            input = new URL(input, options.base);
                        }

                        if (options.mockRequests) {
                            let mockLocation: string = "";
                            let mockSearchParams: URLSearchParams;

                            if (input instanceof URL) {
                                mockSearchParams = input.searchParams;
                                mockLocation = input.pathname;
                            } else if (input instanceof Request) {
                                const url = new URL(input.url);
                                mockSearchParams = url.searchParams;
                                mockLocation = url.pathname;
                            }

                            const mock = mocks.find(
                                (elem) =>
                                    elem.location === mockLocation &&
                                    (!elem.method ||
                                        elem.method === (init?.method?.toLowerCase() ?? "get")),
                            );

                            if (mock) {
                                return new Promise((resolve, reject) =>
                                    setTimeout(() => {
                                        let body: string | Record<string, any> | null = null;

                                        try {
                                            if (!mock.data) {
                                                body = null;
                                            } else if (typeof mock.data === "string") {
                                                body = mock.data;
                                            } else if (typeof mock.data === "function") {
                                                body = mock.data({
                                                    url: mockLocation,
                                                    searchParams: mockSearchParams,
                                                    method: init?.method ?? "GET",
                                                    headers,
                                                    body: init?.body,
                                                });
                                            }

                                            if (body && typeof body === "object") {
                                                body = JSON.stringify(body);
                                            }

                                            resolve(
                                                new Response(body, {
                                                    status: body ? 200 : 204,
                                                    statusText: body ? "OK" : "No Content",
                                                }),
                                            );
                                        } catch (error) {
                                            reject(error);
                                        }
                                    }, mock?.delay ?? 0),
                                );
                            }
                        }

                        return fetch(input, init);
                    },
                    mock(location, options?) {
                        const newMock: Mock = {
                            location,
                            method: options?.method?.toLowerCase(),
                            data: options?.data,
                            delay: options?.delay,
                        };
                        const existingMockIndex = mocks.findIndex(
                            (elem) =>
                                elem.location === location && elem?.method === options?.method,
                        );

                        if (existingMockIndex < 0) {
                            mocks.push(newMock);
                        } else {
                            mocks.splice(existingMockIndex, 1, newMock);
                        }
                    },
                    base: options.base,
                    options,
                };

                app.config.globalProperties.$http = http;
                app.provide(httpKey, http);
            },
        };
    };

export function defineApi<T = any>(name: string, apiSetup: ApiSetup<T>) {
    function useApi() {
        let http: HttpGlobalProperty | undefined;

        if (!hasInjectionContext()) {
            throw new Error("Must be called in Vue-context.");
        }

        http = inject(httpKey);

        if (!http) {
            throw new Error("Unable to inject http plugin instance.");
        }

        return apiSetup({ http });
    }

    return useApi;
}

function sealHeaders(...headersInitArr: HeadersInit[]): Record<string, string> {
    let headers: Record<string, string> = {};

    headersInitArr.forEach((headersInit) => {
        if (Array.isArray(headersInit)) {
            headers = {
                ...headers,
                ...headersInit.reduce<Record<string, string>>((acc, current) => {
                    acc[current[0]] = current[1];
                    return acc;
                }, {}),
            };
        } else if (headersInit instanceof Headers) {
            headers = {
                ...headers,
                ...Object.fromEntries(headersInit.entries()),
            };
        } else {
            headers = {
                ...headers,
                ...headersInit,
            };
        }
    });

    return headers;
}
