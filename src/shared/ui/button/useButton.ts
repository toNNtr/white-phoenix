import { computed } from "vue";
import { type ButtonProps } from "./types";

type UseButtonProps = ButtonProps & {
    emit: (event: "click", ...args: unknown[]) => void;
};

export function useButton({ variety, emit }: UseButtonProps) {
    const buttonClass = computed<string[]>(() => {
        const classes = [];

        if (variety) {
            classes.push(`button_${variety}`);
        }

        return classes;
    });

    function click(event: PointerEvent) {
        emit("click", event);
    }

    return { buttonClass, click };
}
