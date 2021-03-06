import {columnContext, createDragHandler, limitedClientRect} from "../utils/index.mjs";

/**
 *
 * @param {SleekGrid} grid
 * @param dragId
 * @param top
 * @param left
 * @param width
 * @return {{move(*, *): void, dispose(): void}}
 */
function createGhostColumn(grid, {column}, {top, left, width}) {
    const {clientHeight} = grid.viewPort;

    const ghost = grid.root.appendChild(document.createElement("div"));
    ghost.className = "ghost column";
    ghost.style.cssText = `
        left:${left + 4}px;
        top:${top + 2}px;
        width:${width - 8}px;
        height:${clientHeight - 4}px;
    `;

    for (const cell of grid.queryColumnCells(column.id)) {
        const clone = cell.cloneNode(true);
        clone.style.left = "0";
        clone.style.transform = cell.parentElement.transform;
        clone.classList.add(cell.parentElement.classList.contains("odd") ? "odd" : "even");
        ghost.appendChild(clone);
    }
    ghost.firstElementChild.classList.remove("odd", "even");

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
 * @param columns
 * @param columnIndex
 * @param dragCell
 * @param initialX
 * @return {{dispose(): void, done, on(*=, *=): void}}
 */
function createColumnShifter(grid, {columns, columnIndex}, dragCell, initialX) {

    function packLeft(dragIndex, dropIndex) {
        const swap = columns[dragIndex];
        let column, left = swap.left;
        for (let columnIndex = dragIndex; columnIndex < dropIndex; columnIndex++) {
            column = columns[columnIndex] = columns[columnIndex + 1];
            for (const cell of grid.positionColumnCells(column.id, column.left = left)) {
                cell.columnIndex = columnIndex;
            }
            left += column.width;
        }
        column = columns[dropIndex] = swap;
        for (const cell of grid.positionColumnCells(column.id, column.left = left)) {
            cell.columnIndex = dropIndex;
        }
    }

    function packRight(dropIndex, dragIndex) {
        let swap = columns[dragIndex];
        let column, left = columns[dropIndex].left;
        for (let columnIndex = dropIndex; columnIndex < dragIndex; columnIndex++) {
            column = swap;
            swap = columns[columnIndex];
            columns[columnIndex] = column;
            for (const cell of grid.positionColumnCells(column.id, column.left = left)) {
                cell.columnIndex = columnIndex;
            }
            left += column.width;
        }
        column = columns[dragIndex] = swap;
        for (const cell of grid.positionColumnCells(column.id, column.left = left)) {
            cell.columnIndex = dragIndex;
        }
    }

    const dragOffset = centerX(dragCell) - initialX;
    let dropIndex, dragIndex = columnIndex;

    let lastX = initialX, delta = pageX => {
        const delta = pageX - lastX;
        lastX = pageX;
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

        on(pageX, targetCell) {
            const deltaX = delta(pageX);
            const dragX = pageX + dragOffset;

            if (!transitioning) {
                dropIndex = targetCell.columnIndex;

                if (deltaX > 0 && dropIndex > dragIndex) {
                    const dropX = centerX(targetCell);
                    if (dragX > dropX - 8) {
                        packLeft(dragIndex, dropIndex);
                        dragIndex = dropIndex;
                        dragCell.addEventListener("transitionend", ontransitionend);
                        transitioning = true;
                    }
                }

                if (deltaX < 0 && dropIndex < dragIndex) {
                    const dropX = centerX(targetCell);
                    if (dropX < dragX + 8) {
                        packRight(dropIndex, dragIndex);
                        dragIndex = dropIndex;
                        dragCell.addEventListener("transitionend", ontransitionend);
                        transitioning = true;
                    }
                }
            }
        },

        dispose() {
            if (dropIndex) {
                const sorted = [...grid.properties.columns];
                const fromId = columns[dragIndex].id;
                const toId = columns[dragIndex + 1].id;
                const fromIndex = sorted.findIndex(({id}) => id === fromId);
                const [dragged] = sorted.splice(fromIndex, 1);
                const toIndex = sorted.findIndex(({id}) => id === toId);
                sorted.splice(toIndex, 0, dragged);
                grid.requestUpdate({columns: sorted});
            }
        }
    };
}

function centerX(target) {
    const {left, right} = target.getBoundingClientRect();
    return (left + right) / 2;
}

/**
 *
 * @param {SleekGrid} grid
 * @param columns
 * @param initialLeft
 * @param initialRight
 * @return {{at(*=): void, dispose(): void}}
 */
function createDropHighlight(grid, {columns}, {left: initialLeft, right: initialRight}) {

    const dropHighlight = grid.shadowRoot.appendChild(document.createElement("div"));
    dropHighlight.id = "drop-highlight";

    const {top, bottom, right: maxRight} = grid.viewPort.getBoundingClientRect();
    dropHighlight.style.cssText = `
            top:${top}px;
            left:${initialLeft}px;
            height:${bottom - top}px;
            width:${Math.min(initialRight, maxRight) - initialLeft - 2}px;
            transform: translateX(0);
        `;

    let current;

    return {
        at(target, force) {
            if (force || target !== current) {
                const {left, right} = limitedClientRect(target);
                dropHighlight.style.transform = `translateX(${left - initialLeft + 1}px)`;
                dropHighlight.style.width = `${right - left - 2}px`;
                current = target;
            }
        },
        dispose() {
            dropHighlight.remove();
        }
    };
}

/**
 * Drag'n Drop Column Handler
 *
 * @type {function(*): void}
 */
export const dragndropColumnHandler = createDragHandler(function ({pageX: initialX, pageY: initialY}, cell, grid) {
    const ctx = columnContext(cell);
    const {column} = ctx;
    const cellRect = limitedClientRect(cell);

    const ghost = createGhostColumn(grid, ctx, cellRect);
    const shifter = createColumnShifter(grid, ctx, cell, initialX);
    const highlight = createDropHighlight(grid, ctx, cellRect);

    shifter.done = () => {
        // grid.viewPort.scrollLeft += 100;
        highlight.at(cell, true);
    };

    grid.viewPort.classList.add("drag-n-drop", "drag-column");
    grid.queryColumnCells(column.id).forEach(cell => cell.classList.add("detached"));

    const {top: minY, bottom: maxY} = grid.viewPort.getBoundingClientRect();

    const cellArea = cell.closest(".area");
    let targetArea = cellArea;

    return {
        onMove({pageX, pageY}) {
            let offsetX = pageX - initialX;
            let offsetY = Math.min(maxY, Math.max(minY, pageY)) - initialY;
            ghost.move(offsetX, offsetY);

            const targetCell = grid.shadowRoot.elementFromPoint(pageX, pageY);
            if (targetCell.classList.contains("header")) {
                targetArea = targetCell.closest(".area");
                if (targetArea === cellArea) {
                    highlight.at(cell);
                    shifter.on(pageX, targetCell);
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
                    sticky.left = {...sticky.left, [column.id]: true};
                } else if (classList.contains("right-area")) {
                    sticky.right = {...sticky.right, [column.id]: true};
                }
                grid.requestUpdate({features: {...grid.features, sticky}});
            }

            grid.viewPort.classList.remove("drag-n-drop", "drag-column");
            grid.queryColumnCells(column.id).forEach(cell => cell.classList.remove("detached"));
        }
    };
});
