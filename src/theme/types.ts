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

export type ColorConfig = {
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray5: string;
    gray6: string;
    brand1: string;
    brand2: string;
    brand3: string;
};

export interface ThemeConfig {
    title: string;
    shape: ShapeConfig;
    typo: TypoConfig;
    color: ColorConfig;
}

export interface Theme extends ThemeConfig {}

export type CustomThemeConfig = RecursivePartial<ThemeConfig>;
