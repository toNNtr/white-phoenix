import http, { httpKey } from "..";
import { test, expect, vi } from "vitest";
import { defineComponent, inject, onMounted, ref } from "vue";
import { render } from "vitest-browser-vue";

test("provides app level inject", async () => {
    const screen = await render(
        defineComponent({
            template: '<div data-testid="inject">{{ httpInstance.base }}</div>',
            setup() {
                // @ts-expect-error
                const httpInstance = inject(httpKey, { base: "Nope" });
                return { httpInstance };
            },
        }),
        {
            global: { plugins: [[http, { base: "I'm here" }]] },
        },
    );

    await expect(screen.getByTestId("inject")).toHaveTextContent("I'm here");
});

test("mocks requests with raw data", async () => {
    const screen = await render(
        defineComponent({
            template: `
                <div data-testid="mock">{{ testData }}</div>
            `,
            setup() {
                const httpInstance = inject(httpKey);
                const testData = ref("");

                if (!httpInstance) {
                    throw new Error("Http not provided.");
                }

                httpInstance.mock("/test-data", {
                    data: "Hello!",
                    method: "get",
                    delay: 50,
                });

                onMounted(async () => {
                    if (!httpInstance) {
                        throw new Error("Http not provided.");
                    }

                    const response = await httpInstance.fetch("/test-data", { method: "get" });

                    if (!response.ok) {
                        throw new Error("Response isn`t OK.");
                    }

                    const data = await response.text();

                    testData.value = data;
                });

                return { testData };
            },
        }),
        {
            global: { plugins: [[http, { base: "http://localhost/", mockRequests: true }]] },
        },
    );

    await vi.waitFor(
        () => {
            expect(screen.getByTestId("mock")).toHaveTextContent("Hello!");
        },
        { timeout: 150 },
    );
});

test("mocks requests with callback", async () => {
    const screen = await render(
        defineComponent({
            template: `
                <div data-testid="mock">{{ testData }}</div>
            `,
            setup() {
                const httpInstance = inject(httpKey);
                const testData = ref("");

                if (!httpInstance) {
                    throw new Error("Http not provided.");
                }

                httpInstance.mock("/test-data", {
                    data: (request) => JSON.stringify(request),
                    method: "get",
                    delay: 50,
                });

                onMounted(async () => {
                    if (!httpInstance) {
                        throw new Error("Http not provided.");
                    }

                    const response = await httpInstance.fetch("/test-data", {
                        method: "get",
                        headers: {
                            "Content-Type": "applitestation/teston",
                            "x-auth-id": "not your business",
                        },
                        body: "para-para-params",
                    });

                    if (!response.ok) {
                        throw new Error("Response isn`t OK.");
                    }

                    const data = await response.text();

                    testData.value = data;
                });

                return { testData };
            },
        }),
        {
            global: { plugins: [[http, { base: "http://localhost/", mockRequests: true }]] },
        },
    );

    await vi.waitFor(
        () => {
            expect(screen.getByTestId("mock")).toHaveTextContent(
                `{"url":"/test-data","searchParams":{},"method":"get","headers":{"Content-Type":"applitestation/teston","x-auth-id":"not your business"},"body":"para-para-params"}`,
            );
        },
        { timeout: 150 },
    );
});

test("mocks all request methods when mock method not provided", async () => {
    const screen = await render(
        defineComponent({
            template: `
                <div data-testid="mock1">{{ testData1 }}</div>
                <div data-testid="mock2">{{ testData2 }}</div>
            `,
            setup() {
                const httpInstance = inject(httpKey);
                const testData1 = ref("");
                const testData2 = ref("");

                if (!httpInstance) {
                    throw new Error("Http not provided.");
                }

                httpInstance.mock("/test-data", {
                    data: (request) => JSON.stringify(request),
                    delay: 50,
                });

                async function testFetch(init: RequestInfo, info: RequestInit) {
                    if (!httpInstance) {
                        throw new Error("Http not provided.");
                    }

                    const response = await httpInstance.fetch(init, info);

                    if (!response.ok) {
                        throw new Error("Response isn`t OK.");
                    }

                    return await response.text();
                }

                onMounted(async () => {
                    [testData1.value, testData2.value] = await Promise.all([
                        testFetch("/test-data", {
                            method: "get",
                        }),
                        testFetch("/test-data", {
                            method: "post",
                        }),
                    ]);
                });

                return { testData1, testData2 };
            },
        }),
        {
            global: {
                plugins: [
                    [
                        http,
                        {
                            mockRequests: true,
                        },
                    ],
                ],
            },
        },
    );

    await vi.waitFor(
        () => {
            expect(screen.getByTestId("mock1")).toHaveTextContent(
                `{"url":"/test-data","searchParams":{},"method":"get","headers":{}}`,
            );
            expect(screen.getByTestId("mock2")).toHaveTextContent(
                `{"url":"/test-data","searchParams":{},"method":"post","headers":{}}`,
            );
        },
        { timeout: 150 },
    );
});

test("inserts global headers for each request", async () => {
    const screen = await render(
        defineComponent({
            template: `
                <div data-testid="mock1">{{ testData1 }}</div>
                <div data-testid="mock2">{{ testData2 }}</div>
            `,
            setup() {
                const httpInstance = inject(httpKey);
                const testData1 = ref("");
                const testData2 = ref("");

                if (!httpInstance) {
                    throw new Error("Http not provided.");
                }

                httpInstance.mock("/test-1-data", {
                    data: (request) => JSON.stringify(request),
                    method: "get",
                    delay: 50,
                });

                httpInstance.mock("/test-2-data", {
                    data: (request) => JSON.stringify(request),
                    method: "get",
                    delay: 50,
                });

                async function testFetch(init: RequestInfo, info: RequestInit) {
                    if (!httpInstance) {
                        throw new Error("Http not provided.");
                    }

                    const response = await httpInstance.fetch(init, info);

                    if (!response.ok) {
                        throw new Error("Response isn`t OK.");
                    }

                    return await response.text();
                }

                onMounted(async () => {
                    [testData1.value, testData2.value] = await Promise.all([
                        testFetch("/test-1-data", {
                            method: "get",
                            headers: {
                                "Content-Type": "applitestation/teston",
                            },
                        }),
                        testFetch("/test-2-data", {
                            method: "get",
                            headers: {
                                "Content-Type": "applitestation/x-www-form-testencoded",
                            },
                        }),
                    ]);
                });

                return { testData1, testData2 };
            },
        }),
        {
            global: {
                plugins: [
                    [
                        http,
                        {
                            mockRequests: true,
                            headers: { "x-auth-id": "not your business" },
                        },
                    ],
                ],
            },
        },
    );

    await vi.waitFor(
        () => {
            expect(screen.getByTestId("mock1")).toHaveTextContent(
                `{"url":"/test-1-data","searchParams":{},"method":"get","headers":{"x-auth-id":"not your business","Content-Type":"applitestation/teston"}}`,
            );
            expect(screen.getByTestId("mock2")).toHaveTextContent(
                `{"url":"/test-2-data","searchParams":{},"method":"get","headers":{"x-auth-id":"not your business","Content-Type":"applitestation/x-www-form-testencoded"}}`,
            );
        },
        { timeout: 150 },
    );
});
