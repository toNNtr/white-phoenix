import { ref, type Ref } from "vue";
import { useHandleClickOutside } from "../helpers";
import {
    ECloseReason,
    usePopup as usePopupBase,
    type PopupCloseExtraParams,
    type PopupBase,
    type PopupCloseParams,
} from "./popupBase";

export * from "./popupBase";
export { usePopupBase };

export interface Popup<
    T extends PopupCloseExtraParams = Record<string, unknown>,
> extends PopupBase<T> {
    isOpenedRef: Ref<boolean, boolean>;
    assignElement: (newHtmlElement: HTMLElement) => void;
}

export function usePopup<T extends PopupCloseExtraParams>(props?: {
    htmlElement?: HTMLElement;
    isOpened?: boolean;
    type?: Popup["type"];
}): Popup<T> {
    const popupBase = usePopupBase<T>({ isOpened: props?.isOpened, type: props?.type });
    let handleClickOutside: ReturnType<typeof useHandleClickOutside> | null;

    function unhandleClickOutside() {
        if (handleClickOutside) {
            document.removeEventListener("click", handleClickOutside);
        }
    }

    const assignElement = (newHtmlElement: HTMLElement) => {
        if (popupBase.isOpened) {
            unhandleClickOutside();
            handleClickOutside = useHandleClickOutside(newHtmlElement, () =>
                popupBase.close({ reason: ECloseReason.BACKDROP_CLICK } as PopupCloseParams<T>),
            );

            document.addEventListener("click", handleClickOutside);
        } else {
            handleClickOutside = useHandleClickOutside(newHtmlElement, () =>
                popupBase.close({ reason: ECloseReason.BACKDROP_CLICK } as PopupCloseParams<T>),
            );
        }
    };

    if (props?.htmlElement) {
        assignElement(props.htmlElement);
    }
    popupBase.onBeforeDestroyed(unhandleClickOutside);
    popupBase.onOpened(() => {
        if (handleClickOutside) {
            document.addEventListener("click", handleClickOutside);
        }
    });
    popupBase.onClosed(unhandleClickOutside);
    popupBase.onStateChanged(() => {
        popup.isOpenedRef.value = popupBase.isOpened;
        popup.isOpened = popupBase.isOpened;
    });

    const popup: Popup<T> = {
        ...popupBase,
        isOpenedRef: ref(popupBase.isOpened),
        assignElement,
    };

    return popup;
}
