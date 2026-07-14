import ButtonGroup from "../ButtonGroup.vue";
import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

test("creates group with default settings", async () => {
    const screen = await render(ButtonGroup);

    await expect(screen.container.firstChild).toBeInstanceOf(HTMLDivElement);
    await expect(screen.container.firstChild).toHaveClass("button-group");
});

test("creates group with provided element", async () => {
    const screen = await render(ButtonGroup, {
        props: {
            element: "nav",
        },
    });

    await expect(screen.getByRole("navigation")).toBeInTheDocument();
});

test("puts elements in default slot", async () => {
    const screen = await render(ButtonGroup, {
        slots: {
            default: `<button data-testid="slotted-button">Press me!</button>`,
        },
    });

    await expect(screen.getByTestId("slotted-button")).toBeInTheDocument();
    await expect(screen.getByTestId("slotted-button")).toHaveRole("button");
    await expect(screen.locator).toHaveTextContent("Press me!");
});
