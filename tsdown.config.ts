import { defineConfig } from "tsdown";
import svg from "@tonntr/rolldown-plugin-svg-loader";
import vue from "unplugin-vue/rolldown";
import { fileURLToPath, URL } from "url";

export default defineConfig({
    plugins: [vue(), svg()],
    entry: {
        main: "src/main.ts",
        shared: "src/shared/index.ts",
        widgets: "src/widgets/index.ts",
    },
    platform: "neutral",
    exports: true,
    fromVite: true,
    dts: { vue: true, tsconfig: "./tsconfig.lib.json" },
    alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
});
