import {createDragHandler, limitedClientRect, rowContext} from "../utils/index.mjs";

/**
 *
 * @param {SleekGrid} grid
 * @param dragId
 * @param top
 * @param left
 * @param height
 * @return {{move(*, *): void, dispose(): void}}
 */
function createGhostRow(grid, {row, rowIndex}, {top, left, height}) {
    const {clientWidth} = grid.viewPort;

    const ghost = grid.root.appendChild(document.createElement("div"));
    ghost.className = `ghost row ${rowIndex % 2 ? "odd" : "even"}`;
    ghost.style.cssText = `
        left:${left + 4}px;
        top:${top + 2}px;
        height:${height - 4}px;
        width:${clientWidth - 8}px;
    `;

    for (const cell of grid.queryRowCells(row.id)) {
        const clone = cell.cloneNode(true);
        clone.style.left = null;
        ghost.appendChild(clone);
    }

    requestAnimationFrame(function () {
        ghost.style.opacity = "1";
    });

    return {
        move(x, y) {
            ghost.style.transform = `translate(${x}px, ${y}px)`;
        },
        dispose() {
            ghost.style.opacity = null;
            setTimeout(function () {
                ghost.remove();
            }, 300);
        }
    };
}

/**
 *
 * @param {SleekGrid} grid
 * @param rows
 * @param rowIndex
 * @param dragCell
 * @param initialY
 * @return {{dispose(): void, done, on(*=, *=): void}}
 */
function createRowShifter(grid, {rows, rowIndex}, dragCell, initialY) {

    function packTop(dragIndex, dropIndex) {
        const swap = rows[dragIndex];
        let row, top = swap.top;
        for (let rowIndex = dragIndex; rowIndex < dropIndex; rowIndex++) {
            row = rows[rowIndex] = rows[rowIndex + 1];
            for (const rowPart of grid.positionRowParts(row.id, row.top = top)) {
                rowPart.rowIndex = rowIndex;
            }
            top += row.height;
        }
        row = rows[dropIndex] = swap;
        for (const rowPart of grid.positionRowParts(row.id, row.top = top)) {
            rowPart.rowIndex = dropIndex;
        }
    }

    function packBottom(dropIndex, dragIndex) {
        let swap = rows[dragIndex];
        let row, top = rows[dropIndex].top;
        for (let rowIndex = dropIndex; rowIndex < dragIndex; rowIndex++) {
            row = swap;
            swap = rows[rowIndex];
            rows[rowIndex] = row;
            for (const rowPart of grid.positionRowParts(row.id, row.top = top)) {
                rowPart.rowIndex = rowIndex;
            }
            top += row.height;
        }
        row = rows[dragIndex] = swap;
        for (const rowPart of grid.positionRowParts(row.id, row.top = top)) {
            rowPart.rowIndex = dropIndex;
        }
    }

    const dragOffset = centerY(dragCell) - initialY;
    let dropIndex, dragIndex = rowIndex;

    let lastY = initialY, delta = pageY => {
        const delta = pageY - lastY;
        lastY = pageY;
        return delta;
    };

    let transitioning = false;
    let ontransitionend = () => {
        transitioning = false;
    };

    return {
        set done(callback) {
            ontransitionend = () => {
                callback();
                transitioning = false;
            };
        },

        on(pageY, targetCell) {
            const deltaY = delta(pageY);
            const dragY = pageY + dragOffset;

            if (!transitioning) {
                dropIndex = targetCell.parentElement.rowIndex;

                if (deltaY > 0 && dropIndex > dragIndex) {
                    const dropY = centerY(targetCell);
                    if (dragY > dropY - 8) {
                        packTop(dragIndex, dropIndex);
                        dragIndex = dropIndex;
                        dragCell.parentElement.addEventListener("transitionend", ontransitionend);
                        transitioning = true;
                    }
                }

                if (deltaY < 0 && dropIndex < dragIndex) {
                    const dropY = centerY(targetCell);
                    if (dropY < dragY + 8) {
                        packBottom(dropIndex, dragIndex);
                        dragIndex = dropIndex;
                        dragCell.parentElement.addEventListener("transitionend", ontransitionend);
                        transitioning = true;
                    }
                }
            }
        },

        dispose() {
            if (dropIndex) {
                const sorted = [...grid.properties.rows];
                const fromId = rows[dragIndex].id;
                const toId = rows[dragIndex + 1].id;
                const fromIndex = sorted.findIndex(({id}) => id === fromId);
                const [dragged] = sorted.splice(fromIndex, 1);
                const toIndex = sorted.findIndex(({id}) => id === toId);
                sorted.splice(toIndex, 0, dragged);
                grid.requestUpdate({rows: sorted});
            }
        }
    };
}

