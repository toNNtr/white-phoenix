import { ECloseReason, usePopup, type Popup } from "@/shared/api/popup";
import { computed, shallowRef, type ComponentOptionsMixin, type DefineComponent } from "vue";

export type Modal<T extends Record<string | number | symbol, unknown> = Record<string, unknown>> =
    Popup<T> & {
        // prettier-ignore
        component: DefineComponent<
            // eslint-disable-next-line
            {},{},{},{},{},
            ComponentOptionsMixin,
            ComponentOptionsMixin,
            { close: (params?: Partial<{ reason: ECloseReason } & T>) => unknown }
        >;
    };

export const modalList = shallowRef<Modal<Record<string | number | symbol, unknown>>[]>([]);

export const openedModals = computed(() => {
    return modalList.value.filter((modal) => modal.isOpened.value);
});

export const hasOpenedModals = computed(
    () => modalList.value.filter((modal) => modal.isOpened.value).length,
);

export function closeTopModal(reason?: ECloseReason) {
    if (openedModals.value.length) {
        openedModals.value[openedModals.value.length - 1]?.close({ reason });
    }
}

export function useModal<T extends Record<string | number | symbol, unknown>>(
    component: Modal<T>["component"],
    type?: string,
) {
    const modalPopup = usePopup<T>({ type });
    const modal = {
        ...modalPopup,
        component,
    };

    // @ts-expect-error Пока не знаю как решить это место.
    modalList.value.push(modal);

    return modalPopup;
}
