import {ColumnController} from "./column-controller.mjs";
import {RowController} from "./row-controller.mjs";

class Area {
    columnCtrl: ColumnController;
    rowCtrl: RowController;
}

class ViewPort {
    top: Area & HTMLElement
    right: Area & HTMLElement
    bottom: Area & HTMLElement
    left: Area & HTMLElement
    center: Area & HTMLElement
}

class SleekGrid {
    viewPort: ViewPort & HTMLElement;
}
