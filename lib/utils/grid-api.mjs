import {SleekGrid} from "../sleek-grid.mjs";

SleekGrid.prototype.queryColumnCells = function (columnId) {
    return this.viewPort.querySelectorAll(`[column-id="${columnId}"]`);
};

SleekGrid.prototype.queryRowCells = function (rowId) {
    return this.viewPort.querySelectorAll(`[row-id="${rowId}"] .cell`);
};

SleekGrid.prototype.resizeColumnCells = function resizeColumnCells(id, width) {
    const widthPx = `${width}px`;
    for (const {style} of this.queryColumnCells(id)) {
        style.width = widthPx;
    }
};

SleekGrid.prototype.positionColumnCells = function positionColumnCells(id, left) {
    const leftPx = `${left}px`;
    const columnCells = this.queryColumnCells(id);
    for (const {style} of columnCells) {
        style.left = leftPx;
    }
    return columnCells;
};

SleekGrid.prototype.queryRowParts = function (rowId) {
    return this.viewPort.querySelectorAll(`[row-id="${rowId}"]`);
};

SleekGrid.prototype.resizeRowParts = function resizeRowParts(id, height) {
    const heightPx = `${height}px`;
    for (const {style} of this.queryRowParts(id)) {
        style.height = heightPx;
    }
};

SleekGrid.prototype.positionRowParts = function positionRowParts(id, top) {
    const transform = `translateY(${top}px)`;
    const rowParts = this.queryRowParts(id);
    for (const {style} of rowParts) {
        style.transform = transform;
    }
    return rowParts;
};

