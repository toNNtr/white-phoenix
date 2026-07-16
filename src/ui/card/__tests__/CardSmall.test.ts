import CardSmall from "../CardSmall.vue";
import TestCardSmallComponent from "./TestCardSmallComponent.vue";
import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

test("creates card with default props", async () => {
    const screen = await render(CardSmall);

    await expect(screen.container.firstChild).toHaveClass("card", "card_s");
});

test("creates card with provided props", async () => {
    const screen = await render(CardSmall, {
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
    const screen = await render(CardSmall, {
        slots: {
            start: `<h3 data-testid="start">Title in a slot</h3>`,
            center: `<p data-testid="center">Card description in a slot</p>`,
            end: `<button data-testid="end">Open overlay</button>`,
            overlay: `<span data-testid="overlay">It's hidden behind overlay</span>`,
        },
    });

    await expect(screen.locator.getByTestId("start")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("start")).toHaveTextContent("Title in a slot");
    await expect(screen.locator.getByTestId("center")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("center")).toHaveTextContent(
        "Card description in a slot",
    );
    await expect(screen.locator.getByTestId("end")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("end")).toHaveTextContent("Open overlay");
    await expect(screen.locator.getByTestId("overlay")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("overlay")).toHaveTextContent(
        "It's hidden behind overlay",
    );
});

test("separates header and aria label", async () => {
    const screen = await render(CardSmall, {
        props: { title: "This goes to the label" },
        slots: { start: `<a data-testid="start">And this to heading</a>` },
    });

    await expect(screen.locator.getByTestId("start")).toHaveTextContent("And this to heading");
    await expect(screen.locator.getByRole("start")).not.toBeInTheDocument();
    await expect(screen.locator.getByLabelText("This goes to the label")).toBeInTheDocument();
});

test("toggles overlay visibility", async () => {
    const screen = await render(TestCardSmallComponent);
    const button = await screen.locator.getByRole("button");
    const overlay = await screen.locator.getByTestId("overlay");

    expect(overlay).not.toBeVisible();
    await button.click();
    expect(overlay).toBeVisible();
    await button.click();
    expect(overlay).not.toBeVisible();
});
