import {SleekGrid} from "../sleek-grid.mjs";
import {rowContext, useTemplate} from "../utils/index.mjs";

class Highlight extends HTMLDivElement {

    at(columnIndex, rowIndex) {
        const {
            columnCtrl: {columns},
            rowCtrl: {rows}
        } = this.parentElement;
        const {left, width} = columns[columnIndex];
        const {top, height} = rows[rowIndex];
        this.className = `c-${columnIndex} r-${rowIndex}`;
        this.columnIndex = columnIndex;
        this.rowIndex = rowIndex;
        this.style.transform = `translate(${left}px,${top}px)`;
        this.style.width = `${width}px`;
        this.style.height = `${height}px`;

        const {window, viewPort} = this.getRootNode().host;
        const area = this.parentElement;
        let scrollLeft = viewPort.scrollLeft;
        let scrollTop = viewPort.scrollTop;
        if (area.hasAttribute("scroll-x")) {
            if (left < window.left) {
                scrollLeft = left;
            } else {
                let delta = left + columns[columnIndex].width - window.width - window.left - 1;
                if (delta > 0) {
                    scrollLeft += delta;
                }
            }
        }
        if (area.hasAttribute("scroll-y")) {
            if (top < window.top) {
                scrollTop = top;
            } else {
                let delta = top + rows[rowIndex].height - window.height - window.top - 1;
                if (delta > 0) {
                    scrollTop += delta;
                }
            }
        }
        if (scrollLeft !== viewPort.scrollLeft || scrollTop !== viewPort.scrollTop) {
            viewPort.scrollTo({left: scrollLeft, top: scrollTop, behavior: "smooth"});
        }
    }

    move(hz, vt) {
        const {
            columnCtrl: {columns, leftIndex, rightIndex},
            rowCtrl: {rows, topIndex, bottomIndex}
        } = this.parentElement;
        let {
            columnIndex,
            rowIndex
        } = this;

        this.at(
            Math.max(0, Math.min(columnIndex + hz, columns.length - 1)),
            Math.max(0, Math.min(rowIndex + vt, rows.length - 1))
        );
    };
}

SleekGrid.prototype.useHighlight = useTemplate(`<div id="highlight"></div>`, function constructor(highlight) {
    highlight.columnIndex = 0;
    highlight.rowIndex = 0;
    highlight.at = Highlight.prototype.at;
    highlight.move = Highlight.prototype.move;

    const {root} = this;
    let active = false;

    root.addEventListener("pointerdown", event => {
        const cell = event.target.closest(".cell");
        if (cell && !cell.classList.contains("header")) {
            let {area} = rowContext(cell);
            event.stopPropagation();
            if (area.firstChild !== highlight) {
                highlight?.replaceWith(document.createComment("highlight"));
                area.firstChild.replaceWith(highlight);
                active = true;
            }
            highlight.at(cell.columnIndex, cell.parentElement.rowIndex);
        } else {
            if (active) {
                highlight?.replaceWith(document.createComment("highlight"));
                active = false;
            }
        }
    }, {capture: true, passive: true});
});

function zIndex(areaId) {
    switch (areaId) {
        case "top-left-area":
            return 105;
        case "top-area":
            return 55;
        case "top-right-area":
            return 105;
        case "left-area":
            return 55;
        case "center-area":
            return 5;
        case "right-area":
            return 55;
        case "bottom-left-area":
            return 105;
        case "bottom-area":
            return 55;
        case "bottom-right-area":
            return 105;
    }
}
