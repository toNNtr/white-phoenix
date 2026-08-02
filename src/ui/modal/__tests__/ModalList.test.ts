import TestModalList from "./TestModalList.vue";
import TestModal from "./TestModal.vue";
import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import { popupList } from "@/api/popup";
import { useModal } from "../useModal.js";

afterEach(() => {
    popupList.forEach((elem) => elem.destroy());
});

test("doesn't create element when empty", async () => {
    const screen = await render(TestModalList);

    await expect(screen.locator.getByTestId("list")).not.toBeInTheDocument();
});

test("opens modal", async () => {
    const modal = useModal(TestModal);
    const screen = await render(TestModalList, {
        props: {
            fnClick() {
                modal.open();
            },
        },
    });

    await expect(screen.locator.getByTestId("modal")).not.toBeInTheDocument();
    await screen.locator.getByTestId("button").click();
    await expect(screen.locator.getByTestId("modal")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("opened-number")).toHaveTextContent(/^1$/);
});

test("closes modal", async () => {
    const modal = useModal(TestModal);
    modal.open();
    const screen = await render(TestModalList, {
        props: {
            fnInsideClick() {
                modal.close();
            },
        },
    });

    const button = await screen.locator.getByTestId("modal-button");

    await expect(screen.locator.getByTestId("modal")).toBeInTheDocument();
    await button.click();
    await expect(screen.locator.getByTestId("modal")).not.toBeInTheDocument();
    await expect(screen.locator.getByTestId("opened-number")).toHaveTextContent(/^0$/);
});

test("closes modal if another with same type opened", async () => {
    const modal1 = useModal(TestModal, "test-modal");
    modal1.open();
    const modal2 = useModal(TestModal, "test-modal");

    const screen = await render(TestModalList, {
        props: {
            fnInsideClick() {
                modal2.open();
            },
        },
    });

    const button = await screen.locator.getByTestId("modal-button");

    await expect(screen.locator.getByTestId("modal")).toBeInTheDocument();
    await button.click();
    await expect(screen.locator.getByTestId("modal")).toBeInTheDocument();
    await expect(screen.locator.getByTestId("opened-number")).toHaveTextContent(/^1$/);
    expect(modal1.isOpenedRef.value).toBe(false);
    expect(modal2.isOpenedRef.value).toBe(true);
});
