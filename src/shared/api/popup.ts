import { ref, useId, type Ref } from "vue";
import { useHandleClickOutside } from "./helpers";
import type { ValueOf } from "./types/utility";

export const ECloseReason = {
    CLOSE: "close",
    TOGGLE: "toggle",
    BACKDROP_CLICK: "backdrop clicked",
    ANOTHER_OPENED: "another opened",
    OTHER: "other",
};
export type ECloseReason = ValueOf<typeof ECloseReason>;

type PopupInternal<T extends Record<string | number | symbol, unknown> = Record<string, unknown>> =
    {
        id: string;
        type?: string;
        isOpened: Ref<boolean, boolean>;
        open: () => Promise<{ reason: ECloseReason } & Partial<T>>;
        close: (params?: Partial<{ reason: ECloseReason } | T>) => void;
        toggle: () => void;
        assignElement: (newHtmlElement: HTMLElement) => void;
        closeHandler?: (params: { reason: ECloseReason } & Partial<T>) => void;
        closePromise?: Promise<{ reason: ECloseReason } & Partial<T>>;
    };

export type Popup<T extends Record<string | number | symbol, unknown> = Record<string, unknown>> =
    Omit<PopupInternal<T>, "closeHandler" | "closePromise">;

const popupList: Pick<PopupInternal, "id" | "type" | "isOpened" | "close">[] = [];

export function closeAll({
    popupType,
    reason,
}: {
    popupType?: PopupInternal["type"];
    reason?: ECloseReason;
}) {
    popupList.forEach(
        (elem) =>
            elem.isOpened.value &&
            (!popupType || elem.type === popupType) &&
            elem.close({ reason }),
    );
}

export function closeAllExcept(
    keepPopupId: PopupInternal["id"],
    popupType?: PopupInternal["type"],
    reason?: ECloseReason,
) {
    popupList.forEach(
        (elem) =>
            elem.id !== keepPopupId &&
            (!popupType || elem.type === popupType) &&
            elem.isOpened.value &&
            elem.close({ reason }),
    );
}

export function usePopup<
    T extends Record<string | number | symbol, unknown> = Record<string, unknown>,
>(props?: {
    htmlElement?: HTMLElement;
    initialState?: boolean;
    type?: PopupInternal["type"];
}): Popup<T> {
    let handleClickOutside: ReturnType<typeof useHandleClickOutside> | null;
    const isOpened = ref(props?.initialState || false);

    const open: Popup<T>["open"] = () => {
        if (popup.isOpened.value && popup.closePromise) {
            return popup.closePromise;
        }

        popup.closePromise = new Promise<{ reason: ECloseReason } & Partial<T>>((resolve) => {
            closeAll({ popupType: props?.type, reason: ECloseReason.ANOTHER_OPENED });
            isOpened.value = true;

            if (handleClickOutside) {
                document.addEventListener("click", handleClickOutside);
            }

            popup.closeHandler = (closeProps) => resolve(closeProps);
        });

        return popup.closePromise;
    };

    const close: Popup["close"] = (closeProps) => {
        // @ts-expect-error Пока не знаю как решить это место.
        // closeProps имеет все опциональные параметры.
        // В closeHandler обязателен параметр reason и остальные параметры из closeProps,
        // если они переданы, но похоже TS не понимает, что здесь все должно быть в порядке.
        popup.closeHandler?.({ reason: ECloseReason.OTHER, ...closeProps });

        isOpened.value = false;

        if (handleClickOutside) {
            document.removeEventListener("click", handleClickOutside);
        }
    };

    const toggle = () => {
        if (isOpened.value) {
            close({ reason: ECloseReason.TOGGLE });
        } else {
            open();
        }
    };

    const assignElement = (newHtmlElement: HTMLElement) => {
        if (isOpened.value) {
            if (handleClickOutside) {
                document.removeEventListener("click", handleClickOutside);
            }

            handleClickOutside = useHandleClickOutside(newHtmlElement, () =>
                close({ reason: ECloseReason.BACKDROP_CLICK }),
            );
            document.addEventListener("click", handleClickOutside);
        } else {
            handleClickOutside = useHandleClickOutside(newHtmlElement, () =>
                close({ reason: ECloseReason.BACKDROP_CLICK }),
            );
        }
    };

    if (props?.htmlElement) {
        handleClickOutside = useHandleClickOutside(props.htmlElement, () =>
            close({ reason: ECloseReason.BACKDROP_CLICK }),
        );
    }

    const popup: PopupInternal<T> = {
        id: useId(),
        type: props?.type,
        isOpened: isOpened,
        open,
        close,
        toggle,
        assignElement,
    };

    popupList.push(popup);

    return popup;
}
