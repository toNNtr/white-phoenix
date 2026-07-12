import BaseButton from "../BaseButton.vue";
import TestBaseButtonComponent from "./TestBaseButtonComponent.vue";
import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

test("creates button with default props", async () => {
    const screen = await render(BaseButton);

    await expect(screen.getByRole("button")).toBeInTheDocument();
    await expect(screen.getByRole("button")).toHaveClass("button", "button_primary");
    await expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    await expect(screen.getByRole("button")).toHaveTextContent("");
});

test("creates button with specific props", async () => {
    const screen = await render(BaseButton, {
        props: {
            text: "Test content",
            type: "submit",
            variety: "outline",
        },
    });

    await expect(screen.getByRole("button")).toBeInTheDocument();
    await expect(screen.getByRole("button")).toHaveClass("button", "button_outline");
    await expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    await expect(screen.getByRole("button")).toHaveTextContent("Test content");
});

test("inserts slot", async () => {
    const screen = await render(BaseButton, {
        props: {
            text: "This must not be shown",
        },
        slots: {
            default: "Content of default slot",
        },
    });

    await expect(screen.getByRole("button")).toHaveTextContent(/^Content of default slot$/);
});

test("replaces button with provided element", async () => {
    const screen = await render(BaseButton, {
        props: {
            replace: true,
            text: "This must not be shown",
        },
        slots: {
            default: `<a data-testid="replaced_a">Follow link</a>`,
        },
    });

    await expect(screen.getByRole("button")).not.toBeInTheDocument();
    await expect(screen.getByTestId("replaced_a")).toBeInTheDocument();
    await expect(screen.locator).toHaveTextContent(/^Follow link$/);
    await expect(screen.container.firstChild).toHaveClass("button-replace", "button_primary");
});

test("emits click once", async () => {
    const screen = await render(TestBaseButtonComponent);

    await expect(screen.getByRole("button")).toBeInTheDocument();
    await expect(screen.getByTestId("clicked-count")).toBeInTheDocument();
    await expect(screen.getByTestId("clicked-count")).toHaveTextContent(/^0$/);

    await screen.getByRole("button").click();

    await expect(screen.getByTestId("clicked-count")).toHaveTextContent(/^1$/);
});
