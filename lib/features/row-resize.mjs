import {createAutosizeHandler, createDragHandler, rowContext} from "../utils/index.mjs";

function dispatchResizeAction(grid, id, rowHeight) {
    const {rows} = grid.properties;
    rows[rows.findIndex(row => row.id === id)].height = rowHeight;
}

export const autosizeHeightHandler = createAutosizeHandler((cell, grid) => {
    const {
        area,
        rows,
        rowIndex,
        row
    } = rowContext(cell);

    const translation = Math.round(grid.autoRowHeight(row) - row.height);
    if (translation) {
        row.height += translation;
        area.height += translation;
        grid.resizeRowElements(row.id, row.height);
        for (let row, nextIndex = rowIndex + 1; nextIndex < rows.length; nextIndex++) {
            row = rows[nextIndex];
            grid.positionRowElements(row.id, row.top += translation);
        }
        dispatchResizeAction(grid, row.id, row.height);
    }

});

export const dragHeightHandler = createDragHandler(function ({pageY: lastY}, cell, grid) {
    const {
        area,
        rows,
        rowIndex,
        row
    } = rowContext(cell);

    let translation = 0;
    return {
        onMove({pageY}, stop) {
            let height = row.height + pageY - lastY;
            if (row.maxHeight !== undefined) {
                height = Math.min(height, row.maxHeight);
            }
            if (row.minHeight !== undefined) {
                height = Math.max(height, row.minHeight);
            } else {
                height = Math.max(height, 32);
            }
            translation = Math.round(height - row.height);
            if (translation) {
                grid.resizeRowElements(row.id, row.height += translation);
                area.height += translation;
                for (let row, nextIndex = rowIndex + 1; nextIndex < rows.length; nextIndex++) {
                    row = rows[nextIndex];
                    grid.positionRowElements(row.id, row.top += translation);
                }
            }
            lastY = pageY;
            grid.refresh();
        },
        onEnd() {
            dispatchResizeAction(grid, row.id, row.height);
        }
    };
});

