import {layoutColumns} from "./column-controller.mjs";
import {layoutRows} from "./row-controller.mjs";
import {sleekStyle} from "./styles/sleek.mjs";
import {staticStyle} from "./styles/static.mjs";
import {applyFilter, applySort, assignIds, createFilter, sourceURL, textWidth, useSizer} from "./utils/index.mjs";

let instanceId = 0;

export class SleekGrid extends HTMLElement {

    #columns;
    #rows;

    constructor() {
        super();

        this.features = {
            header: {
                width: 0,
                height: 0,
                top: false,
                right: false,
                bottom: false,
                left: false
            },
            sticky: {
                top: null,
                right: null,
                bottom: null,
                left: null
            },
            resize: {
                columns: false,
                rows: false
            },
            dnd: {
                columns: false,
                rows: false
            },
            autosize: "quick"
        };

        this.pendingUpdate = {};
        this.properties = {
            rows: [],
            columns: []
        };
        this.#rows = this.properties.rows;
        this.#columns = this.properties.columns;

        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.adoptedStyleSheets = [
            staticStyle,
            sleekStyle,
            new CSSStyleSheet()
        ];
        shadowRoot.appendChild(this.createRoot());

        this.root = shadowRoot.getElementById("root");
        this.viewPort = shadowRoot.getElementById("view-port");

        this.theme = "light";
        this.cellSize = useSizer(this, shadowRoot.getElementById("sizer"));

        let af, refresh = (event) => {
            cancelAnimationFrame(af);
            af = requestAnimationFrame(() => {
                if (Array.isArray(event)) {
                    this.viewPort.refresh(this.getBoundingClientRect());
                }
                this.refresh();
            });
        };

        new ResizeObserver(refresh).observe(this.viewPort);
        this.viewPort.addEventListener("scroll", refresh, {capture: true, passive: true});

        this.window = {left: 0, top: 0, width: 0, height: 0};

        this.sourceURL = sourceURL.bind(`grid-${instanceId++}`);
    }

    // =========================================================================================================
    // MOUNT/UNMOUNT
    // =========================================================================================================

    static get observedAttributes() {
        return [
            "theme",
            "column-header",
            "column-resize",
            "column-dnd",
            "row-header",
            "row-resize",
            "row-dnd",
            "sticky-top",
            "sticky-right",
            "sticky-bottom",
            "sticky-left",
            "autosize"
        ];
    }

