import CardMedium from "../CardMedium.vue";
import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import TestCardMediumComponent from "./TestCardMediumComponent.vue";

test("creates card with default props", async () => {
    const screen = await render(CardMedium);

    await expect(screen.container.firstChild).toHaveClass("card", "card_m");
});

test("creates card with provided props", async () => {
    const screen = await render(CardMedium, {
        props: {
            title: "Card for testing",
            description: "Fascinating card description",
        },
    });

    await expect(screen.locator.getByLabelText("Card for testing")).toBeInTheDocument();
    await expect(screen.locator.getByRole("heading")).toHaveTextContent("Card for testing");
    await expect(screen.locator).toHaveTextContent("Fascinating card description");
});

test("fills up slots", async () => {
    const screen = await render(CardMedium, {
        slots: {
            headerTop: `<button data-testid="headerTop">Some action</button>`,
            header: `<a data-testid="header">Card header in slot</a>`,
            description: `<p data-testid="description">Astonishing card description</p>`,
            overlay: `<div data-testid="overlay">Is anyone can see this?</div>`,
        },
    });

    await expect(screen.locator.getByTestId("headerTop")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("headerTop")).toHaveTextContent("Some action");
    await expect(screen.locator.getByTestId("header")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("header")).toHaveTextContent("Card header in slot");
    await expect(screen.locator.getByTestId("description")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("description")).toHaveTextContent(
        "Astonishing card description",
    );
    await expect(screen.locator.getByTestId("overlay")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("overlay")).toHaveTextContent(
        "Is anyone can see this?",
    );
});

test("separates header and aria label", async () => {
    const screen = await render(CardMedium, {
        props: {
            title: "It's just for label",
        },
        slots: {
            header: `<a data-testid="header">Card header in slot</a>`,
        },
    });

    await expect(screen.locator.getByTestId("header")).toHaveTextContent("Card header in slot");
    await expect(screen.locator.getByRole("heading")).not.toBeInTheDocument();
    await expect(screen.locator.getByLabelText("It's just for label")).toBeInTheDocument();
});

test("toggles overlay visibility", async () => {
    const screen = await render(TestCardMediumComponent);
    const button = await screen.locator.getByRole("button");
    const overlay = await screen.locator.getByTestId("overlay");

    expect(overlay).not.toBeVisible();
    await button.click();
    expect(overlay).toBeVisible();
    await button.click();
    expect(overlay).not.toBeVisible();
});
