import { expect, test as baseTest, vi } from "vitest";
import { page } from "vitest/browser";
import { useHandleClickOutside } from "../helpers";
import { useRenderDivs, useRenderDivsWithButtons } from "./render";

const test = baseTest.extend("render", ({}, { onCleanup }) => {
    const renderDivs = useRenderDivs();
    const renderDivsWithButtons = useRenderDivsWithButtons();

    onCleanup(() => {
        renderDivs.cleanup();
        renderDivsWithButtons.cleanup();
    });

    return {
        divs: renderDivs.render,
        divsWithButtons: renderDivsWithButtons.render,
    };
});

test("invokes callback with event argument", async ({ render }) => {
    render.divsWithButtons();

    const container = page.getByTestId("container");
    const div_1 = container.getByTestId("div_1");
    const div_2 = container.getByTestId("div_2");

    await expect.element(container).toBeInTheDocument();
    await expect.element(div_1).toBeInTheDocument();
    await expect.element(div_2).toBeInTheDocument();

    const callback = vi.fn();
    const handler = useHandleClickOutside(div_1.element(), callback);
    const containerElement = container.element();
    if (!("accessKey" in containerElement)) {
        throw "Container element must be of type HTMLElement";
    }

    containerElement.addEventListener("click", handler);

    await div_2.click({ position: { x: 1, y: 1 } });
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ type: "click", target: div_2.element() }),
    );
});

test("doesn't invokes callback when clicked inside", async ({ render }) => {
    render.divsWithButtons();

    const container = page.getByTestId("container");
    const div_1 = container.getByTestId("div_1");
    const button = div_1.getByRole("button");

    await expect.element(container).toBeInTheDocument();
    await expect.element(div_1).toBeInTheDocument();
    await expect.element(button).toBeInTheDocument();

    const callback = vi.fn();
    const handler = useHandleClickOutside(div_1.element(), callback);
    const containerElement = container.element();
    if (!("accessKey" in containerElement)) {
        throw "Container element must be of type HTMLElement";
    }

    containerElement.addEventListener("click", handler);

    await button.click();
    await div_1.click();
    expect(callback).not.toHaveBeenCalled();
});
