import {dragndropColumnHandler} from "../features/column-dnd.mjs";
import {autosizeWidthHandler, dragWidthHandler} from "../features/column-resize.mjs";
import icons from "../icons.mjs";
import {SleekGrid} from "../sleek-grid.mjs";
import {useTemplate} from "../utils/index.mjs";

SleekGrid.prototype.createHeaderRow = useTemplate(`
    <div class="undefined header row r-undefined" tabindex="-1"></div>
`);

SleekGrid.prototype.updateHeaderRow = function updateHeaderRow(node, {row, rowIndex}) {
    if (node.row !== row) {
        node.setAttribute("row-id", row.id);
        node.classList.replace(node.classList[0], row.position);
        node.style.transform = `translateY(${row.top}px)`;
        node.style.height = `${row.height}px`;
        node.row = row;

        const padding = Math.min(8, Math.max(2, 2 + (row.height - 32) * 6 / 10));
        node.style.setProperty("--search-input-padding", `${padding}px`);
    }
    if (node.rowIndex !== rowIndex) {
        node.classList.replace(node.classList[3], `r-${rowIndex}`);
        node.rowIndex = rowIndex;
    }
};

SleekGrid.prototype.createStub = useTemplate(`
    <div class="undefined stub cell c-undefined" tabindex="-1">
        <div class="handle width-handle"></div>
        <div class="handle height-handle"></div>
    </div>
`);

SleekGrid.prototype.updateStub = function updateStub(node, {column, columnIndex}) {
    if (node.column !== column) {
        node.classList.replace(node.classList[0], column.position);
        node.setAttribute("column-id", column.id);
        node.style.left = `${column.left}px`;
        node.style.width = `${column.width}px`;
        node.column = column;
    }
    if (node.columnIndex !== columnIndex) {
        node.classList.replace(`c-${node.columnIndex}`, `c-${columnIndex}`);
        node.columnIndex = columnIndex;
    }
};

SleekGrid.prototype.createColumnHeader = useTemplate(`
    <div class="header cell c-undefined" tabindex="-1">
        <div class="handle width-handle"></div>
        <div class="cell-content">
            <input class="search-input" type="text" autocomplete="off" required value="">
            <hr class="search-hr">
            <label class="search-label">
                <p></p>
                <svg class="sort-icon" viewBox="0 0 512 512"><path fill="currentColor" d="${icons.arrowUp}"></path></svg>
            </label>
            <svg class="menu-icon" viewBox="0 0 512 512"><path fill="currentColor" d="${icons.ellipsis}"></path></svg>
        </div>
    </div>
`, function (cell) {
    const handle = cell.firstChild;
    const searchInput = cell.lastChild.firstChild;
    const searchLabel = searchInput.nextSibling.nextSibling;
    const menuIcon = searchLabel.nextSibling;

    const grid = this;

    let focused;
    searchInput.addEventListener("focus", () => {
        focused = true;
        grid.scrollIntoView(searchInput.closest(".cell"));
    });
    searchInput.addEventListener("blur", () => focused = false);
    searchInput.addEventListener("input", event => {
        const id = cell.getAttribute("column-id");
        grid.properties.columns.find(column => column.id === id).search = searchInput.value;
        grid.requestUpdate({action: "filter", columns: [...grid.properties.columns]});
    });

    menuIcon.addEventListener("click", (event) => {
        const {left, top} = menuIcon.getBoundingClientRect();
        const menu = document.createElement("dialog");
        menu.className = `ch menu`;
        requestAnimationFrame(function () {
            menu.setAttribute("open", "");
        });
        menu.style.marginLeft = `${left - 4}px`;
        menu.style.top = `${top}px;`;
        menu.innerHTML = `
            <div class="item">Pin Column</div>
            <div class="item">Clear Search</div>
            <div class="separator"><div class="line"></div></div>
            <div class="item">Hide Column</div>
        `;
        menu.addEventListener("click", function () {
            menu.removeAttribute("open");
            setTimeout(function () {
                menu.remove();
            }, 300);
        });
        grid.root.append(menu);
    }, true);

    searchLabel.addEventListener("click", (event) => {
        const {extentOffset, anchorOffset, focusNode} = grid.root.getSelection();
        if (extentOffset === anchorOffset || focusNode.parentNode !== event.target) {
            searchInput.focus();
        }
    }, false);

    const sortIcon = searchLabel.lastChild;

    sortIcon.addEventListener("pointerdown", event => {
        event.preventDefault();
        event.stopPropagation();
    });

    sortIcon.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const id = cell.getAttribute("column-id");
        grid.requestUpdate({
            action: "sort",
            columns: [...grid.properties.columns.map(column => {
                if (column.id === id) {
                    return {...column, sort: !column.sort ? "asc" : column.sort === "asc" ? "desc" : undefined};
                } else {
                    return {...column, sort: undefined};
                }
            })]
        });
    });

    if (grid.features.resize.columns) {
        handle.addEventListener("dblclick", autosizeWidthHandler);
        handle.addEventListener("pointerdown", dragWidthHandler);
    }

    if (grid.features.dnd.columns) {
        searchLabel.addEventListener("pointerdown", dragndropColumnHandler);
    }
});

SleekGrid.prototype.updateColumnHeader = function updateColumnHeader(node, {column, columnIndex}) {
    if (node.columnIndex !== columnIndex) {
        node.classList.replace(`c-${node.columnIndex}`, `c-${columnIndex}`);
        node.columnIndex = columnIndex;
    }
    if (node.column !== column) {
        node.setAttribute("column-id", column.id);
        node.style.left = `${(column.left)}px`;
        node.style.width = `${(column.width)}px`;
        node.column = column;
    }

    const headerLabel = node.childNodes[1].childNodes[2];
    headerLabel.firstChild.replaceWith(column.label);

    const headerInput = node.childNodes[1].childNodes[0];
    if (headerInput.value !== column.search) {
        headerInput.value = column.search || "";
        if (column.search) {
            node.setAttribute("search", column.search);
        } else {
            node.removeAttribute("search");
        }
    }

    if (column.sort) {
        node.setAttribute("sort", column.sort);
    } else {
        node.removeAttribute("sort");
    }
};
