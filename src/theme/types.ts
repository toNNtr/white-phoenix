import type { RecursivePartial } from "@/types/utility";

type Size = "S" | "M" | "L";
type ExtraSize<T extends Size> = `X${T}`;

type MapSizes<T extends string> = { [K in T as K]: string };

export interface ShapeConfig {
    border: {
        radius: MapSizes<Size>;
    };
    spaces: MapSizes<Size | ExtraSize<Size>>;
}

export type TypoConfig = {
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
};

export type ColorConfig = {};

export interface ThemeConfig {
    title: string;
    shape: ShapeConfig;
    typo: TypoConfig;
    color: ColorConfig;
}

export interface Theme extends ThemeConfig {}

export type CustomThemeConfig = RecursivePartial<ThemeConfig>;
