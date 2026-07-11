import type { ValueOf } from "@/types/utility";
import { useId } from "../helpers";

export const ECloseReason = {
    CLOSE: "Close",
    TOGGLE: "Toggle",
    BACKDROP_CLICK: "Backdrop Clicked",
    ANOTHER_OPENED: "Another Opened",
    DESTROYED: "Destroyed",
    OTHER: "Other",
} as const;
export type ECloseReason = ValueOf<typeof ECloseReason>;

export const EPopupEventType = {
    OPEN: "Open",
    CLOSE: "Close",
    STATE_CHANGE: "StateChange",
    BEFORE_DESTROY: "BeforeDestroy",
} as const;
export type EPopupEventType = ValueOf<typeof EPopupEventType>;

export type ExternalHandlerCallback = () => void;
export type LifecycleHook = (callback: ExternalHandlerCallback) => void;

export interface PopupCloseExtraParams {}

export interface PopupBase<T extends PopupCloseExtraParams = Record<string, unknown>> {
    id: string;
    type?: string;
    isOpened: boolean;
    open: () => Promise<{ reason: ECloseReason } & Partial<T>>;
    close: (params?: Partial<{ reason: ECloseReason } | T>) => void;
    toggle: () => void;
    destroy: () => void;
    onOpened: LifecycleHook;
    onClosed: LifecycleHook;
    onStateChanged: LifecycleHook;
    onBeforeDestroyed: LifecycleHook;
}

export const popupList: PopupBase[] = [];

export function closeAll(props?: { popupType?: PopupBase["type"]; reason?: ECloseReason }) {
    popupList.forEach(
        (elem) =>
            elem.isOpened &&
            (!props?.popupType || elem.type === props?.popupType) &&
            elem.close({ reason: props?.reason ?? ECloseReason.OTHER }),
    );
}

export function closeAllExcept(
    keepPopupId: PopupBase["id"],
    popupType?: PopupBase["type"],
    reason?: ECloseReason,
) {
    popupList.forEach(
        (elem) =>
            elem.id !== keepPopupId &&
            (!popupType || elem.type === popupType) &&
            elem.isOpened &&
            elem.close({ reason: reason ?? ECloseReason.OTHER }),
    );
}

export function usePopup<T extends PopupBase>(props?: {
    isOpened?: boolean;
    type?: PopupBase["type"];
}): PopupBase {
    let popupClosePromise:
        | Promise<{ reason: ECloseReason } & Partial<PopupCloseExtraParams>>
        | undefined;
    let closeHandler:
        | ((params: { reason: ECloseReason } & Partial<PopupCloseExtraParams>) => void)
        | undefined;
    const externalHandlers: { type: EPopupEventType; callback: ExternalHandlerCallback }[] = [];

    function addExternalHandler(type: EPopupEventType, callback: ExternalHandlerCallback) {
        if (!externalHandlers.find((elem) => elem.type === type && elem.callback === callback)) {
            externalHandlers.push({ type, callback });
        }
    }

    function invokeExternalHandlers(type: EPopupEventType) {
        const handlers = externalHandlers.filter((elem) => elem.type === type);
        handlers.forEach((elem) => elem.callback());
    }

    const open: T["open"] = () => {
        if (popup.isOpened && popupClosePromise) {
            return popupClosePromise;
        }

        closeAll({ popupType: props?.type, reason: ECloseReason.ANOTHER_OPENED });
        popup.isOpened = true;
        popupClosePromise = new Promise((resolve) => {
            closeHandler = (closeProps) => resolve(closeProps);
        });

        invokeExternalHandlers(EPopupEventType.OPEN);
        invokeExternalHandlers(EPopupEventType.STATE_CHANGE);

        return popupClosePromise;
    };

    const close: T["close"] = (closeProps) => {
        if (popup.isOpened) {
            closeHandler?.({ reason: ECloseReason.CLOSE, ...closeProps });
            popup.isOpened = false;

            invokeExternalHandlers(EPopupEventType.CLOSE);
            invokeExternalHandlers(EPopupEventType.STATE_CHANGE);
        }
    };

    const toggle = () => {
        if (popup.isOpened) {
            close({ reason: ECloseReason.TOGGLE });
        } else {
            open();
        }
    };

    const destroy = () => {
        popup.close({ reason: ECloseReason.DESTROYED });
        invokeExternalHandlers(EPopupEventType.BEFORE_DESTROY);
        externalHandlers.splice(0);
        popupClosePromise = undefined;
        closeHandler = undefined;

        const popupIdx = popupList.findIndex((elem) => elem === popup);
        if (popupIdx >= 0) {
            popupList.splice(popupIdx, 1);
        }
    };

    const popup: PopupBase = {
        id: useId(),
        type: props?.type,
        isOpened: props?.isOpened ?? false,
        open,
        close,
        toggle,
        destroy,
        onBeforeDestroyed: (callback) =>
            addExternalHandler(EPopupEventType.BEFORE_DESTROY, callback),
        onOpened: (callback) => addExternalHandler(EPopupEventType.OPEN, callback),
        onClosed: (callback) => addExternalHandler(EPopupEventType.CLOSE, callback),
        onStateChanged: (callback) => addExternalHandler(EPopupEventType.STATE_CHANGE, callback),
    };

    if (popup.isOpened) {
        closeAll({ popupType: props?.type, reason: ECloseReason.ANOTHER_OPENED });
    }

    popupList.push(popup);

    return popup;
}
