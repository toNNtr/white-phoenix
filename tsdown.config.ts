import { defineConfig } from "tsdown";
import svg from "@tonntr/rolldown-plugin-svg-loader";

export default defineConfig({
    plugins: [svg()],
    entry: {
        main: "src/main.ts",
        shared: "src/shared/index.ts",
        widgets: "src/widgets/index.ts",
    },
    platform: "neutral",
    exports: true,
    fromVite: true,
    dts: { vue: true },
});
