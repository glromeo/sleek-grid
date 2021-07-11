import {autosizeHeightHandler, dragHeightHandler} from "../features/row-resize.mjs";
import {SleekGrid} from "../sleek-grid.mjs";
import {useTemplate} from "../utils/index.mjs";

SleekGrid.prototype.createGridRow = useTemplate(`
    <div class="row r-undefined" tabindex="-1"></div>
`);

SleekGrid.prototype.updateGridRow = function updateGridRow(node, {row, rowIndex}) {
    if (node.row !== row) {
        node.setAttribute("row-id", row.id);
        node.style.transform = `translateY(${(row.top)}px)`;
        node.style.height = `${(row.height)}px`;
        node.row = row;
    }
    if (node.rowIndex !== rowIndex) {
        node.classList.replace(node.classList[1], `r-${rowIndex}`);
        if (rowIndex % 2) {
            node.className = `row odd r-${rowIndex}`;
        } else {
            node.className = `row even r-${rowIndex}`;
        }
        node.rowIndex = rowIndex;
    }
};


SleekGrid.prototype.createGridCell = useTemplate(`
    <div class="cell c-undefined">
        <div class="cell-text"></div>
    </div>
`);

SleekGrid.prototype.updateGridCell = function updateGridCell(node, {column, columnIndex}, {row}) {
    if (node.columnIndex !== columnIndex) {
        node.classList.replace(node.classList[1], `c-${columnIndex}`);
        node.columnIndex = columnIndex;
    }
    if (node.column !== column) {
        node.setAttribute("column-id", column.id);
        node.style.left = `${(column.left)}px`;
        node.style.width = `${(column.width)}px`;
        node.column = column;
    }
    this.renderCell(node.firstChild, column, row);
};


SleekGrid.prototype.createRowHeader = useTemplate(`
    <div class="undefined header cell c-undefined">
        <div class="cell-text"></div>
        <div class="handle height-handle"></div>
    </div>
`, function ({lastChild: handle}) {
    if (this.features.resize.columns) {
        handle.addEventListener("dblclick", autosizeHeightHandler);
        handle.addEventListener("pointerdown", dragHeightHandler);
    }
});

SleekGrid.prototype.updateRowHeader = function updateRowHeader(node, {column, columnIndex}, {row}) {
    if (node.columnIndex !== columnIndex) {
        node.classList.replace(node.classList[3], `c-${columnIndex}`);
        node.columnIndex = columnIndex;
    }
    if (node.column !== column) {
        node.setAttribute("column-id", column.id);
        node.classList.replace(node.classList[0], column.position);
        node.style.left = `${(column.left)}px`;
        node.style.width = `${(column.width)}px`;
        node.column = column;
    }
    node.firstChild.innerText = row[column.field];
};


