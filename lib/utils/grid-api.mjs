import {SleekGrid} from "../sleek-grid.mjs";

SleekGrid.prototype.queryColumnCells = function (columnId) {
    return this.viewPort.querySelectorAll(`[column-id="${columnId}"]`);
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

SleekGrid.prototype.queryRowElements = function (rowId) {
    return this.viewPort.querySelectorAll(`[row-id="${rowId}"]`);
};

SleekGrid.prototype.resizeRowElements = function resizeRowElements(id, height) {
    const heightPx = `${height}px`;
    for (const {style} of this.queryRowElements(id)) {
        style.height = heightPx;
    }
};

SleekGrid.prototype.positionRowElements = function positionRowElements(id, top) {
    const transform = `translateY(${top}px)`;
    for (const {style} of this.queryRowElements(id)) {
        style.transform = transform;
    }
};

