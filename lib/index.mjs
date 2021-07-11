import "./components/grid-area.mjs";
import "./components/grid-row.mjs";
import "./components/header-row.mjs";
import "./components/root.mjs";

import "./utils/grid-api.mjs";

import "./features/highlight.mjs";
import {SleekGrid} from "./sleek-grid.mjs";

customElements.define("sleek-grid", SleekGrid);
export {useTemplate} from "./utils/index.mjs";
