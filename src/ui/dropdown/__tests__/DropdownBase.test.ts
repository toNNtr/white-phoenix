import TestDropdownBase from "./TestDropdownBase.vue";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-vue";

test("creates dropdown", async () => {
    const screen = await render(TestDropdownBase);

    await expect(screen.locator.getByTestId("button")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("button")).toHaveTextContent("Open");

    await expect(screen.locator.getByTestId("body")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("body")).toHaveTextContent("You can't see me");
    await expect(screen.locator.getByTestId("body")).not.toBeVisible();
});

test("opens dropdown", async () => {
    const screen = await render(TestDropdownBase, {
        props: {
            fnClick(dropdownRef) {
                dropdownRef.value?.open();
            },
        },
    });
    const button = await screen.locator.getByTestId("button");

    await expect(screen.locator.getByTestId("body")).not.toBeVisible();
    await button.click();
    await expect(screen.locator.getByTestId("body")).toBeVisible();
});

test("closes dropdown", async () => {
    const screen = await render(TestDropdownBase, {
        props: {
            fnClick(dropdownRef) {
                dropdownRef.value?.close();
            },
            fnMounted(dropdownRef) {
                dropdownRef.value?.open();
            },
        },
    });
    const button = await screen.locator.getByTestId("button");

    await expect(screen.locator.getByTestId("body")).toBeVisible();
    await button.click();
    await expect(screen.locator.getByTestId("body")).not.toBeVisible();
});

test("toggles dropdown", async () => {
    const screen = await render(TestDropdownBase, {
        props: {
            fnClick(dropdownRef) {
                dropdownRef.value?.toggle();
            },
        },
    });
    const button = await screen.locator.getByTestId("button");

    await expect(screen.locator.getByTestId("body")).not.toBeVisible();
    await button.click();
    await expect(screen.locator.getByTestId("body")).toBeVisible();
    await button.click();
    await expect(screen.locator.getByTestId("body")).not.toBeVisible();
});

test("destroys on unmount", async () => {
    const callback = vi.fn();
    const screen = await render(TestDropdownBase, {
        props: {
            fnClick(dropdownRef) {
                dropdownRef.value?.close();
            },
            fnMounted(dropdownRef) {
                dropdownRef.value?.popup.onBeforeDestroyed(callback);
            },
        },
    });

    await screen.unmount();
    await expect(callback).toHaveBeenCalledOnce();
});
