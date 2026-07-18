import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    plugins: [vue()],
    test: {
        browser: {
            provider: playwright(),
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
        },
    },
});
