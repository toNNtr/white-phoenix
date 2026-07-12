const colors = ["#333333", "#863a3a", "#6862c5"];

export function useRenderDivs() {
    let container: HTMLElement | undefined;

    return {
        render: () => {
            container = document.createElement("div");
            container.id = "container";
            container.setAttribute("data-testid", "container");
            container.style.display = "flex";
            container.style.gap = "8px";
            document.body.appendChild(container);

            for (let i = 1; i <= 3; i++) {
                const div = document.createElement("div");
                div.id = `div_${i}`;
                div.setAttribute("data-testid", `div_${i}`);
                div.style.width = "150px";
                div.style.height = "150px";
                div.style.backgroundColor = colors[(i - 1) % colors.length];
                div.style.display = "flex";
                div.style.justifyContent = "center";
                div.style.alignItems = "center";

                container.appendChild(div);
            }
        },
        cleanup: () => {
            if (container) {
                container.remove();
            }
        },
    };
}

export function useRenderDivsWithButtons() {
    let container: HTMLElement | undefined;

    return {
        render: () => {
            container = document.createElement("div");
            container.id = "container";
            container.setAttribute("data-testid", "container");
            container.style.display = "flex";
            container.style.gap = "8px";
            document.body.appendChild(container);

            for (let i = 1; i <= 3; i++) {
                const div = document.createElement("div");
                div.id = `div_${i}`;
                div.setAttribute("data-testid", `div_${i}`);
                div.style.width = "150px";
                div.style.height = "150px";
                div.style.backgroundColor = colors[(i - 1) % colors.length];
                div.style.display = "flex";
                div.style.justifyContent = "center";
                div.style.alignItems = "center";

                const button = document.createElement("button");
                button.type = "button";
                button.textContent = "Inner button";
                div.appendChild(button);

                container.appendChild(div);
            }
        },
        cleanup: () => {
            if (container) {
                container.remove();
            }
        },
    };
}
