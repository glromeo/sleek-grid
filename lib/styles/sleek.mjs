export const sleekStyle = new CSSStyleSheet();

// language=CSS

sleekStyle.replaceSync(`

    :host {
        --padding: 8px;
        color: var(--text-color);
    }

    @media (prefers-color-scheme: dark) {
        #root {
            --primary-color: "dodgerblue";
            --text-color: "white";
            --background-color: "#444";
            --even-rows-background: "#222";
            --odd-rows-background: "#111";
            --border-color: "#333";
            --shadow-color: "rgba(0, 0, 0, 1)";
            --border-color-active: "white";
        }
    }

    @media (prefers-color-scheme: light) {
        #root {
            --primary-color: "dodgerblue";
            --text-color: "black";
            --background-color: "white";
            --even-rows-background: "white";
            --odd-rows-background: "#eee";
            --border-color: "lightgrey";
            --shadow-color: "rgba(0, 0, 0, 0.25)";
            --border-color-active: "black";
        }
    }

    #view-port {
        background-color: var(--background-color);
    }

    #top-left-area {
        border-bottom: 2px solid var(--border-color);
        border-right: 2px solid var(--border-color);
    }

    #top-area {
        border-bottom: 2px solid var(--border-color);
    }

    #top-right-area {
        border-bottom: 2px solid var(--border-color);
        border-left: 2px solid var(--border-color);
    }

    #left-area {
        border-right: 2px solid var(--border-color);
    }

    #center-area {
    }

    #right-area {
        border-left: 2px solid var(--border-color);
    }

    #bottom-left-area {
        border-top: 2px solid var(--border-color);
        border-right: 2px solid var(--border-color);
    }

    #bottom-area {
        border-top: 2px solid var(--border-color);
    }

    #bottom-right-area {
        border-top: 2px solid var(--border-color);
        border-left: 2px solid var(--border-color);
    }

    .area {
        background-color: var(--background-color);
    }

    .row-shadow {
        pointer-events: none;
        z-index: 1000;
        position: absolute;
        background: transparent;
        left: 50px;
        height: 32px; 
        width: calc(100% - 50px);
        box-shadow: 2px 1px 3px var(--shadow-color);
    }
    .column-shadow {
        pointer-events: none;
        z-index: 1000;
        position: absolute;
        background: transparent;
        top: 32px;
        width: 50px;
        height: calc(100% - 32px);
        box-shadow: 1px 2px 3px var(--shadow-color);
    }

    .header.cell {
        background: var(--background-color);
    }

    .header.cell :hover,
    .header.cell .active {
        color: var(--border-color-active);
    }

    .left.header .cell-text {
        text-align: center;
    }

    .handle {
        background-color: var(--border-color);
    }

    .handle:hover,
    .handle.active {
        background-color: var(--border-color-active);
    }

    .row {
        border-bottom: 1px solid var(--border-color);
    }

    .row.even {
        background-color: var(--even-rows-background);
    }

    .row.odd {
        background-color: var(--odd-rows-background);
    }

    .search-input {
        position: absolute;
        background-color: transparent;
        bottom: 0;
        width: 100%;
        padding: var(--padding);
        border: none;
        outline: none;
        cursor: text;
        transition: padding 300ms ease;
    }

    .search-input:focus,
    .search-input:valid {
        padding-bottom: var(--search-input-padding);
        transition: padding 300ms ease;
    }

    .search-input::-webkit-input-placeholder {
        transition: color 300ms ease;
    }

    .search-input:not(:focus)::-webkit-input-placeholder {
        color: transparent;
    }

    .search-hr {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 1px;
        margin: -2px 0;
        height: 2px;
        border-bottom: 1px var(--primary-color);
        background: var(--primary-color);
        will-change: transform, visibility;
        transition: all 200ms ease-out;
        transform: scaleX(0);
        visibility: hidden;
        z-index: 10;
    }

    .search-input:focus ~ .search-hr {
        transform: scaleX(1);
        visibility: visible;
    }

    .search-label {
        position: absolute;
        bottom: 0;
        transition: bottom 300ms ease;
        padding: var(--padding);
        user-select: text;
    }

    .search-input:focus ~ .search-label,
    .search-input:valid ~ .search-label {
        color: var(--primary-color);
        bottom: calc(var(--search-input-padding) * 2 + .625em);
        transition: bottom 300ms ease;
        font-size: 0.8em;
        user-select: none;
    }

    .cell {
        border-right: 1px solid var(--border-color);
    }

    .cell-text {
        position: relative;
        -webkit-user-select: text;
        user-select: text;
        height: 100%;
        padding: var(--padding);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .cell-content {
        position: relative;
        height: 100%;
    }

    .cell svg {
        height: 1.25em;
    }

    .sort-icon {
        position: absolute;
        margin-left: 3px;
        opacity: 0;
        cursor: pointer;
        z-index: 100;
        user-select: none;
        transition: opacity 0.3s ease-in-out;
    }

    .cell:hover:not([sort]) .sort-icon {
        opacity: .25;
    }

    .cell[sort=desc] .sort-icon {
        transform: scaleY(-1);
    }

    .cell[sort] .sort-icon {
        opacity: 1;
    }

    .menu-icon {
        position: absolute;
        bottom: 7px;
        right: -7px;
        opacity: 0;
        cursor: pointer;
        transition: opacity 0.3s ease-in-out;
    }

    .cell:hover .menu-icon {
        opacity: .25;
    }

    .cell[search] .menu-icon {
        opacity: 1;
    }

    .search-input:focus ~ .menu-icon,
    .search-input:valid ~ .menu-icon {
        opacity: 1;
    }

    .menu {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 0;
        z-index: 100;
        border: 1px solid var(--border-color);
        background: var(--background-color);
        box-shadow: 3px 6px 12px rgba(0, 0, 0, .5), -3px 6px 12px rgba(0, 0, 0, .25);
        min-width: 32px;
        width: fit-content;
        min-height: 64px;
        height: fit-content;
    }

    .menu > .item {
        padding: var(--padding);
        border: 2px solid transparent;
        margin: -2px;
    }

    .menu > .separator {
        padding-top: var(--padding);
        padding-bottom: var(--padding);
    }

    .menu > .separator > .line {
        border-top: 1px solid var(--border-color);
    }

    .menu > .item:hover {
        background-color: rgb(100, 149, 237, 0.33);
        border: 2px solid cornflowerblue;
    }

    #highlight {
        position: absolute;
        opacity: .66;
        left: 0;
        top: 0;
        border: 2px solid gold;
        z-index: 10 !important;
        pointer-events: none;
        transition: opacity 160ms ease-in-out, transform 160ms ease-out, width 160ms ease-out, height 160ms ease-out;
        background-color: rgba(255, 215, 0, 0.33);
    }

    .cell.detached {
        opacity: 0.333;
        z-index: 100 !important;
        transition: left 160ms ease-in-out, opacity 160ms ease-in-out;
    }

    .drag-n-drop.drag-column .header .cell {
        cursor: grab;
    }

    .drag-n-drop.drag-column .header .cell * {
        pointer-events: none !important;
    }

    .drag-n-drop.drag-column .row > * {
        cursor: no-drop;
    }

    .drag-n-drop.drag-column .cell {
        border-left: 1px solid var(--border-color);
        margin-left: -1px;
        transition: left 300ms ease-in-out, width 300ms ease-in-out;
    }

    .drag-n-drop.drag-row .row,
    .drag-n-drop.drag-row .header .cell {
        border-top: 1px solid var(--border-color);
        margin-top: -1px;
        transition: transform 300ms ease-in-out;
    }

    .drag-n-drop.drag-row .ghost.row {
        border-top: none;
        margin-top: 0;
        transition: transform 0s;
    }

    .drag-n-drop .row.even .cell {
        background-color: var(--even-rows-background);
    }

    .drag-n-drop .row.odd .cell {
        background-color: var(--odd-rows-background);
    }

    .ghost {
        cursor: grab;
        position: fixed;
        z-index: 10000;
        box-shadow: 3px 6px 12px rgba(0, 0, 0, .1), -3px 6px 12px rgba(0, 0, 0, .5);
        background: var(--background-color);
        opacity: 0;
        transition: opacity 0.25s ease-in-out;
        pointer-events: none;
        overflow: hidden;
    }

    .ghost.cancel {
        opacity: 0.33;
        box-shadow: 0px 0px 0px 2px crimson, 3px 6px 12px rgba(0, 0, 0, .5), -3px 6px 12px rgba(0, 0, 0, .25);
    }

    .ghost.column {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    
    .ghost.column > * {
        position: relative;
    }

    #drop-highlight {
        pointer-events: none;
        position: fixed;
        box-shadow: 0px 0px 0px 2px cornflowerblue;
        background-color: rgba(100, 149, 237, 0.25);
        transition: transform 0.125s ease-in-out;
        z-index: 1000;
    }
`);
