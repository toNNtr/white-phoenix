import { usePopup, popupList } from "../popup";
import { expect, test as baseTest, vi, afterEach } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-vue";
import { useRenderDivs } from "./render";
import TestPopupComponent from "./TestPopupComponent.vue";

afterEach(() => {
    popupList.forEach((popup) => popup.destroy());
});

const test = baseTest.extend("render", ({}, { onCleanup }) => {
    const renderDivs = useRenderDivs();

    onCleanup(() => {
        renderDivs.cleanup();
    });

    return {
        divs: renderDivs.render,
    };
});

test("closes when clicked outside of element assigned during creation", async ({ render }) => {
    render.divs();

    const div_1 = page.getByTestId("div_1");
    const div_2 = page.getByTestId("div_2");
    const div_1Element = div_1.element();
    await expect.element(div_1).toBeInTheDocument();
    await expect.element(div_2).toBeInTheDocument();

    if (!(div_1Element instanceof HTMLElement)) {
        throw "div_1 must be of type HTMLElement";
    }

    const popup = usePopup({ htmlElement: div_1Element, isOpened: true });

    await div_2.click();
    expect(popup.isOpened).toBe(false);
});

test("closes when clicked outside of element assigned after creation", async ({ render }) => {
    render.divs();

    const div_1 = page.getByTestId("div_1");
    const div_2 = page.getByTestId("div_2");
    const div_1Element = div_1.element();
    await expect.element(div_1).toBeInTheDocument();
    await expect.element(div_2).toBeInTheDocument();

    if (!(div_1Element instanceof HTMLElement)) {
        throw "div_1 must be of type HTMLElement";
    }

    const popup = usePopup({ isOpened: true });
    popup.assignElement(div_1Element);

    await div_2.click();
    expect(popup.isOpened).toBe(false);
});

baseTest("call computed when isOpenedRef updated", async () => {
    const popup = usePopup();
    const callback = vi.fn();
    const screen = await render(TestPopupComponent, {
        props: {
            popup,
            callback,
        },
    });

    for (let i = 0; i < 5; i++) {
        await screen.getByRole("button").click();
    }

    await expect(screen.getByTestId("state")).toHaveTextContent("Opened");
    await expect(screen.getByTestId("invertedState")).toHaveTextContent("Closed");
    expect(callback).toHaveBeenCalledTimes(6);
});
