import { ref, type Ref } from "vue";
import { useHandleClickOutside } from "../helpers";
import {
    ECloseReason,
    usePopup as usePopupBase,
    type PopupCloseExtraParams,
    type PopupBase,
} from "./popupBase";

export * from "./popupBase";
export { usePopupBase };

export interface Popup<
    T extends PopupCloseExtraParams = Record<string, unknown>,
> extends PopupBase<T> {
    isOpenedRef: Ref<boolean, boolean>;
    assignElement: (newHtmlElement: HTMLElement) => void;
}

export function usePopup<T extends Popup>(props?: {
    htmlElement?: HTMLElement;
    isOpened?: boolean;
    type?: Popup["type"];
}): Popup {
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
                popupBase.close({ reason: ECloseReason.BACKDROP_CLICK }),
            );

            document.addEventListener("click", handleClickOutside);
        } else {
            handleClickOutside = useHandleClickOutside(newHtmlElement, () =>
                popupBase.close({ reason: ECloseReason.BACKDROP_CLICK }),
            );
        }
    };

    if (props?.htmlElement) {
        handleClickOutside = useHandleClickOutside(props.htmlElement, () =>
            popupBase.close({ reason: ECloseReason.BACKDROP_CLICK }),
        );
    }
    popupBase.onBeforeDestroyed(unhandleClickOutside);
    popupBase.onOpened(() => {
        if (handleClickOutside) {
            document.addEventListener("click", handleClickOutside);
        }
    });
    popupBase.onClosed(unhandleClickOutside);
    popupBase.onStateChanged(() => (popup.isOpenedRef.value = popupBase.isOpened));

    const popup: Popup = {
        ...popupBase,
        isOpenedRef: ref(popupBase.isOpened),
        assignElement,
    };

    return popup;
}
