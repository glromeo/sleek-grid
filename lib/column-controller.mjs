let COLUMN_BUFFER = 0;

export class ColumnController {

    constructor(grid) {
        this.grid = grid;
        this.columns = [];
        this.column = null;
        this.columnIndex = 0;
        this.leftIndex = 0;
        this.rightIndex = 0;
        this.indices = [];
        this.refresh = null;

        this.createCell = (that, columnIndex) => {
            this.column = this.columns[this.columnIndex = columnIndex];
            if (that.row.id === "header") {
                if (this.column.id === "header") {
                    const node = grid.createStub();
                    grid.updateStub(node, this);
                    return node;
                } else {
                    const node = grid.createColumnHeader();
                    grid.updateColumnHeader(node, this);
                    return node;
                }
            } else {
                if (this.column.id === "header") {
                    const node = grid.createRowHeader();
                    grid.updateRowHeader(node, this, that);
                    return node;
                } else {
                    const node = grid.createGridCell();
                    grid.updateGridCell(node, this, that);
                    return node;
                }
            }
        };

        this.updateCell = (that, node, columnIndex) => {
            this.column = this.columns[this.columnIndex = columnIndex];
            if (that.row.id === "header") {
                if (this.column.id === "header") {
                    grid.updateStub(node, this);
                    return node;
                } else {
                    grid.updateColumnHeader(node, this);
                    return node;
                }
            } else {
                if (this.column.id === "header") {
                    grid.updateRowHeader(node, this, that);
                    return node;
                } else {
                    grid.updateGridCell(node, this, that);
                    return node;
                }
            }
        };
    }

    render(parent, that) {
        const {indices} = this;
        let child = parent.firstChild, c = 0;
        while (child && c < indices.length) {
            this.updateCell(that, child, indices[c++]);
            child = child.nextSibling;
        }
        while (child) {
            const exit = child;
            child = child.nextSibling;
            parent.removeChild(exit);
        }
        while (c < indices.length) {
            parent.append(this.createCell(that, indices[c++]));
        }
    }

    layout(columns, scrollLeft, clientWidth) {
        const {leftIndex, rightIndex} = this.range(columns, scrollLeft, clientWidth);

        const indices = this.indices;
        const create = [];
        const update = [];
        const remove = [];

        const pool = new Map();
        for (let c = 0; c < indices.length; c++) {
            pool.set(this.columns[indices[c]].id, c);
        }

        for (let index = leftIndex; index < rightIndex; ++index) {
            if (pool.delete(columns[index].id)) {
                update.push(index);
            } else {
                create.push(index);
            }
        }
        for (const c of pool.values()) {
            if (create.length > 0) {
                update.push(create.pop());
            } else {
                remove.push(c);
            }
        }

        this.columns = columns;
        this.leftIndex = leftIndex;
        this.rightIndex = rightIndex;
        this.indices = [...update, ...create];

        if (update.length || create.length) {
            this.update = (parent, that) => {
                const {childNodes} = parent;
                let c = remove.length;
                while (c > 0) {
                    childNodes[remove[--c]].remove();
                }
                for (c = 0; c < update.length; c++) {
                    this.updateCell(that, childNodes[c], update[c]);
                }
                for (c = 0; c < create.length; c++) {
                    parent.append(this.createCell(that, create[c]));
                }
            };
        } else {
            this.update = ColumnController.prototype.update;
        }
    }

    update(parent, that) {
        for (const child of parent.childNodes) {
            this.updateCell(that, child, child.columnIndex);
        }
    }

    sync(scrollLeft, clientWidth) {
        const {leftIndex, rightIndex} = this.range(this.columns, scrollLeft, clientWidth);

        let enterFrom;
        let enterTo;
        let leaveFrom;
        let leaveTo;

        if (leftIndex < this.leftIndex || rightIndex < this.rightIndex) {
            enterFrom = leftIndex;
            enterTo = Math.min(this.leftIndex, rightIndex);
            leaveFrom = Math.max(this.leftIndex, rightIndex);
            leaveTo = this.rightIndex;
        }

        if (rightIndex > this.rightIndex || leftIndex > this.leftIndex) {
            enterFrom = Math.max(this.rightIndex, leftIndex);
            enterTo = rightIndex;
            leaveFrom = this.leftIndex;
            leaveTo = Math.min(this.rightIndex, leftIndex);
        }

        this.leftIndex = leftIndex;
        this.rightIndex = rightIndex;

        if (enterFrom !== undefined) {

            const indices = this.indices;
            const remove = [];
            const recycle = [];
            const create = [];

            let u = 0, enterIndex = enterFrom;
            for (let c = 0; c < indices.length; c++) {
                const columnIndex = indices[c];
                if (columnIndex < leaveTo && columnIndex >= leaveFrom) {
                    if (enterIndex < enterTo) {
                        recycle.push(u);
                        indices[u++] = enterIndex++;
                    } else {
                        remove.push(c);
                    }
                } else {
                    indices[u++] = columnIndex;
                }
            }
            while (enterIndex < enterTo) {
                create.push(enterIndex);
                indices[u++] = enterIndex++;
            }

            indices.length = u;

            this.refresh = (parent, that) => {
                const childNodes = parent.childNodes;
                let c = remove.length;
                while (c > 0) {
                    parent.removeChild(childNodes[remove[--c]]);
                }
                for (c = 0; c < recycle.length; c++) {
                    const i = recycle[c];
                    this.updateCell(that, childNodes[i], indices[i]);
                }
                for (c = 0; c < create.length; c++) {
                    parent.append(this.createCell(that, create[c]));
                }
            };
        } else {
            this.refresh = null;
        }
    }

    range(columns, left, width) {
        let leftIndex = 0;
        let rightIndex = columns.length;
        if (rightIndex && width > 0) {
            leftIndex = Math.max(leftIndex, findColumnIndex(columns, left) - COLUMN_BUFFER);
            rightIndex = Math.min(rightIndex, 1 + findColumnIndex(columns, left + width) + COLUMN_BUFFER);
        }
        return {leftIndex, rightIndex};
    }
}

export function findColumnIndex(columns, edge) {
    let middle, distance, start = 0, end = columns.length - 1;
    while (start < end) {
        middle = (start + end) >> 1;
        const {left, width} = columns[middle];
        distance = edge - left;
        if (distance >= width) {
            start = middle + 1; // search to the right
        } else if (distance < 0) {
            end = middle - 1; // search to the left
        } else {
            return middle;
        }
    }
    return start;
}

export function layoutColumns(columns = []) {
    let left = 0;
    for (let column, c = 0; c < columns.length; c++) {
        column = columns[c];
        left = (column.left = left) + column.width;
    }
    return left;
}
