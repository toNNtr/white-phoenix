import type { ValueOf, GetKeyByValue } from "@/types/utility";
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

type ExternalHandlerArgs<T extends EPopupEventType> = {
    OPEN: [];
    CLOSE: [reason?: ECloseReason];
    STATE_CHANGE: [isNowOpened: boolean, reason?: ECloseReason];
    BEFORE_DESTROY: [];
}[GetKeyByValue<typeof EPopupEventType, T>];

export type ExternalHandlerCallback<T extends Array<unknown> = []> = (...args: T) => void;
export type LifecycleHook<T extends Array<unknown> = []> = (
    callback: ExternalHandlerCallback<T>,
) => void;

export interface PopupCloseExtraParams {}
export type PopupCloseParams<T extends PopupCloseExtraParams = PopupCloseExtraParams> =
    Partial<T> & {
        reason?: ECloseReason;
    };

export interface PopupBase<T extends PopupCloseExtraParams = PopupCloseExtraParams> {
    id: string;
    type?: string;
    isOpened: boolean;
    open: () => Promise<PopupCloseParams<T>>;
    close: (params?: PopupCloseParams<T>) => void;
    toggle: () => void;
    destroy: () => void;
    onOpened: LifecycleHook;
    onClosed: LifecycleHook<ExternalHandlerArgs<(typeof EPopupEventType)["CLOSE"]>>;
    onStateChanged: LifecycleHook<ExternalHandlerArgs<(typeof EPopupEventType)["STATE_CHANGE"]>>;
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

export function usePopup<T extends PopupCloseExtraParams>(props?: {
    isOpened?: boolean;
    type?: PopupBase["type"];
}): PopupBase<T> {
    let popupClosePromise: Promise<PopupCloseParams<T>> | undefined;
    let closeHandler: ((params: PopupCloseParams<PopupCloseExtraParams>) => void) | undefined;
    const externalHandlers: { type: EPopupEventType; callback: (...args: any) => any }[] = [];

    function addExternalHandler<T extends EPopupEventType>(
        type: T,
        callback: ExternalHandlerCallback<ExternalHandlerArgs<T>>,
    ) {
        if (!externalHandlers.find((elem) => elem.type === type && elem.callback === callback)) {
            externalHandlers.push({ type, callback });
        }
    }

    function invokeExternalHandlers<T extends EPopupEventType>(
        type: T,
        ...args: ExternalHandlerArgs<T>
    ) {
        const handlers = externalHandlers.filter((elem) => elem.type === type);
        handlers.forEach((elem) => elem.callback(...args));
    }

    const open: PopupBase<T>["open"] = () => {
        if (popup.isOpened && popupClosePromise) {
            return popupClosePromise;
        }

        closeAll({ popupType: props?.type, reason: ECloseReason.ANOTHER_OPENED });
        popup.isOpened = true;
        popupClosePromise = new Promise((resolve) => {
            closeHandler = (closeProps) => resolve(closeProps);
        });

        invokeExternalHandlers(EPopupEventType.OPEN);
        invokeExternalHandlers(EPopupEventType.STATE_CHANGE, true);

        return popupClosePromise;
    };

    const close: PopupBase<T>["close"] = (closeProps) => {
        if (popup.isOpened) {
            closeHandler?.({ reason: ECloseReason.CLOSE, ...closeProps });
            popup.isOpened = false;

            invokeExternalHandlers(EPopupEventType.CLOSE, closeProps?.reason ?? ECloseReason.CLOSE);
            invokeExternalHandlers(
                EPopupEventType.STATE_CHANGE,
                false,
                closeProps?.reason ?? ECloseReason.CLOSE,
            );
        }
    };

    const toggle = () => {
        if (popup.isOpened) {
            close({ reason: ECloseReason.TOGGLE } as PopupCloseParams<T>);
        } else {
            open();
        }
    };

    const destroy = () => {
        popup.close({ reason: ECloseReason.DESTROYED } as PopupCloseParams<T>);
        invokeExternalHandlers(EPopupEventType.BEFORE_DESTROY);
        externalHandlers.splice(0);
        popupClosePromise = undefined;
        closeHandler = undefined;

        const popupIdx = popupList.findIndex((elem) => elem === popup);
        if (popupIdx >= 0) {
            popupList.splice(popupIdx, 1);
        }
    };

    const popup: PopupBase<T> = {
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
