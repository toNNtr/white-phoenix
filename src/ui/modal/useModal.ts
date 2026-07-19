import { ECloseReason, usePopup, type Popup, type PopupCloseExtraParams } from "@/api/popup";
import { computed, type ComponentOptionsMixin, type DefineComponent } from "vue";

export type Modal<T extends PopupCloseExtraParams = Record<string, unknown>> = Popup<T> & {
    // prettier-ignore
    component: DefineComponent<
            // eslint-disable-next-line
            {},{},{},{},{},
            ComponentOptionsMixin,
            ComponentOptionsMixin,
            { close: (params?: Partial<{ reason: ECloseReason } & T>) => unknown }
        >;
};

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

export function useModal<T extends Modal>(component: T["component"], type?: string): Modal {
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
