import {createDragHandler} from "../utils/index.mjs";

export function rowDragAndDrop(grid, rowHeader) {

    const {
        viewPort,
        sheet
    } = grid;

    function rowDragging({pageX: initialX, pageY: initialY}, handle) {

        const headerCell = handle.closest(".cell");
        const {rows, topIndex, bottomIndex} = grid;

        const dragIndex = headerCell.rowIndex;
        const dragColumn = rows[dragIndex];

        let dropIndex = dragIndex;

        const minTop = rows[topIndex].top;
        const maxBottom = rows[bottomIndex - 1].top + rows[bottomIndex - 1].height;
        const dragY = dragColumn.top - initialY;

        const ghost = createGhostRow(dragIndex, headerCell.getBoundingClientRect());
        viewPort.classList.add("drag-n-drop", "drag-row");
        viewPort.querySelectorAll(`.r-${dragIndex} .cell`).forEach(cell => {
            cell.classList.add("detached");
        });

        function positionRowCells(id, top) {
            const selector = `.r-${id}`;
            const {style} = sheet.querySelector(selector);
            const transform = `translateY(${top}px)`;
            style.transform = transform;
            rowHeader.querySelector(selector).style.transform = transform;
        }

        function packTop(dropY) {
            let index = topIndex;
            let row = rows[index];
            if (row === dragColumn) {
                row = rows[++index];
            }
            let top = minTop;
            while (row && top + row.height < dropY) {
                positionRowCells(index, row.top = top);
                top += row.height;
                row = rows[++index];
                if (row === dragColumn) {
                    row = rows[++index];
                }
            }
            positionRowCells(dragIndex, dragColumn.top = top);
            return index;
        }

        function packBottom(dropY) {
            let index = bottomIndex - 1;
            let row = rows[index];
            if (row === dragColumn) {
                row = rows[--index];
            }
            let bottom = maxBottom;
            while (row && bottom - row.height > dropY) {
                bottom -= row.height;
                positionRowCells(index, row.top = bottom);
                row = rows[--index];
                if (row === dragColumn) {
                    row = rows[--index];
                }
            }
            bottom -= dragColumn.height;
            positionRowCells(dragIndex, dragColumn.top = bottom);
            return index;
        }

        return ({pageX, pageY}) => {
            pageX = Math.max(initialX - 20, Math.min(initialX + 30, pageX));
            if (pageY !== undefined) {
                const dropY = Math.max(0, pageY + dragY);
                if (dropY > dragColumn.top) {
                    dropIndex = packTop(dropY);
                } else if (dropY < dragColumn.top) {
                    dropIndex = packBottom(dropY);
                }
                ghost.style.transform = `translate(${(pageX - initialX)}px, ${(pageY - initialY)}px)`;
            } else {
                viewPort.querySelectorAll(`.r-${dragIndex} .cell`).forEach(cell => {
                    cell.classList.remove("detached");
                });
                viewPort.classList.remove("drag-n-drop", "drag-row");
                ghost.dispose();

                if (dropIndex !== dragIndex) {
                    if (dragIndex < dropIndex) {
                        --dropIndex;
                    }
                    const sorted = grid.properties.rows.map(r => ({...r}));
                    sorted.splice(dropIndex, 0, ...sorted.splice(dragIndex, 1));

                    grid.requestUpdate({rows: sorted});
                }
            }
        };
    }

    function createGhostRow(dragIndex, {left, right, top, bottom}) {
        const dragRow = grid.rows[dragIndex];
        const ghost = document.createElement("div");
        ghost.className = `ghost row ${dragIndex % 2 ? "odd" : "even"}`;
        ghost.style.cssText = `
            left:${viewPort.scrollLeft + left - 15}px;
            top:${viewPort.scrollTop + top - 35}px;
            height:${bottom - top}px;
            width:${viewPort.clientWidth - 20}px;
            overflow:hidden;
        `;
        ghost.innerHTML = `
            <div class="header cell" style="width:${right - left}px; background-color: var(--background-color);">
                <div class="cell-text" style="text-align: center;">${dragRow.label}</div>
            </div>
            ${area.columns.slice(grid.leftIndex, grid.rightIndex).map(column => `
                <div class="header cell c-${column.id}" style="width:${column.width}px">
                    <div class="cell-text">${dragRow[column.field]}</div>                    
                </div>    
            `).join("\n")}
        `;
        viewPort.append(ghost);
        requestAnimationFrame(function () {
            ghost.style.opacity = "1";
        });
        ghost.dispose = function () {
            ghost.style.opacity = null;
            setTimeout(function () {
                ghost.remove();
            }, 300);
        };
        return ghost;
    }

    rowHeader.addEventListener("pointerdown", createDragHandler(rowDragging, ".cell-text"));

}