    set theme(mode) {

        const {style} = this.shadowRoot.getElementById("root");

        if (mode === "dark") {
            style.setProperty("--primary-color", "dodgerblue");
            style.setProperty("--text-color", "white");
            style.setProperty("--background-color", "#444");
            style.setProperty("--even-rows-background", "#222");
            style.setProperty("--odd-rows-background", "#111");
            style.setProperty("--border-color", "#333");
            style.setProperty("--shadow-color", "rgba(0, 0, 0, 1)");
            style.setProperty("--border-color-active", "white");
        } else {
            style.setProperty("--primary-color", "dodgerblue");
            style.setProperty("--text-color", "black");
            style.setProperty("--background-color", "white");
            style.setProperty("--even-rows-background", "white");
            style.setProperty("--odd-rows-background", "#eee");
            style.setProperty("--border-color", "lightgrey");
            style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.25)");
            style.setProperty("--border-color-active", "black");
        }
    }

    // =========================================================================================================
    // ATTRIBUTES & PROPERTIES
    // =========================================================================================================

    get columns() {
        return this.#columns;
    }

    set columns(columns) {
        if (Array.isArray(columns) && columns.length) {
            if (typeof columns[0] === "string") {
                columns = columns.map((label, index) => ({id: String(index), label, field: index}));
            }
            assignIds(columns);
        }
        this.requestUpdate({columns: columns ?? []});
    }

    get rows() {
        return this.#rows;
    }

    set rows(rows) {
        if (Array.isArray(rows) && rows.length) {
            assignIds(rows);
        }
        this.requestUpdate({rows: rows ?? []});
    }

    connectedCallback() {

        this.setAttribute("grid-id", this.gridId);

        this.useHighlight();

        this.update(this.pendingUpdate);
        this.pendingUpdate = null;

        const {width, height} = this.viewPort.getBoundingClientRect();
        this.window.left = this.viewPort.scrollLeft;
        this.window.top = this.viewPort.scrollTop;
        this.window.width = width;
        this.window.height = height;
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, old, value) {
        switch (name) {
            case "theme": {
                return this.theme = value;
            }
            case "column-header": {
                const {header} = this.features;
                header.top = header.bottom = false;
                if (value) {
                    const position = !/bottom/i.test(value) ? "top" : "bottom";
                    header[position] = true;
                }
                this.requestUpdate({features: {...this.features, header}});
                return;
            }
            case "row-header": {
                const {header} = this.features;
                header.left = header.right = false;
                if (value) {
                    const position = !/right/i.test(value) ? "left" : "right";
                    header[position] = true;
                }
                this.requestUpdate({features: {...this.features, header}});
                return;
            }
            case "sticky-top":
            case "sticky-right":
            case "sticky-bottom":
            case "sticky-left": {
                const {sticky} = this.features;
                const position = name.split("-")[1];
                if (value) {
                    const items = sticky[position] = {};
                    for (const id of value.split(",")) {
                        items[id] = true;
                    }
                } else {
                    sticky[position] = null;
                }
                this.requestUpdate({features: {...this.features, sticky}});
                return;
            }
            case "column-resize": {
                const {resize} = this.features;
                resize.columns = !(value === null || value === "false");
                this.requestUpdate({features: {...this.features, resize}});
                return;
            }
            case "row-resize": {
                const {resize} = this.features;
                resize.rows = !(value === null || value === "false");
                this.requestUpdate({features: {...this.features, resize}});
                return;
            }
            case "column-dnd": {
                const {dnd} = this.features;
                dnd.columns = !(value === null || value === "false");
                this.requestUpdate({features: {...this.features, dnd}});
                return;
            }
            case "row-dnd": {
                const {dnd} = this.features;
                dnd.rows = !(value === null || value === "false");
                this.requestUpdate({features: {...this.features, dnd}});
                return;
            }
            case "autosize": {
                const autosize = !(value === null || value === "false");
                this.requestUpdate({features: {...this.features, autosize}});
                return;
            }
        }
    }

    requestUpdate(changed = this.properties) {
        if (!this.pendingUpdate) {
            this.pendingUpdate = Object.create(null);
            if (this.shadowRoot) setTimeout(() => {
                this.update(this.pendingUpdate);
                this.pendingUpdate = null;
            }, 0);
        }
        Object.assign(this.pendingUpdate, changed);
    }

    update(changed = this.properties) {
        Object.assign(this.properties, changed);
        const properties = Object.assign(Object.create(this.properties), changed);
        this.filter(properties);
        this.sort(properties);
        this.layout(properties);
        this.render(properties);
    }

    // =========================================================================================================
    // RENDERING
    // =========================================================================================================

    filter(properties) {
        let {columns, rows} = properties;
        if (columns || rows) {
            columns = columns ?? this.#columns;
            rows = rows ?? this.#rows;
            const filter = createFilter(this, columns);
            if (filter) {
                rows = applyFilter(filter, rows);
                if (rows !== this.#rows) {
                    if (filter && rows.length === 0) {
                        rows = [columns.reduce(function (row, column) {
                            if (column.search) {
                                row[column.field] = "NO MATCH";
                            }
                            row.id = "";
                            return row;
                        }, {})];
                    }
                    properties.rows = rows;
                }
            }
        }
    }

    sort(properties) {
        let {columns, rows} = properties;
        if (columns || rows) {
            rows = applySort(columns ?? this.#columns, rows ?? this.#rows);
            if (rows !== this.#rows) {
                properties.rows = rows;
            }
        }
    }

    layout(properties) {
        let {action, columns, rows, features} = properties;

        const rect = this.viewPort.getBoundingClientRect();

        if (features) {
            if (features.sticky || features.header) {
                columns = columns ?? this.#columns;
                rows = rows ?? this.#rows;
                this.viewPort.layout();
            }
            this.features = features;
        }

        let {
            top, right, bottom, left, center,
            scrollTop, clientHeight,
            scrollLeft, clientWidth
        } = this.viewPort;

        // =============================================================================================================
        // FROM THIS POINT on DON'T access the DOM for READING (e.g. viewWidth)...
        // =============================================================================================================

        if (columns) {
            if (!action) this.autosizeColumns(columns, rows ?? this.#rows, clientWidth);

            const slices = this.sliceColumns(columns);

            if (left) {
                const slice = slices.left;
                left.width = layoutColumns(slice);
                left.columnCtrl.layout(slice);
                left.columns = slice;
                if (top) {
                    top.left.columns = slice;
                }
                if (bottom) {
                    bottom.left.columns = slice;
                }
                clientWidth -= left.width;
            }

            if (right) {
                const slice = slices.right;
                right.width = layoutColumns(slice);
                right.columnCtrl.layout(slice);
                right.columns = slice;
                if (top) {
                    top.right.columns = slice;
                }
                if (bottom) {
                    bottom.right.columns = slice;
                }
                clientWidth -= right.width;
            }

            const slice = slices.center;
            center.width = Math.max(layoutColumns(slice), clientWidth - ((left?.width ?? 8) + (right?.width ?? 8)));
            center.columnCtrl.layout(slice, scrollLeft, clientWidth);

            center.columns = slice;
            if (top) top.columns = slice;
            if (bottom) bottom.columns = slice;

            this.#columns = columns;
            this.window.width = clientWidth;
        }

        if (rows) {
            if (!action) this.autosizeRows(rows, clientHeight);

            const slices = this.sliceRows(rows);

            if (top) {
                const slice = slices.top;
                top.height = layoutRows(slice);
                top.rowCtrl.layout(slice);
                top.rows = slice;
                if (left) {
                    top.left.rows = slice;
                }
                if (right) {
                    top.right.rows = slice;
                }
                clientHeight -= top.height;
            }

            if (bottom) {
                const slice = slices.bottom;
                bottom.height = layoutRows(slice);
                bottom.rowCtrl.layout(slice);
                bottom.rows = slice;
                if (left) {
                    bottom.left.rows = slice;
                }
                if (right) {
                    bottom.right.rows = slice;
                }
                clientHeight -= bottom.height;
            }

            const slice = slices.center;
            center.height = Math.max(layoutRows(slice), clientHeight - ((top?.height ?? 8) + (bottom?.height ?? 8)));
            center.rowCtrl.layout(slice, scrollTop, clientHeight);

            center.rows = slice;
            if (left) left.rows = slice;
            if (right) right.rows = slice;

            this.#rows = rows;
            this.window.height = clientHeight;
        }

        this.window.left = scrollLeft;
        this.window.top = scrollTop;

        this.viewPort.refresh(rect);
    }

    render({columns, rows}) { // TODO : maybe further optimization

        const {top, right, bottom, left, center} = this.viewPort;

        const {rowCtrl, columnCtrl} = center;
        rowCtrl.update(center, columnCtrl);
        if (top) {
            top.rowCtrl.update(top, columnCtrl);
        }
        if (bottom) {
            bottom.rowCtrl.update(bottom, columnCtrl);
        }
        if (left) {
            rowCtrl.update(left, left.columnCtrl);
            if (top) {
                top.rowCtrl.update(top.left, left.columnCtrl);
            }
            if (bottom) {
                bottom.rowCtrl.update(bottom.left, left.columnCtrl);
            }
        }
        if (right) {
            rowCtrl.update(right, right.columnCtrl);
            if (top) {
                top.rowCtrl.update(top.right, right.columnCtrl);
            }
            if (bottom) {
                bottom.rowCtrl.update(bottom.right, right.columnCtrl);
            }
        }
    }

    scrollTo(x, y) {
        this.viewPort.scrollTo(x, y);
    }

    refresh() {
        let {
            top, right, bottom, left, center,
            scrollTop, scrollLeft,
            clientHeight, clientWidth
        } = this.viewPort;

        this.window.left = scrollLeft;
        this.window.top = scrollTop;

        if (top) {
            clientHeight -= top.height;
        }
        if (right) {
            clientWidth -= right.width;
        }
        if (bottom) {
            clientHeight -= bottom.height;
        }
        if (left) {
            clientWidth -= left.width;
        }

        this.window.width = clientWidth;
        this.window.height = clientHeight;

        const {rowCtrl, columnCtrl} = center;

        columnCtrl.sync(scrollLeft, clientWidth);
        rowCtrl.sync(scrollTop, clientHeight);

        if (columnCtrl.refresh) {
            if (top) {
                top.rowCtrl.refresh(top, columnCtrl);
            }
            if (bottom) {
                bottom.rowCtrl.refresh(bottom, columnCtrl);
            }
        }
        if (left) {
            rowCtrl.refresh(left, left.columnCtrl);
        }
        rowCtrl.refresh(center, columnCtrl);
        if (right) {
            rowCtrl.refresh(right, right.columnCtrl);
        }

        this.pending = null;
    }

    // =========================================================================================================
    // Grid API
    // =========================================================================================================

    autosizeColumns(columns, rows = this.#rows, maxWidth) {
        const autosize = this.features.autosize;
        if (autosize === "quick") {
            for (let c = 0; c < columns.length; c++) {
                const {field, label} = columns[c];
                let width = textWidth(label);
                for (let r = 0; r < rows.length; r++) {
                    width = Math.max(width, textWidth(rows[r][field]));
                }
                columns[c].width = this.limit("column-width", width + 18);
            }
        } else if (autosize === true) {

        } else {
            for (let c = 0; c < columns.length; c++) {
                columns[c].width = this.limit("column-width", textWidth(columns[c].label) + 18);
            }
        }
    }

    autoColumnWidth(column, rows = this.#rows) {
        let width = textWidth(column.label);
        for (const row of rows) {
            width = Math.max(width, this.cellSize(column, row).clientWidth);
        }
        return this.limit("column-width", width + 18);
    }

    autosizeRows(rows, maxHeight) {
        const autosize = this.features.autosize;
        for (let row, r = 0; r < rows.length; r++) {
            row = rows[r];
            row.height = this.limit("row-height", 32);
        }
    }

    autoRowHeight(row, columns = this.#columns) {
        let height = 0;
        for (const column of columns) {
            height = Math.max(height, this.cellSize(column, row).clientHeight);
        }
        return height;
    }

    limit(dimension, value) {
        let min = this.getAttribute(`min-${dimension}`);
        if (min !== null) {
            value = Math.max(value, parseInt(min));
        }
        let max = this.getAttribute(`max-${dimension}`);
        if (max !== null) {
            value = Math.min(value, parseInt(max));
        }
        return value;
    }

    renderCell(cell, column, row) {
        cell.innerText = row[column.field] ?? "";
    }

    setHeaderWidth(width) {
        this.features.header.width = width;
        this.style.setProperty("--header-width", `${width}px`);
    };

    setHeaderHeight(height) {
        this.features.header.height = height;
        this.style.setProperty("--header-height", `${height}px`);
        const padding = Math.min(8, Math.max(2, 2 + (height - 32) * 6 / 10));
        this.style.setProperty("--search-input-padding", `${padding}px`);
    };

    sliceColumns(columns) {
        const {header, sticky} = this.features;
        const stickyLeft = sticky?.left ?? {};
        const stickyRight = sticky?.right ?? {};

        const center = [];
        const left = header?.left ? [{id: "header", field: "id", width: 50, position: "left"}] : [];
        const right = [];

        for (let column, c = 0; c < columns.length; c++) {
            column = {...columns[c]};
            if (stickyLeft[column.id]) {
                left.push(column);
                continue;
            }
            if (stickyRight[column.id]) {
                right.push(column);
                continue;
            }
            center.push(column);
        }

        if (header.right) right.push({id: "header", field: "label", width: 50, position: "right"});

        return {center, left, right};
    }

    sliceRows(rows) {
        const {header, sticky} = this.features;
        const stickyTop = sticky?.top ?? {};
        const stickyBottom = sticky?.bottom ?? {};

        const center = [];
        const top = header.top ? [{id: "header", field: "label", height: 32, position: "top"}] : [];
        const bottom = [];

        for (let row, r = 0; r < rows.length; r++) {
            row = {...rows[r]};
            if (stickyTop[row.id]) {
                top.push(row);
                continue;
            }
            if (stickyBottom[row.id]) {
                bottom.push(row);
                continue;
            }
            center.push(row);
        }

        if (header.bottom) bottom.push({id: "header", field: "id", height: 32, position: "bottom"});

        return {center, top, bottom};
    }

}

