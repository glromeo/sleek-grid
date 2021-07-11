import {memoize} from "./nano-memoize.mjs";

export function useTemplate(innerHTML, constructor) {
    const template = document.createElement("template");
    template.innerHTML = innerHTML.replace(/\s+</g, "<");
    function createElement() {
        const root = template.content.cloneNode(true).firstChild;
        constructor?.call(this, root, ...arguments);
        return root;
    }
    createElement.template = template;
    return createElement;
}

export const createFilter = memoize((grid, columns) => {
    const filters = [];
    const body = columns.reduce((code, {field, search}, index) => {
        if (search) {
            const filter = new RegExp("^" + escapeRegex(search).replace(/\\\*/g, ".*"), "i");
            filters.push(filter);
            const f = JSON.stringify(field);
            return code + `\n&& this[${filters.length - 1}].test(row[${f}]) // [${index}] ${f} ${filter}`;
        } else {
            return code;
        }
    }, "row.id = id;\nreturn true") + "\n" + grid.sourceURL("filter");
    if (filters.length > 0) {
        return new Function("row", "id", body).bind(filters);
    }
});

export const applyFilter = memoize((filter, rows) => {
    return rows.filter(filter);
});

export const applySort = memoize((columns, rows) => {
    let column = columns.find(column => column.sort);
    if (column) {
        let sorting = column.sort === "asc" ? 1 : -1;
        const field = column.field;
        return [...rows].sort(function (leftRow, rightRow) {
            const leftCell = leftRow[field];
            const rightCell = rightRow[field];
            return leftCell === rightCell ? 0 : leftCell < rightCell ? -sorting : sorting;
        });
    }
    return rows;
});

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

document.fonts.ready.then(function () {
    console.log("fonts ready");
    context.font = window.getComputedStyle(document.body).font;
});

export function textWidth(text) {
    return context.measureText(text).width * 1.1;
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
 *
 * @param text
 */
export function textHeight(text) {
    throw "textHeight NOT IMPLEMENTED YET";
}

export function calculateScrollbarDimensions() {
    let sample = document.createElement("div");
    sample.style.cssText = `
        width: 100vw;
        height: 100vh;
        overflow: scroll;
        position: fixed;
        visibility: hidden;
	`;
    document.body.append(sample);
    let dimensions = {
        width: sample.offsetWidth - sample.clientWidth,
        height: sample.offsetHeight - sample.clientHeight
    };
    sample.remove();
    return dimensions;
}

const REGEX_SPECIAL_CHARS = /([-*+?.^${}(|)[\]])/g;

export function escapeRegex(str) {
    return str.replace(REGEX_SPECIAL_CHARS, "\\$1");
}

/**
 *
 * @param {function(HTMLDivElement, SleekGrid): void} autosizeCallback
 * @return {function(*): void}
 */
export function createAutosizeHandler(autosizeCallback) {
    return function autosizeHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        const grid = this.getRootNode().host;
        if (!grid.classList.contains("busy")) {
            this.classList.add("active");
            grid.classList.add("busy");
            requestAnimationFrame(() => {
                autosizeCallback(this.parentElement, grid);
                grid.classList.remove("busy");
                this.classList.remove("active");
            });
        }
    };
}

/**
 *
 * @param {function(*, HTMLDivElement, SleekGrid): {onEnd: *, onMove: *}} triggerHandler
 * @return {function(*): void}
 */
export function createDragHandler(triggerHandler) {

    return function dragStart(triggerEvent) {
        triggerEvent.preventDefault();
        triggerEvent.stopPropagation();

        const grid = this.getRootNode().host;
        this.classList.add("active");

        const dragHandler = triggerHandler.call(this, triggerEvent, this.closest(".cell"), grid);
        dragHandler.pending = 0;

        document.body.addEventListener("pointermove", mouseDragHandler);
        document.body.addEventListener("pointerup", mouseDragHandler);

        const dragEnd = () => {
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                document.body.removeEventListener("pointermove", mouseDragHandler);
                document.body.removeEventListener("pointerup", mouseDragHandler);
                dragHandler.onEnd();
            }
        };

        function mouseDragHandler(dragEvent) {
            dragEvent.preventDefault();
            dragEvent.stopPropagation();
            if (dragEvent.buttons !== 1) {
                requestAnimationFrame(function () {
                    dragHandler.onEnd(dragEvent);
                    dragEnd();
                });
                dragHandler.pending++;
            }
            if (dragHandler.pending === 0) {
                requestAnimationFrame(function () {
                    dragHandler.onMove(dragEvent, dragEnd);
                    dragHandler.pending--;
                });
                dragHandler.pending++;
            }
        }
    };
}

export function useSizer(grid, sizer) {
    const cell = sizer.appendChild(grid.createGridCell({
        column: {},
        columnIndex: 0
    }, {
        row: {},
        rowIndex: 0
    }));
    cell.style.cssText = `width:auto;height:auto;`;
    const cellText = cell.querySelector(".cell-text");
    cellText.innerHTML = "";
    return function (column, row) {
        grid.renderCell(cellText, column, row);
        return cell;
    };
}

export function parametersList(fn) {
    if (fn) {
        const code = fn.toString();
        return code.substring(code.indexOf("("), 1 + code.lastIndexOf(")", code.indexOf("{")));
    } else {
        return "()";
    }
}

export function sourceCode(fn) {
    if (fn) {
        const code = fn.toString();
        return code.substring(code.indexOf("{") + 1, code.lastIndexOf("}")).trim();
    } else {
        return "undefined";
    }
}

export function sourceURL(path) {
    return `//# sourceURL=moderno://sleekgrid/${this}/${path}`;
}

export function camelCase(attributeName) {
    return attributeName.replace(/(-\w)/g, function (m) {
        return m[1].toUpperCase();
    });
}

const opposites = {
    "top": "bottom",
    "bottom": "top",
    "left": "right",
    "right": "left"
};

export function opposite(what) {
    return opposites[what] ?? what;
}

export function columnContext(cell) {
    const area = cell.closest(".area");
    const {columns, leftIndex, rightIndex} = area.columnCtrl;
    const {columnIndex} = cell;
    const column = columns[columnIndex];
    return {
        area,
        columns,
        leftIndex,
        rightIndex,
        column,
        columnIndex
    };
}

export function rowContext(cell) {
    const area = cell.closest(".area");
    const {rows, topIndex, bottomIndex} = area.rowCtrl;
    const {rowIndex} = cell.parentElement;
    const row = rows[rowIndex];
    return {
        area,
        rows,
        topIndex,
        bottomIndex,
        row,
        rowIndex
    };
}

export function limitedClientRect(target) {
    const area = target.closest(".area");
    const areaRect = area.getBoundingClientRect();
    let {top, bottom, left, right} = target.getBoundingClientRect();
    if (area.visibleTop !== undefined) {
        top = Math.max(top, area.visibleTop);
        bottom = Math.min(bottom, area.visibleBottom);
    } else {
        top = Math.max(top, areaRect.top);
        bottom = Math.min(bottom, areaRect.bottom);
    }
    if (area.visibleLeft !== undefined) {
        left = Math.max(left, area.visibleLeft);
        right = Math.min(right, area.visibleRight);
    } else {
        left = Math.max(left, areaRect.left);
        right = Math.min(right, areaRect.right);
    }
    return {top, bottom, left, right, height: bottom - top, width: right - left};
}

export function assignIds(items) {
    if (items[0].id === undefined) {
        items.forEach((column, index) => column.id = String(index));
    }
    if (typeof items[0].id !== "string") {
        items.forEach(column => column.id = String(column.id));
    }
}
