export const EButtonVariety = {
    primary: "primary",
    outline: "outline",
};
export type EButtonVariety = keyof typeof EButtonVariety;

export type ButtonProps = {
    type?: "button" | "submit" | "reset";
    variety?: EButtonVariety;
    text?: string;
    replace?: boolean;
};
