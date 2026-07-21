import type { RecursivePartial } from "@/types/utility";

export function useHandleClickOutside(
    htmlElement: Element | HTMLElement,
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

let lastId = 0;

export function useId() {
    return `${lastId++}`;
}

export function mergeObjects<T extends Record<string, any>>(
    target: T,
    ...objects: RecursivePartial<T>[]
): T {
    const previousLinks: Array<object> = [];

    function innerMergeObjects(
        previousLinks: Array<object>,
        target: T,
        ...objects: RecursivePartial<T>[]
    ): T {
        const other = [...objects];
        const source = other.shift();
        const objectCopy = { ...target };

        if (!source) {
            return objectCopy;
        }

        for (let propertyName of Object.keys(source) as (keyof T)[]) {
            if (!(propertyName in objectCopy)) {
                continue;
            }
            const propertyValue = objectCopy[propertyName];
            const sourcePropertyValue = source[propertyName];
            if (!sourcePropertyValue && sourcePropertyValue !== false) {
                continue;
            }

            if (
                typeof propertyValue === "object" &&
                propertyValue !== null &&
                !Array.isArray(propertyValue)
            ) {
                if (
                    typeof sourcePropertyValue !== "object" ||
                    sourcePropertyValue === null ||
                    Array.isArray(sourcePropertyValue)
                ) {
                    throw new Error("Objects interface doesn't match.");
                }

                if (previousLinks.includes(sourcePropertyValue)) {
                    objectCopy[propertyName] = null as T[keyof T];
                    continue;
                }

                objectCopy[propertyName] = innerMergeObjects(
                    [...previousLinks, sourcePropertyValue],
                    propertyValue,
                    sourcePropertyValue,
                ) as T[keyof T];
            } else if (Array.isArray(propertyValue)) {
                if (!Array.isArray(sourcePropertyValue)) {
                    throw new Error("Objects interface doesn't match.");
                }

                objectCopy[propertyName] = [...propertyValue, ...sourcePropertyValue].filter(
                    (elem, index, array) => array.indexOf(elem) === index,
                ) as T[keyof T];
            } else {
                objectCopy[propertyName] = source[propertyName] as T[keyof T];
            }
        }

        return innerMergeObjects(previousLinks, objectCopy, ...other);
    }

    return innerMergeObjects(previousLinks, target, ...objects);
}
