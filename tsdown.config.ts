import { defineConfig } from "tsdown";
import svg from "@tonntr/rolldown-plugin-svg-loader";
import vue from "unplugin-vue/rolldown";
import { fileURLToPath, URL } from "url";

export default defineConfig({
    plugins: [vue(), svg()],
    entry: {
        main: "src/main.ts",
        "ui/*": "src/ui/*/index.ts",
        "api/*": "src/api/*/index.ts",
        "types/*": "src/types/*/index.ts",
        theme: "src/theme/index.ts",
        "plugins/*": "src/plugins/*/index.ts",
    },
    platform: "neutral",
    exports: false,
    fromVite: true,
    dts: { vue: true, tsconfig: "./tsconfig.lib.json" },
    alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
});
