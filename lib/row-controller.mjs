let ROW_BUFFER = 0;

export class RowController {

    constructor(grid) {
        this.grid = grid;
        this.rows = [];
        this.row = null;
        this.rowIndex = 0;
        this.topIndex = 0;
        this.bottomIndex = 0;
        this.indices = [];
        this.update = this.render;

        this.createRow = (that, rowIndex) => {
            this.row = this.rows[this.rowIndex = rowIndex];
            if (this.row.id === "header") {
                const node = grid.createHeaderRow(this);
                grid.updateHeaderRow(node, this);
                that.render(node, this);
                return node;
            } else {
                const node = grid.createGridRow(this);
                grid.updateGridRow(node, this);
                that.render(node, this);
                return node;
            }
        };

        this.updateRow = (that, node, rowIndex) => {
            this.row = this.rows[this.rowIndex = rowIndex];
            if (this.row.id === "header") {
                grid.updateHeaderRow(node, this);
                that.render(node, this);
                return node;
            } else {
                grid.updateGridRow(node, this);
                that.render(node, this);
                return node;
            }
        };
    }

    render(parent, that) {
        const {indices} = this;
        let child = parent.firstChild.nextSibling, i = 0;
        while (child && i < indices.length) {
            this.updateRow(that, child, indices[i++]);
            child = child.nextSibling;
        }
        while (child) {
            const exit = child;
            child = child.nextSibling;
            parent.removeChild(exit);
        }
        while (i < indices.length) {
            parent.appendChild(this.createRow(that, indices[i++]));
        }
        parent.classList.toggle("visible", parent.childElementCount);
    }

    layout(rows, scrollTop, clientHeight) {
        const {topIndex, bottomIndex} = this.range(rows, scrollTop, clientHeight);

        const indices = this.indices;
        const create = [];
        const update = [];
        const remove = [];

        const pool = new Map();
        for (let r = 0; r < indices.length; r++) {
            pool.set(this.rows[indices[r]].id, r);
        }

        for (let index = topIndex; index < bottomIndex; ++index) {
            if (pool.delete(rows[index].id)) {
                update.push(index);
            } else {
                create.push(index);
            }
        }
        for (const r of pool.values()) {
            if (create.length > 0) {
                update.push(create.pop());
            } else {
                remove.push(r);
            }
        }

        this.rows = rows;
        this.topIndex = topIndex;
        this.bottomIndex = bottomIndex;
        this.indices = [...update, ...create];

        this.update = (parent, that) => {
            const {childNodes} = parent;
            let r = remove.length;
            while (r > 0) {
                childNodes[1 + remove[--r]].remove();
            }
            for (r = 0; r < update.length; r++) {
                this.updateRow(that, childNodes[1 + r], update[r]);
            }
            for (r = 0; r < create.length; r++) {
                parent.append(this.createRow(that, create[r]));
            }
            parent.classList.toggle("visible", parent.childElementCount);
        };
    }

    sync(scrollTop, clientHeight) {
        const {topIndex, bottomIndex} = this.range(this.rows, scrollTop, clientHeight);

        let enterFrom;
        let enterTo;
        let leaveFrom;
        let leaveTo;

        if (topIndex < this.topIndex || bottomIndex < this.bottomIndex) {
            enterFrom = topIndex;
            enterTo = Math.min(bottomIndex, this.topIndex);
            leaveFrom = Math.max(bottomIndex, this.topIndex);
            leaveTo = this.bottomIndex;
        }

        if (bottomIndex > this.bottomIndex || topIndex > this.topIndex) {
            enterFrom = Math.max(topIndex, this.bottomIndex);
            enterTo = bottomIndex;
            leaveFrom = this.topIndex;
            leaveTo = Math.min(topIndex, this.bottomIndex);
        }

        this.topIndex = topIndex;
        this.bottomIndex = bottomIndex;

        if (enterFrom !== undefined) {
            const indices = this.indices;
            const remove = [];
            const recycle = [];
            const create = [];
            const refresh = [];

            let u = 0, enterIndex = enterFrom;
            for (let r = 0; r < indices.length; r++) {
                const rowIndex = indices[r];
                if (rowIndex < leaveTo && rowIndex >= leaveFrom) {
                    if (enterIndex < enterTo) {
                        recycle.push(u);
                        indices[u++] = enterIndex++;
                    } else {
                        remove.push(r);
                    }
                } else {
                    refresh.push(u);
                    indices[u++] = rowIndex;
                }
            }
            while (enterIndex < enterTo) {
                create.push(enterIndex);
                indices[u++] = enterIndex++;
            }

            indices.length = u;

            this.refresh = (parent, that) => {
                const {childNodes} = parent;
                let r = remove.length;
                while (r > 0) {
                    childNodes[1 + remove[--r]].remove();
                }
                for (r = 0; r < recycle.length; r++) {
                    const i = recycle[r];
                    this.updateRow(that, childNodes[1 + i], indices[i]);
                }
                for (r = 0; r < create.length; r++) {
                    parent.append(this.createRow(that, create[r]));
                }
                if (that.refresh) {
                    for (r = 0; r < refresh.length; r++) {
                        that.refresh(childNodes[1 + refresh[r]], this);
                    }
                }
            };

        } else {

            this.refresh = RowController.prototype.refresh;
        }
    }

    range(rows, top, height) {
        let topIndex = 0;
        let bottomIndex = rows.length;
        if (bottomIndex && height > 0) {
            topIndex = Math.max(topIndex, findRowIndex(rows, top) - ROW_BUFFER);
            bottomIndex = Math.min(bottomIndex, 1 + findRowIndex(rows, top + height) + ROW_BUFFER);
        }
        return {topIndex, bottomIndex};
    }

    refresh(parent, that) {
        if (that.refresh) {
            let {childNodes} = parent;
            for (let i = 0; i < this.indices.length; i++) {
                this.row = this.rows[this.rowIndex = this.indices[i]];
                that.refresh(childNodes[1 + i], this);
            }
        }
    }
}

export function findRowIndex(rows, edge) {
    let middle, distance, start = 0, end = rows.length - 1;
    while (start < end) {
        middle = (start + end) >> 1;
        const {top, height} = rows[middle];
        distance = edge - top;
        if (distance >= height) {
            start = middle + 1; // search to the bottom
        } else if (distance < 0) {
            end = middle - 1; // search to the top
        } else {
            return middle;
        }
    }
    return start;
}

export function layoutRows(rows = []) {
    let top = 0;
    for (let row, r = 0; r < rows.length; r++) {
        row = rows[r];
        top = (row.top = top) + row.height;
    }
    return top;
}
