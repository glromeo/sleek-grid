import {columnContext, createAutosizeHandler, createDragHandler} from "../utils/index.mjs";

function dispatchResizeAction(grid, id, columnWidth) {
    const {columns} = grid.properties;
    columns[columns.findIndex(column => column.id === id)].width = columnWidth;
}

export const autosizeWidthHandler = createAutosizeHandler((cell, grid) => {
    const {
        area,
        columns,
        columnIndex,
        column
    } = columnContext(cell);

    const translation = Math.round(grid.autoColumnWidth(column) - column.width);
    if (translation) {
        column.width += translation;
        area.width += translation;
        grid.resizeColumnCells(column.id, column.width);
        for (let column, nextIndex = columnIndex + 1; nextIndex < columns.length; nextIndex++) {
            column = columns[nextIndex];
            grid.positionColumnCells(column.id, column.left += translation);
        }
        dispatchResizeAction(grid, column.id, column.width);
    }
});

export const dragWidthHandler = createDragHandler(function ({pageX: lastX}, cell, grid) {
    const {
        area,
        columns,
        columnIndex,
        column
    } = columnContext(cell);

    let translation = 0;
    return {
        onMove({pageX}, stop) {
            let width = column.width + pageX - lastX;
            if (column.maxWidth !== undefined) {
                width = Math.min(width, column.maxWidth);
            }
            if (column.minWidth !== undefined) {
                width = Math.max(width, column.minWidth);
            } else {
                width = Math.max(width, 20);
            }
            translation = Math.round(width - column.width);
            if (translation) {
                grid.resizeColumnCells(column.id, column.width += translation);
                area.width += translation;
                for (let column, nextIndex = columnIndex + 1; nextIndex < columns.length; nextIndex++) {
                    column = columns[nextIndex];
                    grid.positionColumnCells(column.id, column.left += translation);
                }
            }
            lastX = pageX;
            grid.refresh();
        },
        onEnd() {
            dispatchResizeAction(grid, column.id, column.width);
        }
    };
});
