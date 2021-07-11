import {SleekGrid} from "../sleek-grid.mjs";
import {useTemplate} from "../utils/index.mjs";

const cloneArea = useTemplate(`
    <div class="area">
        <!--highlight-->
    </div>
`);

/**
 *
 * @type {HTMLDivElement & {columnCtrl?:ColumnController,rowCtrl?:RowController}}
 */
SleekGrid.prototype.createArea = function createGridArea(position) {

    const area = cloneArea();
    area.id = `${position}-area`;
    area.setAttribute("tabindex", String(tabIndex(position)));

    const [primary, secondary] = position.split("-");
    if (primary) area.classList.add(`${primary}-area`);
    if (secondary) area.classList.add(`${secondary}-area`);

    area.addEventListener("keydown", function (event) {
        const highlight = area.querySelector("#highlight");
        if (highlight) {
            switch (event.code) {
                case "KeyS":
                case "ArrowDown":
                    return moveHighlight(event, highlight, 0, 1);
                case "KeyW":
                case "ArrowUp":
                    return moveHighlight(event, highlight, 0, -1);
                case "KeyA":
                case "ArrowLeft":
                    return moveHighlight(event, highlight, -1, 0);
                case "KeyD":
                case "ArrowRight":
                    return moveHighlight(event, highlight, 1, 0);
            }
        }
    });

    return area;
};

function moveHighlight(event, highlight, hz, vt) {
    event.preventDefault();
    event.stopPropagation();
    highlight.move(hz, vt);
}

function tabIndex(position) {
    switch (position) {
        case "top-left":
            return 1;
        case "top":
            return 2;
        case "top-right":
            return 3;
        case "left":
            return 4;
        case "center":
            return 5;
        case "right":
            return 6;
        case "bottom-left":
            return 7;
        case "bottom":
            return 8;
        case "bottom-right":
            return 9;
    }
}

export function defineStyleVariable(node, name) {
    const {style} = node.closest("#view-port");
    let variableValue;
    Object.defineProperty(node, name, {
        get: () => variableValue,
        set: value => style.setProperty(`--${node.id}-${name}`, `${variableValue = value}px`)
    });
}

export function linkStyleVariable(node, target, name) {
    Object.defineProperty(node, name, Object.getOwnPropertyDescriptor(target, name));
}
