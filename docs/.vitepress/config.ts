import path from "node:path";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "White Phoenix Docs",
    description: "White Phoenix Docs",
    cleanUrls: true,
    base: "/white-phoenix",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: "Документация",
                items: [
                    { text: "UI", link: "reference/ui/base-button" },
                    { text: "API", link: "reference/api" },
                ],
            },
        ],

        sidebar: {
            "/reference/ui/": {
                base: "/reference/ui/",
                items: [
                    {
                        text: "Ввод",
                        items: [{ text: "BaseButton", link: "base-button" }],
                    },
                    {
                        text: "Композиция",
                        items: [{ text: "ButtonGroup", link: "button-group" }],
                    },
                    {
                        text: "Представление",
                        items: [
                            { text: "BaseCatalog", link: "base-catalog" },
                            { text: "CardMedium", link: "card-medium" },
                            { text: "CardSmall", link: "card-small" },
                            { text: "DropdownBase", link: "dropdown-base" },
                            { text: "ModalList", link: "modal-list" },
                        ],
                    },
                ],
            },
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
                "@": path.join(process.cwd(), "./src"),
                "@docs": path.join(process.cwd(), "./docs"),
            },
        },
    },
});
