import type { ThemeConfig } from "../types";
import "./style.css";

export default {
    title: "Default theme",
    shape: {
        border: {
            radius: {
                S: "4px",
                M: "8px",
                L: "12px",
            },
        },
        spaces: {
            XS: "8px",
            S: "10px",
            XM: "12px",
            M: "16px",
            L: "24px",
            XL: "32px",
        },
    },
    typo: {
        fontFamily: "",
        fontSize: "",
        fontWeight: "",
    },
    color: {
        gray1: "--wp-color-gray-10",
        gray2: "--wp-color-gray-20",
        gray3: "--wp-color-gray-33",
        gray4: "--wp-color-gray-40",
        gray5: "--wp-color-gray-50",
        gray6: "--wp-color-gray-60",
        gray7: "--wp-color-gray-70",
        gray8: "--wp-color-gray-80",
        brand1: "--wp-color-brand-1",
        brand2: "--wp-color-brand-2",
        brand3: "--wp-color-brand-3",
    },
} as ThemeConfig;
