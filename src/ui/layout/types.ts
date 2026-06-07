import type { ComponentOptionsMixin, DefineComponent } from "vue";

export type LayoutParams = {
    name: string;
    // prettier-ignore
    component: DefineComponent<
        // eslint-disable-next-line
        {},{},{},{},{},
        ComponentOptionsMixin,
        ComponentOptionsMixin,
        { modalBackdropClick: () => void }
    >;
};

export function isLayoutParams(layoutParams: object): layoutParams is LayoutParams {
    return (
        "name" in layoutParams &&
        typeof layoutParams.name === "string" &&
        "component" in layoutParams
    );
}
