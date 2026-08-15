import { ECloseReason, usePopup, type PopupCloseExtraParams } from "@/api/popup";
import { computed } from "vue";
import { type Modal } from "./types";

export const modalList: Modal[] = [];

export function useOpenedModals() {
    return computed(() => modalList.filter((modal) => modal.isOpenedRef.value));
}

export function useHasOpenedModals() {
    return computed(() => modalList.filter((modal) => modal.isOpenedRef.value).length);
}

export function closeTopModal(reason?: ECloseReason) {
    const openedModals = useOpenedModals();

    if (openedModals.value.length) {
        openedModals.value[openedModals.value.length - 1]?.close({ reason });
    }
}

export function useModal<T extends PopupCloseExtraParams>(
    component: Modal<T>["component"],
    type?: string,
): Modal<T> {
    const modalPopup = usePopup<T>({ type });
    const modal = {
        ...modalPopup,
        component,
    };

    modal.onBeforeDestroyed(() => {
        const modalIdx = modalList.findIndex((elem) => elem === modal);
        if (modalIdx >= 0) {
            modalList.splice(modalIdx, 1);
        }
    });

    modalList.push(modal);

    return modal;
}
