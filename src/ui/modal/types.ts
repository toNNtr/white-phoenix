import type { Popup, PopupCloseExtraParams, PopupCloseParams } from "@/api/popup";
import type { ComponentOptionsMixin, DefineComponent } from "vue";

export type Modal<T extends PopupCloseExtraParams = PopupCloseExtraParams> = Popup<T> & {
    // prettier-ignore
    component: DefineComponent<
            // eslint-disable-next-line
            {},{},{},{},{},
            ComponentOptionsMixin,
            ComponentOptionsMixin,
            { close: (params?: PopupCloseParams<T>) => void }
        >;
};