function centerY(target) {
    const {top, bottom} = target.getBoundingClientRect();
    return (top + bottom) / 2;
}

/**
 *
 * @param {SleekGrid} grid
 * @param columns
 * @param initialLeft
 * @param initialRight
 * @return {{at(*=): void, dispose(): void}}
 */
function createDropHighlight(grid, {rows}, {top: initialTop, bottom: initialBottom}) {

    const dropHighlight = grid.shadowRoot.appendChild(document.createElement("div"));
    dropHighlight.id = "drop-highlight";

    const {left, right, bottom: maxBottom} = grid.viewPort.getBoundingClientRect();
    dropHighlight.style.cssText = `
        left:${left}px;
        top:${initialTop}px;
        width:${right - left}px;
        height:${Math.min(initialBottom, maxBottom) - initialTop - 2}px;
        transform: translateY(0);
    `;

    let current;

    return {
        at(target, force) {
            if (force || target !== current) {
                const {top, bottom} = limitedClientRect(target);
                dropHighlight.style.transform = `translateY(${top - initialTop + 1}px)`;
                dropHighlight.style.height = `${bottom - top - 2}px`;
                current = target;
            }
        },
        dispose() {
            dropHighlight.remove();
        }
    };
}

/**
 * Drag'n Drop Row Handler
 *
 * @type {function(*): void}
 */
export const dragndropRowHandler = createDragHandler(function ({pageX: initialX, pageY: initialY}, cell, grid) {
    const ctx = rowContext(cell);
    const {row} = ctx;
    const cellRect = limitedClientRect(cell);

    const ghost = createGhostRow(grid, ctx, cellRect);
    const shifter = createRowShifter(grid, ctx, cell, initialX);
    const highlight = createDropHighlight(grid, ctx, cellRect);

    shifter.done = () => {
        // grid.viewPort.scrollLeft += 100;
        highlight.at(cell, true);
    };

    grid.viewPort.classList.add("drag-n-drop", "drag-row");
    grid.queryRowParts(row.id).forEach(rowPart => rowPart.classList.add("detached"));

    const {left: minX, right: maxX} = grid.viewPort.getBoundingClientRect();

    const cellArea = cell.closest(".area");
    let targetArea = cellArea;

    return {
        onMove({pageX, pageY}) {
            let offsetX = Math.min(maxX, Math.max(minX, pageX)) - initialX;
            let offsetY = pageY - initialY;
            ghost.move(offsetX, offsetY);

            const targetCell = grid.shadowRoot.elementFromPoint(pageX, pageY);
            if (targetCell.classList.contains("header")) {
                targetArea = targetCell.closest(".area");
                if (targetArea === cellArea) {
                    highlight.at(cell);
                    shifter.on(pageY, targetCell);
                } else {
                    highlight.at(targetArea);
                }
            }
        },
        onEnd() {
            ghost.dispose();
            highlight.dispose();
            shifter.dispose();

            if (targetArea !== cellArea) {
                const {sticky} = grid.features;
                const classList = targetArea.classList;
                if (classList.contains("left-area")) {
                    sticky.left = {...sticky.left, [row.id]: true};
                } else if (classList.contains("right-area")) {
                    sticky.right = {...sticky.left, [row.id]: true};
                }
                grid.requestUpdate({features: {...grid.features, sticky}});
            }

            grid.viewPort.classList.remove("drag-n-drop", "drag-row");
            grid.queryRowParts(row.id).forEach(rowPart => rowPart.classList.remove("detached"));
        }
    };
});
