export function useHandleClickOutside(
    htmlElement: HTMLElement,
    callback: (event?: MouseEvent) => unknown,
) {
    return (event: MouseEvent) => {
        if (
            event.target &&
            event.target instanceof HTMLElement &&
            !htmlElement.contains(event.target)
        ) {
            callback(event);
        }
    };
}
