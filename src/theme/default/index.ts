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
    color: {},
} as ThemeConfig;
