import BaseCatalog from "../BaseCatalog.vue";
import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import { h } from "vue";

test("creates base catalog with default props", async () => {
    const screen = render(BaseCatalog);

    await expect(screen.locator.getByRole("heading")).toHaveTextContent(/^$/);
    await expect(screen.container.firstChild).toHaveClass("catalog", "catalog_grid");
    await expect(screen.locator).not.toHaveTextContent("Загрузка");
    await expect(screen.container.querySelector(".catalog__body")?.innerHTML).toMatchInlineSnapshot(
        `""`,
    );
});

test("creates base catalog with provited props", async () => {
    const screen = render(BaseCatalog, {
        props: { layout: "horizontal", title: "Catalog title" },
    });

    await expect(screen.locator.getByRole("heading")).toHaveTextContent("Catalog title");
    await expect(screen.container.firstChild).toHaveClass("catalog", "catalog_horizontal");
});

test("fills up with provided items", async () => {
    const screen = await render(BaseCatalog, {
        props: { items: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }] },
    });

    await expect(screen.container.querySelector(".catalog__card")).toBeInTheDocument();
    await expect(screen.container.querySelector(".catalog__body")?.children.length).toBe(6);
});

test("fills up with provided slots", async () => {
    const screen = await render(BaseCatalog, {
        props: { items: [{ id: 0 }, { id: 1 }, { id: 2 }] },
        slots: {
            header: `<h2 data-testid="header">Catalog title</h2>`,
            card: `<span data-testid="slot">Card</span>`,
        },
    });

    await expect(screen.locator.getByTestId("header")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("header")).toHaveRole("heading");
    await expect(screen.locator.getByTestId("header")).toHaveTextContent("Catalog title");

    await expect(screen.getByTestId("slot").length).toBe(3);
});

test("passes all item props in to the slot", async () => {
    const screen = await render(BaseCatalog<{ id: number; title: string }>, {
        props: {
            items: [
                { id: 0, title: "First" },
                { id: 1, title: "Second" },
                { id: 2, title: "Third" },
            ],
        },
        slots: {
            header: `<h2 data-testid="header">Catalog title</h2>`,
            card({ item }) {
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
    let res: (value: { id: number }[]) => void | undefined;
    render(BaseCatalog, {
        props: {
            getItems(params) {
                return new Promise((resolve) => {
                    res = resolve;
                });
            },
        },
    })
        .then((screen) => {
            return expect(screen.locator).toHaveTextContent("Загрузка");
        })
        .then(() => res?.([]));
});

test("hides loader after resolving getItems", async () => {
    const screen = await render(BaseCatalog, {
        props: {
            getItems(params) {
                return Promise.resolve([]);
            },
        },
    });

    await expect(screen.locator).not.toHaveTextContent("Загрузка");
});

test("creates items from getItems result", async () => {
    const screen = await render(BaseCatalog<{ id: number; title: string }>, {
        props: {
            getItems() {
                return Promise.resolve([
                    { id: 0, title: "First" },
                    { id: 1, title: "Second" },
                    { id: 2, title: "Third" },
                ]);
            },
        },
        slots: {
            header: `<h2 data-testid="header">Catalog title</h2>`,
            card({ item }) {
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
