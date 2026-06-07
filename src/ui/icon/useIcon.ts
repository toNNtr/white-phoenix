import { ref } from "vue";
import { type IconProps, EIconType } from "./types";

export function useIcon(props: IconProps) {
    const icon = ref("");
    EIconType[props.type]().then((value) => (icon.value = value.default));

    return { icon };
}
