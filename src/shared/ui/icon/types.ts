export const EIconType = {
    "arrow-angle-d": () => import("./assets/arrow-angle-d.svg?raw"),
    "icon-cross": () => import("./assets/icon-cross.svg?raw"),
    "icon-dots-h": () => import("./assets/icon-dots-h.svg?raw"),
    "icon-dots-v": () => import("./assets/icon-dots-v.svg?raw"),
    "icon-gear": () => import("./assets/icon-gear.svg?raw"),
};
export type EIconType = keyof typeof EIconType;

export type IconProps = {
    type: EIconType;
};
