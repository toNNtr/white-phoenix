import BaseCatalog from "../BaseCatalog.vue";
import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import { h } from "vue";

test("creates base catalog with provited props", async () => {
    const screen = render(BaseCatalog, {
        props: {
            layout: "vertical",
            async getItems() {
                return {
                    items: [],
                };
            },
        },
    });

    await expect(screen.container.firstChild).toHaveClass("catalog", "catalog_vertical");
});

test("fills up with provided items", async () => {
    const screen = await render(BaseCatalog, {
        props: {
            async getItems() {
                return {
                    items: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
                };
            },
        },
    });

    await expect(screen.container.querySelector(".catalog__item")).toBeInTheDocument();
    await expect(screen.container.querySelector(".catalog__body")?.children.length).toBe(6);
});

test("fills up with default slot", async () => {
    const screen = await render(BaseCatalog, {
        props: {
            async getItems() {
                return {
                    items: [{ id: 0 }, { id: 1 }, { id: 2 }],
                };
            },
        },
        slots: {
            default: `<span data-testid="slot">Card</span>`,
        },
    });

    await expect(screen.getByTestId("slot").length).toBe(3);
});

test("fills up with loader slot", async () => {
    const screen = await render(BaseCatalog, {
        props: {
            getItems() {
                return new Promise((resolve) => {
                    // Never resolves
                });
            },
        },
        slots: {
            loader: `<span data-testid="slot">Loader</span>`,
        },
    });

    await expect(screen.getByTestId("slot").element().textContent).toBe("Loader");
});

test("fills up with error slot", async () => {
    const screen = await render(BaseCatalog, {
        props: {
            async getItems() {
                throw new Error("Error");
            },
        },
        slots: {
            error: `<span data-testid="slot">Error</span>`,
        },
    });

    await expect(screen.getByTestId("slot").element().textContent).toBe("Error");
});

test("passes all item props in to the slot", async () => {
    const screen = await render(BaseCatalog<{ id: number; title: string }>, {
        props: {
            async getItems() {
                return {
                    items: [
                        { id: 0, title: "First" },
                        { id: 1, title: "Second" },
                        { id: 2, title: "Third" },
                    ],
                };
            },
        },
        slots: {
            default({ item }) {
                return h("span", { "data-testid": `card-${item.id}` }, item.title);
            },
        },
    });

    await expect(screen.locator.getByTestId("card-0")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("card-0")).toHaveTextContent("First");
    await expect(screen.locator.getByTestId("card-1")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("card-1")).toHaveTextContent("Second");
    await expect(screen.locator.getByTestId("card-2")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("card-2")).toHaveTextContent("Third");
});

test("shows loader while waiting getItems", () => {
    let res: (value: { items: { id: number }[] }) => void | undefined;
    render(BaseCatalog, {
        props: {
            getItems() {
                return new Promise((resolve) => {
                    res = resolve;
                });
            },
        },
    })
        .then((screen) => {
            return expect(screen.locator).toHaveTextContent("Загрузка");
        })
        .then(() => res?.({ items: [] }));
});

test("hides loader after resolving getItems", async () => {
    const screen = await render(BaseCatalog, {
        props: {
            async getItems() {
                return { items: [] };
            },
        },
    });

    await expect(screen.locator).not.toHaveTextContent("Загрузка");
});

test("creates items from getItems result", async () => {
    const screen = await render(BaseCatalog<{ id: number; title: string }>, {
        props: {
            async getItems() {
                return {
                    items: [
                        { id: 0, title: "First" },
                        { id: 1, title: "Second" },
                        { id: 2, title: "Third" },
                    ],
                };
            },
        },
        slots: {
            default({ item }) {
                return h("span", { "data-testid": `card-${item.id}` }, item.title);
            },
        },
    });

    await expect(screen.locator.getByTestId("card-0")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("card-0")).toHaveTextContent("First");
    await expect(screen.locator.getByTestId("card-1")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("card-1")).toHaveTextContent("Second");
    await expect(screen.locator.getByTestId("card-2")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("card-2")).toHaveTextContent("Third");
});
