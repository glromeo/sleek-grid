export const staticStyle = new CSSStyleSheet();
// language=CSS
staticStyle.replaceSync(`
        
    :host {
        display: block;
        overflow: visible;
        height: 100%;
    }
    
    :host(.busy) *,
    :host(.busy) *::after {
        cursor: progress !important;
    }
    
    * {
        box-sizing: border-box;
    }
    
    #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    
    #view-port {
        position: absolute;
        overflow: auto;
        width: 100%;
        height: 100%;
    
        --top-area-height: 0px;
        --right-area-width: 0px;
        --bottom-area-height: 0px;
        --left-area-width: 0px;
        --center-area-width: 100%;
        --center-area-height: 100%;
    }
    
    #sizer {
        position: fixed;
        visibility: hidden;
        width: 100%;
        height: 100%;
        z-index: -1000;
    }
    
    .area {
        visibility: hidden;
        position: absolute;
        overflow: auto;
        width: calc(var(--center-area-width) + var(--right-area-width));
        height: var(--center-area-height);
        contain: layout;
    }
    .area.visible {
        visibility: visible;
    }
    
    .top-area {
        top: 0;
        height: var(--top-area-height);
    }
    
    .right-area {
        left: calc(100% - var(--right-area-width));
        width: var(--right-area-width);
    }
    
    .bottom-area {
        bottom: 0;
        height: var(--bottom-area-height);
        margin-bottom: calc(-1 * var(--bottom-area-height));
    }
    
    .left-area {
        left: 0;
        width: var(--left-area-width);
    }
    
    .top-area, .bottom-area {
        position: sticky;
        overflow-y: hidden;
    }
    
    .left-area, .right-area {
        position: sticky;
        overflow-x: hidden;
    }
    
    #top-left-area {
        z-index: 100;
    }
    
    #top-area {
        z-index: 50;
        margin-top: calc(-1 * var(--top-area-height));
        margin-left: var(--left-area-width);
        min-width: calc(100% - var(--left-area-width));
    }
    
    #top-right-area {
        z-index: 100;
        margin-top: calc(-1 * var(--top-area-height));
    }
    
    #left-area {
        z-index: 50;
    }
    
    #center-area {
        z-index: 0;
        margin-top: var(--top-area-height);
        margin-left: var(--left-area-width);
        min-width: calc(100% - var(--left-area-width));
    }
    
    #right-area {
        z-index: 50;
        margin-top: var(--top-area-height);
    }
    
    #bottom-left-area {
        z-index: 100;
    }
    
    #bottom-area {
        z-index: 50;
        margin-left: var(--left-area-width);
        min-width: calc(100% - var(--left-area-width));
    }
    
    #bottom-right-area {
        z-index: 100;
    }
    
    :host([row-header="left"]) #center-area,
    :host([row-header="left"]) #right-area {
        margin-top: calc(-1 * var(--center-area-height));
    }
    
    /* TODO: What follows has to be tidied up */
    
    .area-shadow {
        display: none;
    }
    
    .area-shadow.top,
    .area-shadow.bottom {
        top: 100%;
        left: 0;
        width: 100%;
        height: 3px;
    }
    
    .area-shadow.left,
    .area-shadow.right {
        top: 0;
        left: 100%;
        width: 3px;
        height: 100%;
    }
    
    .row {
        position: absolute;
        width: 100%;
        white-space: nowrap;
        outline: none;
        contain: strict;
    }
    
    .row.header {
        contain: layout;
    }
    
    .cell {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        -webkit-user-select: none;
        user-select: none;
    }
    
    .handle {
        position: relative;
        z-index: 100;
        float: right;
    }
    
    .handle::after {
        position: absolute;
        z-index: 200;
        content: "";
        background-color: transparent;
    }
    
    .width-handle {
        left: 1px;
        width: 1px;
        height: 100%;
        margin-left: 2px;
    }
    
    .width-handle:hover,
    .width-handle.active {
        left: 2px;
        width: 3px;
        margin-left: 0;
    }
    
    .width-handle::after {
        top: 0;
        bottom: 0;
        width: 9px;
        margin-left: -4px;
        cursor: ew-resize;
    }
    
    .height-handle {
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
    }
    
    .height-handle:hover,
    .height-handle.active {
        top: -1px;
        height: 3px;
    }
    
    .height-handle::after {
        right: 0;
        left: 0;
        height: 9px;
        margin-top: -4px;
        cursor: ns-resize;
    }

`);


