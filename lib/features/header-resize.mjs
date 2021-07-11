import {createAutosizeHandler, createDragHandler} from "../utils/index.mjs";

export function columnResize(grid, columnHeader) {

    const {
        stub,
        scrollArea,
        sizer
    } = grid;

    function headerWidthResizing({pageX: initialPageX}) {
        const initialWidth = stub.clientWidth;
        return ({pageX}) => {
            let width = initialWidth + Math.ceil(pageX - initialPageX);
            let delta = width - stub.clientWidth;
            if (Math.abs(delta) > 3) {
                stub.style.width = `${width}px`;
                grid.setHeaderWidth(width);
            }
        };
    }

    // function headerHeightResizing({pageY: initialPageY}) {
    //     const initialHeight = stub.clientHeight;
    //     return ({pageY}) => {
    //         let height = initialHeight + Math.ceil(pageY - initialPageY);
    //         let delta = height - stub.clientHeight;
    //         if (Math.abs(delta) > 3) {
    //             stub.style.height = `${height}px`;
    //             grid.setHeaderHeight(height);
    //         }
    //     };
    // }

    function resizeColumnCells(id, width) {
        const widthPx = `${width}px`;
        for (const {style} of scrollArea.querySelectorAll(`.c-${id}`)) {
            style.width = widthPx;
        }
    }

    function positionColumnCells(id, left) {
        const leftPx = `${left}px`;
        for (const {style} of scrollArea.querySelectorAll(`.c-${id}`)) {
            style.left = leftPx;
        }
    }

    function columnResizing({pageX: lastX}, handle) {
        const {columns, rightIndex} = grid;
        const headerCell = handle.parentElement;
        const columnIndex = headerCell.columnIndex;
        const column = columns[columnIndex];
        let translation;
        return ({pageX}) => {
            if (pageX !== undefined) {
                let width = column.width + pageX - lastX;
                if (column.maxWidth !== undefined) {
                    width = Math.min(width, column.maxWidth);
                }
                if (column.minWidth !== undefined) {
                    width = Math.max(width, column.minWidth);
                } else {
                    width = Math.max(width, 20);
                }
                const translation = Math.round(width - column.width);
                if (translation) {
                    resizeColumnCells(columnIndex, column.width += translation);
                    for (let nextIndex = columnIndex + 1; nextIndex < rightIndex; nextIndex++) {
                        positionColumnCells(nextIndex, columns[nextIndex].left += translation);
                    }
                }
                lastX = pageX;
            } else {
                if (translation) {
                    for (let nextIndex = rightIndex; nextIndex < columns.length; nextIndex++) {
                        positionColumnCells(nextIndex, columns[nextIndex].left += translation);
                    }
                }
                grid.layout({columns});
                grid.refresh();
            }
        };
    }

    function maxWidth(columnIndex) {
        const column = grid.columns[columnIndex];// broken!
        let width = 0;
        for (const row of grid.rows) {
            width = Math.max(width, sizer(column, row).clientWidth);
        }
        return width;
    }

    function columnFitCallback(columnIndex, columnWidth) {
        const {columns} = grid;
        const column = columns[columnIndex];
        const translation = columnWidth - column.width;

        resizeColumnCells(columnIndex, column.width = columnWidth);

        for (let nextColumnIndex = columnIndex + 1; nextColumnIndex < columns.length; ++nextColumnIndex) {
            positionColumnCells(nextColumnIndex, columns[nextColumnIndex].left += translation);
        }

        grid.layout({columns});
    }


    const autosizeWidth = createAutosizeHandler(maxWidth, columnFitCallback);
    columnHeader.addEventListener("dblclick", event => {
        const handle = event.target.closest(".handle");
        if (handle) {
            if (handle.classList.contains("width-handle")) {
                autosizeWidth(event);
            }
        }
    });

    // stub.querySelector(".width-handle").addEventListener("pointerdown", createDragHandler(headerWidthResizing));

    columnHeader.addEventListener("pointerdown", createDragHandler(columnResizing, ".width-handle"));
}
