import {
    closeAll,
    closeAllExcept,
    ECloseReason,
    usePopup,
    popupList,
    type PopupBase,
} from "../popup/popupBase";
import { expect, test, afterEach, vi, onTestFinished, describe } from "vitest";

let popup: PopupBase<{ data: { id: number; title: string } }> | null;

afterEach(() => {
    if (popup) {
        popup.destroy();
        popup = null;
    }

    popupList.splice(0);
});

describe("Popup core", () => {
    test("creates new popup with default props", () => {
        popup = usePopup();

        expect(popup).toMatchSnapshot({
            id: expect.stringMatching(/.+/),
        });
    });

    test("creates new popup with provided props", () => {
        popup = usePopup({ isOpened: true, type: "popup_for_test_please_work" });

        expect(popup).toMatchSnapshot({
            id: expect.stringMatching(/.+/),
        });
    });

    test("clears it's state on destroy", () => {
        popup = usePopup({ isOpened: true });
        popup.destroy();

        expect(popup).toMatchSnapshot({
            id: expect.stringMatching(/.+/),
        });
    });

    test("can be destroyed multiple times", () => {
        popup = usePopup();
        popup.destroy();
        popup.destroy();
    });

    test("changes it's state on open", () => {
        popup = usePopup();
        popup.open();

        expect(popup.isOpened).toBe(true);
    });

    test("changes it's state on close", () => {
        popup = usePopup({ isOpened: true });
        popup.close();

        expect(popup.isOpened).toBe(false);
    });

    test("changes it's state on toggle to open", () => {
        popup = usePopup();
        popup.toggle();

        expect(popup.isOpened).toBe(true);
    });

    test("changes it's state on toggle to close", () => {
        popup = usePopup({ isOpened: true });
        popup.toggle();

        expect(popup.isOpened).toBe(false);
    });

    test("invokes callback once on open", () => {
        popup = usePopup();

        const callback = vi.fn();
        popup.onOpened(callback);
        popup.open();

        expect(callback).toHaveBeenCalledOnce();
    });

    test("invokes callback once on close", () => {
        popup = usePopup({ isOpened: true });

        const callback = vi.fn();
        popup.onClosed(callback);
        popup.close();

        expect(callback).toHaveBeenCalledOnce();
    });

    test("invokes callbacks on each toggle", () => {
        popup = usePopup();

        const callbackOpen = vi.fn();
        const callbackClose = vi.fn();
        popup.onOpened(callbackOpen);
        popup.onClosed(callbackClose);
        popup.toggle();
        popup.toggle();

        expect(callbackOpen).toHaveBeenCalledOnce();
        expect(callbackClose).toHaveBeenCalledOnce();
    });

    test("invokes callback on any state change", () => {
        popup = usePopup();

        const callback = vi.fn();
        popup.onStateChanged(callback);

        popup.open();
        expect(callback).toHaveBeenCalledOnce();

        popup.close();
        expect(callback).toHaveBeenCalledTimes(2);

        popup.toggle();
        expect(callback).toHaveBeenCalledTimes(3);

        popup.toggle();
        expect(callback).toHaveBeenCalledTimes(4);
    });

    test("invokes multiple provided callbacks", () => {
        popup = usePopup();
        const callbackOpen1 = vi.fn();
        const callbackOpen2 = vi.fn();
        const callbackClose1 = vi.fn();
        const callbackClose2 = vi.fn();
        const callbackChange1 = vi.fn();
        const callbackChange2 = vi.fn();
        const callbackDestroy1 = vi.fn();
        const callbackDestroy2 = vi.fn();
        popup.onOpened(callbackOpen1);
        popup.onOpened(callbackOpen2);
        popup.onClosed(callbackClose1);
        popup.onClosed(callbackClose2);
        popup.onStateChanged(callbackChange1);
        popup.onStateChanged(callbackChange2);
        popup.onBeforeDestroyed(callbackDestroy1);
        popup.onBeforeDestroyed(callbackDestroy2);

        popup.open();
        popup.close();
        popup.destroy();

        expect(callbackOpen1).toHaveBeenCalledOnce();
        expect(callbackOpen2).toHaveBeenCalledOnce();
        expect(callbackClose1).toHaveBeenCalledOnce();
        expect(callbackClose2).toHaveBeenCalledOnce();
        expect(callbackChange1).toHaveBeenCalledTimes(2);
        expect(callbackChange2).toHaveBeenCalledTimes(2);
        expect(callbackDestroy1).toHaveBeenCalledOnce();
        expect(callbackDestroy2).toHaveBeenCalledOnce();
    });

    test("invokes callback on destroy", () => {
        popup = usePopup();

        const callback = vi.fn();
        popup.onBeforeDestroyed(callback);

        popup.destroy();
        expect(callback).toHaveBeenCalledOnce();
    });

    test("invokes callbacks in right order on destroy", () => {
        popup = usePopup({ isOpened: true });
        const callbackClose = vi.fn();
        const callbackDestroy = vi.fn();
        popup.onClosed(callbackClose);
        popup.onBeforeDestroyed(callbackDestroy);

        popup.destroy();
        expect(callbackDestroy).toHaveBeenCalledAfter(callbackClose);
    });

    test("clears callbacks after destroy", () => {
        popup = usePopup();
        const callbackOpen = vi.fn();
        const callbackClose = vi.fn();
        const callbackChange = vi.fn();
        const callbackDestroy = vi.fn();
        popup.onOpened(callbackOpen);
        popup.onClosed(callbackClose);
        popup.onStateChanged(callbackChange);
        popup.onBeforeDestroyed(callbackDestroy);

        popup.destroy();
        popup.open();
        popup.close();
        popup.destroy();

        expect(callbackOpen).not.toHaveBeenCalled();
        expect(callbackClose).not.toHaveBeenCalled();
        expect(callbackChange).not.toHaveBeenCalled();
        expect(callbackDestroy).toHaveBeenCalledOnce();
    });

    test("popup closes when opened another one with same type", () => {
        popup = usePopup({ isOpened: true, type: "popups_with_intersecting_types" });
        let anotherPopup: PopupBase | null = usePopup({ type: "popups_with_intersecting_types" });

        anotherPopup.open();
        expect(popup.isOpened).toBe(false);

        onTestFinished(() => {
            if (anotherPopup) {
                anotherPopup.destroy();
                anotherPopup = null;
            }
        });
    });

    test("popup closes when another one with same type comes opened by default", () => {
        popup = usePopup({ isOpened: true, type: "popups_with_intersecting_types" });
        let anotherPopup: PopupBase | null = usePopup({
            isOpened: true,
            type: "popups_with_intersecting_types",
        });

        expect(popup.isOpened).toBe(false);

        onTestFinished(() => {
            if (anotherPopup) {
                anotherPopup.destroy();
                anotherPopup = null;
            }
        });
    });

    test("popup still open when opened another one with different type", () => {
        popup = usePopup({ isOpened: true, type: "popup_with_unique_type_1" });
        let anotherPopup: PopupBase | null = usePopup({ type: "popup_with_unique_type_2" });

        anotherPopup.open();
        expect(popup.isOpened).toBe(true);

        onTestFinished(() => {
            if (anotherPopup) {
                anotherPopup.destroy();
                anotherPopup = null;
            }
        });
    });

    test("popup closes with correct reason", async () => {
        expect.assertions(7);
        popup = usePopup();

        await expect(
            new Promise((resolve) => {
                if (popup) {
                    popup.open().then((value) => resolve(value));
                    popup.close();
                }
            }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "reason": "Close",
          }
        `);

        await expect(
            new Promise((resolve) => {
                if (popup) {
                    popup.open().then((value) => resolve(value));
                    popup.toggle();
                }
            }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "reason": "Toggle",
          }
        `);

        await expect(
            new Promise((resolve) => {
                if (popup) {
                    popup.open().then((value) => resolve(value));
                    let anotherPopup: PopupBase | null = usePopup({ isOpened: true });
                }
            }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "reason": "Another Opened",
          }
        `);

        await expect(
            new Promise((resolve) => {
                if (popup) {
                    popup.open().then((value) => resolve(value));
                    popup.close({ reason: ECloseReason.BACKDROP_CLICK });
                }
            }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "reason": "Backdrop Clicked",
          }
        `);

        await expect(
            new Promise((resolve) => {
                if (popup) {
                    popup.open().then((value) => resolve(value));
                    closeAll();
                }
            }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "reason": "Other",
          }
        `);

        await expect(
            new Promise((resolve) => {
                if (popup) {
                    popup.open().then((value) => resolve(value));

                    closeAllExcept("");
                }
            }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "reason": "Other",
          }
        `);

        await expect(
            new Promise((resolve) => {
                if (popup) {
                    popup.open().then((value) => resolve(value));
                    popup.destroy();
                }
            }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "reason": "Destroyed",
          }
        `);
    });

    test("popup closes with data provided by close method", async () => {
        expect.assertions(1);
        popup = usePopup();

        await expect(
            new Promise((resolve) => {
                if (popup) {
                    popup.open().then((value) => resolve(value));
                    popup.close({
                        data: { id: 123, title: "Data provided when popup has been closed" },
                    });
                }
            }),
        ).resolves.toMatchInlineSnapshot(`
          {
            "data": {
              "id": 123,
              "title": "Data provided when popup has been closed",
            },
            "reason": "Close",
          }
        `);
    });
});

describe("Surrounding functionality", () => {
    test("closes all opened popups", () => {
        popup = usePopup({ isOpened: true });
        let anotherPopup: PopupBase | null = usePopup({ isOpened: true });

        closeAll();

        onTestFinished(() => {
            if (anotherPopup) {
                anotherPopup.destroy();
                anotherPopup = null;
            }
        });
    });

    test("closes only popups with particular type", () => {
        popup = usePopup({ isOpened: true, type: "this_will_close" });
        let anotherPopup: PopupBase | null = usePopup({ isOpened: true });

        closeAll({ popupType: "this_will_close" });

        expect(popup.isOpened).toBe(false);
        expect(anotherPopup.isOpened).toBe(true);

        onTestFinished(() => {
            if (anotherPopup) {
                anotherPopup.destroy();
                anotherPopup = null;
            }
        });
    });

    test("closes all popups except one with particular id", () => {
        popup = usePopup({ isOpened: true, type: "popup_for_testing_1" });
        let anotherPopup: PopupBase | null = usePopup({
            isOpened: true,
            type: "popup_for_testing_2",
        });

        closeAllExcept(popup.id);

        expect(popup.isOpened).toBe(true);
        expect(anotherPopup.isOpened).toBe(false);

        onTestFinished(() => {
            if (anotherPopup) {
                anotherPopup.destroy();
                anotherPopup = null;
            }
        });
    });

    test("closes only popups with particular type except one with particular id", () => {
        popup = usePopup({ isOpened: true, type: "popup_for_testing_1" });
        let anotherPopup: PopupBase | null = usePopup({
            isOpened: true,
            type: "popup_for_testing_2",
        });

        let anotherPopupToKeepOpen: PopupBase | null = usePopup({
            isOpened: true,
            type: "popup_for_testing_3",
        });

        closeAllExcept(popup.id, "popup_for_testing_2");

        expect(popup.isOpened).toBe(true);
        expect(anotherPopup.isOpened).toBe(false);
        expect(anotherPopupToKeepOpen.isOpened).toBe(true);

        onTestFinished(() => {
            if (anotherPopup) {
                anotherPopup.destroy();
                anotherPopup = null;
            }

            if (anotherPopupToKeepOpen) {
                anotherPopupToKeepOpen.destroy();
                anotherPopupToKeepOpen = null;
            }
        });
    });
});
