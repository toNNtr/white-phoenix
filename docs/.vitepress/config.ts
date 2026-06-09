import path from "node:path";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "White Phoenix Docs",
    description: "White Phoenix Docs",
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: "Документация",
                items: [
                    { text: "UI", link: "/reference/ui/base-button" },
                    { text: "API", link: "/reference/api" },
                ],
            },
        ],

        sidebar: {
            "/reference/ui/": [
                {
                    text: "Ввод",
                    items: [{ text: "BaseButton", link: "/reference/ui/base-button" }],
                },
                {
                    text: "Композиция",
                    items: [{ text: "ButtonGroup", link: "/reference/ui/button-group" }],
                },
                {
                    text: "Представление",
                    items: [{ text: "CardMedium", link: "/reference/ui/card-medium" }],
                },
            ],
            "reference/api/": [],
        },

        socialLinks: [{ icon: "github", link: "https://github.com/toNNtr/white-phoenix" }],
        search: {
            provider: "local",
        },
    },
    markdown: {
        container: {
            tipLabel: "СОВЕТ",
            warningLabel: "ПРЕДУПРЕЖДЕНИЕ",
            dangerLabel: "ОПАСНОСТЬ",
            infoLabel: "ИНФОРМАЦИЯ",
            detailsLabel: "Подробная информация",
        },
    },
    vite: {
        resolve: {
            alias: {
                "@lib": path.join(process.cwd(), "./src"),
            },
        },
    },
});
