import {ColumnController} from "../column-controller.mjs";
import {RowController} from "../row-controller.mjs";
import {SleekGrid} from "../sleek-grid.mjs";
import {useTemplate} from "../utils/index.mjs";
import {defineStyleVariable, linkStyleVariable} from "./grid-area.mjs";

SleekGrid.prototype.createRoot = useTemplate(`
    <div id="root">
        <div class="row-shadow"></div>
        <div class="column-shadow"></div>
        <div id="view-port">
            <div id="sizer"></div>
            <!--top-left-->
            <!--top-->
            <!--top-right-->
            <!--left-->
            <!--center-->
            <!--right-->
            <!--bottom-left-->
            <!--bottom-->
            <!--bottom-right-->
        </div>
    </div>
`, function (root) {

    const viewPortElement = root.querySelector("#view-port");

    const treeWalker = document.createTreeWalker(viewPortElement, NodeFilter.SHOW_COMMENT);
    while (treeWalker.nextNode()) {
        const placeholder = treeWalker.currentNode;
        let slot = null;
        Object.defineProperty(viewPortElement, placeholder.textContent, {
            get() {
                return slot;
            },
            set(area) {
                if (!area) area = placeholder;
                if (!slot) slot = placeholder;
                slot.replaceWith(area);
                if (area === placeholder) {
                    slot = null;
                } else {
                    slot = area;
                }
            }
        });
    }

    const grid = this;

    const center = viewPortElement["center"] = grid.createArea("center");
    center.columnCtrl = new ColumnController(grid);
    center.rowCtrl = new RowController(grid);
    center.visibleRect = {...viewPortElement.getBoundingClientRect()};

    center.setAttribute("scroll-x","");
    center.setAttribute("scroll-y","");

    defineStyleVariable(center, "width");
    defineStyleVariable(center, "height");

    const Y = ["top", "bottom"];
    const X = ["left", "right"];

    const {header, sticky} = grid.features;

    viewPortElement.layout = function () {
        for (const y of Y) {
            let h = header[y];
            let s = sticky[y];
            if (h || s) {
                let area = this[y];
                if (!area) {
                    area = this[y] = grid.createArea(y);
                    area.rowCtrl = new RowController(grid);
                    area.columnCtrl = center.columnCtrl;
                    area.setAttribute("scroll-x","");
                    defineStyleVariable(area, "height");
                    linkStyleVariable(area, center, "width");
                }
                area.header = {[y]: h};
            } else if (this[y]) {
                this[y].height = 0;
                this[y] = null;
            }
        }
        for (const x of X) {
            let h = header[x];
            let s = sticky[x];
            if (h || s) {
                let area = this[x];
                if (!area) {
                    area = this[x] = grid.createArea(x);
                    area.rowCtrl = center.rowCtrl;
                    area.columnCtrl = new ColumnController(grid);
                    area.setAttribute("scroll-y","");
                    defineStyleVariable(area, "width");
                    linkStyleVariable(area, center, "height");
                }
                area.header = {[x]: h};
            } else if (this[x]) {
                this[x].width = 0;
                this[x] = null;
            }
        }
        for (const y of Y) {
            for (const x of X) {
                const at = `${y}-${x}`;
                if (this[y] && this[x]) {
                    let area = this[at];
                    if (!area) {
                        area = this[at] = this[y][x] = this[x][y] = grid.createArea(at);
                        area.columnCtrl = this[x].columnCtrl;
                        area.rowCtrl = this[y].rowCtrl;
                        linkStyleVariable(area, this[x], "width");
                        linkStyleVariable(area, this[y], "height");
                    }
                } else {
                    this[at] = null;
                    if (this[y]) this[y][x] = null;
                    if (this[x]) this[x][y] = null;
                }
            }
        }
    };

    viewPortElement.refresh = function (rect) {
        const {top, bottom, left, right, center} = this;
        center.visibleTop = rect.top;
        center.visibleBottom = rect.bottom;
        center.visibleLeft = rect.left + (left?.width);
        center.visibleRight = rect.right - (right?.width);
        if (top) {
            center.visibleTop += top.height;
            top.visibleLeft = center.visibleLeft;
            top.visibleRight = center.visibleRight;
        }
        if (bottom) {
            center.visibleBottom -= bottom.height;
            bottom.visibleLeft = center.visibleLeft;
            bottom.visibleRight = center.visibleRight;
        }
        if (left) {
            left.visibleTop = center.visibleTop;
            left.visibleBottom = center.visibleBottom;
        }
        if (right) {
            right.visibleTop = center.visibleTop;
            right.visibleBottom = center.visibleBottom;
        }
    }
});
