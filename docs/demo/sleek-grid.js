(()=>{var G=0,R=class{constructor(t){this.grid=t,this.columns=[],this.column=null,this.columnIndex=0,this.leftIndex=0,this.rightIndex=0,this.indices=[],this.refresh=null,this.createCell=(e,o)=>{if(this.column=this.columns[this.columnIndex=o],e.row.id==="header")if(this.column.id==="header"){let i=t.createStub();return t.updateStub(i,this),i}else{let i=t.createColumnHeader();return t.updateColumnHeader(i,this),i}else if(this.column.id==="header"){let i=t.createRowHeader();return t.updateRowHeader(i,this,e),i}else{let i=t.createGridCell();return t.updateGridCell(i,this,e),i}},this.updateCell=(e,o,i)=>(this.column=this.columns[this.columnIndex=i],e.row.id==="header"?this.column.id==="header"?(t.updateStub(o,this),o):(t.updateColumnHeader(o,this),o):this.column.id==="header"?(t.updateRowHeader(o,this,e),o):(t.updateGridCell(o,this,e),o))}render(t,e){let{indices:o}=this,i=t.firstChild,r=0;for(;i&&r<o.length;)this.updateCell(e,i,o[r++]),i=i.nextSibling;for(;i;){let l=i;i=i.nextSibling,t.removeChild(l)}for(;r<o.length;)t.append(this.createCell(e,o[r++]))}layout(t,e,o){let{leftIndex:i,rightIndex:r}=this.range(t,e,o),l=this.indices,d=[],c=[],s=[],h=new Map;for(let p=0;p<l.length;p++)h.set(this.columns[l[p]].id,p);for(let p=i;p<r;++p)h.delete(t[p].id)?c.push(p):d.push(p);for(let p of h.values())d.length>0?c.push(d.pop()):s.push(p);this.columns=t,this.leftIndex=i,this.rightIndex=r,this.indices=[...c,...d],c.length||d.length?this.update=(p,f)=>{let{childNodes:x}=p,a=s.length;for(;a>0;)x[s[--a]].remove();for(a=0;a<c.length;a++)this.updateCell(f,x[a],c[a]);for(a=0;a<d.length;a++)p.append(this.createCell(f,d[a]))}:this.update=R.prototype.update}update(t,e){for(let o of t.childNodes)this.updateCell(e,o,o.columnIndex)}sync(t,e){let{leftIndex:o,rightIndex:i}=this.range(this.columns,t,e),r,l,d,c;if((o<this.leftIndex||i<this.rightIndex)&&(r=o,l=Math.min(this.leftIndex,i),d=Math.max(this.leftIndex,i),c=this.rightIndex),(i>this.rightIndex||o>this.leftIndex)&&(r=Math.max(this.rightIndex,o),l=i,d=this.leftIndex,c=Math.min(this.rightIndex,o)),this.leftIndex=o,this.rightIndex=i,r!==void 0){let s=this.indices,h=[],p=[],f=[],x=0,a=r;for(let u=0;u<s.length;u++){let w=s[u];w<c&&w>=d?a<l?(p.push(x),s[x++]=a++):h.push(u):s[x++]=w}for(;a<l;)f.push(a),s[x++]=a++;s.length=x,this.refresh=(u,w)=>{let m=u.childNodes,g=h.length;for(;g>0;)u.removeChild(m[h[--g]]);for(g=0;g<p.length;g++){let b=p[g];this.updateCell(w,m[b],s[b])}for(g=0;g<f.length;g++)u.append(this.createCell(w,f[g]))}}else this.refresh=null}range(t,e,o){let i=0,r=t.length;return r&&o>0&&(i=Math.max(i,Y(t,e)-G),r=Math.min(r,1+Y(t,e+o)+G)),{leftIndex:i,rightIndex:r}}};function Y(n,t){let e,o,i=0,r=n.length-1;for(;i<r;){e=i+r>>1;let{left:l,width:d}=n[e];if(o=t-l,o>=d)i=e+1;else if(o<0)r=e-1;else return e}return i}function M(n=[]){let t=0;for(let e,o=0;o<n.length;o++)e=n[o],t=(e.left=t)+e.width;return t}var V=0,L=class{constructor(t){this.grid=t,this.rows=[],this.row=null,this.rowIndex=0,this.topIndex=0,this.bottomIndex=0,this.indices=[],this.update=this.render,this.createRow=(e,o)=>{if(this.row=this.rows[this.rowIndex=o],this.row.id==="header"){let i=t.createHeaderRow(this);return t.updateHeaderRow(i,this),e.render(i,this),i}else{let i=t.createGridRow(this);return t.updateGridRow(i,this),e.render(i,this),i}},this.updateRow=(e,o,i)=>(this.row=this.rows[this.rowIndex=i],this.row.id==="header"?(t.updateHeaderRow(o,this),e.render(o,this),o):(t.updateGridRow(o,this),e.render(o,this),o))}render(t,e){let{indices:o}=this,i=t.firstChild.nextSibling,r=0;for(;i&&r<o.length;)this.updateRow(e,i,o[r++]),i=i.nextSibling;for(;i;){let l=i;i=i.nextSibling,t.removeChild(l)}for(;r<o.length;)t.appendChild(this.createRow(e,o[r++]));t.classList.toggle("visible",t.childElementCount)}layout(t,e,o){let{topIndex:i,bottomIndex:r}=this.range(t,e,o),l=this.indices,d=[],c=[],s=[],h=new Map;for(let p=0;p<l.length;p++)h.set(this.rows[l[p]].id,p);for(let p=i;p<r;++p)h.delete(t[p].id)?c.push(p):d.push(p);for(let p of h.values())d.length>0?c.push(d.pop()):s.push(p);this.rows=t,this.topIndex=i,this.bottomIndex=r,this.indices=[...c,...d],this.update=(p,f)=>{let{childNodes:x}=p,a=s.length;for(;a>0;)x[1+s[--a]].remove();for(a=0;a<c.length;a++)this.updateRow(f,x[1+a],c[a]);for(a=0;a<d.length;a++)p.append(this.createRow(f,d[a]));p.classList.toggle("visible",p.childElementCount)}}sync(t,e){let{topIndex:o,bottomIndex:i}=this.range(this.rows,t,e),r,l,d,c;if((o<this.topIndex||i<this.bottomIndex)&&(r=o,l=Math.min(i,this.topIndex),d=Math.max(i,this.topIndex),c=this.bottomIndex),(i>this.bottomIndex||o>this.topIndex)&&(r=Math.max(o,this.bottomIndex),l=i,d=this.topIndex,c=Math.min(o,this.bottomIndex)),this.topIndex=o,this.bottomIndex=i,r!==void 0){let s=this.indices,h=[],p=[],f=[],x=[],a=0,u=r;for(let w=0;w<s.length;w++){let m=s[w];m<c&&m>=d?u<l?(p.push(a),s[a++]=u++):h.push(w):(x.push(a),s[a++]=m)}for(;u<l;)f.push(u),s[a++]=u++;s.length=a,this.refresh=(w,m)=>{let{childNodes:g}=w,b=h.length;for(;b>0;)g[1+h[--b]].remove();for(b=0;b<p.length;b++){let y=p[b];this.updateRow(m,g[1+y],s[y])}for(b=0;b<f.length;b++)w.append(this.createRow(m,f[b]));if(m.refresh)for(b=0;b<x.length;b++)m.refresh(g[1+x[b]],this)}}else this.refresh=L.prototype.refresh}range(t,e,o){let i=0,r=t.length;return r&&o>0&&(i=Math.max(i,X(t,e)-V),r=Math.min(r,1+X(t,e+o)+V)),{topIndex:i,bottomIndex:r}}refresh(t,e){if(e.refresh){let{childNodes:o}=t;for(let i=0;i<this.indices.length;i++)this.row=this.rows[this.rowIndex=this.indices[i]],e.refresh(o[1+i],this)}}};function X(n,t){let e,o,i=0,r=n.length-1;for(;i<r;){e=i+r>>1;let{top:l,height:d}=n[e];if(o=t-l,o>=d)i=e+1;else if(o<0)r=e-1;else return e}return i}function E(n=[]){let t=0;for(let e,o=0;o<n.length;o++)e=n[o],t=(e.top=t)+e.height;return t}var q=new CSSStyleSheet;q.replaceSync(`

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

    /* ============================================================================================================== */
    /* Drag 'n Drop                                                                                                   */
    /* ============================================================================================================== */

    .header.cell * {
        user-select: none;
    }

    .cell.detached {
        opacity: 0.333;
        z-index: 100 !important;
        transition: left 160ms ease-in-out, opacity 160ms ease-in-out;
    }

    .row.detached {
        opacity: 0.333;
        z-index: 100 !important;
        transition: transform 160ms ease-in-out, opacity 160ms ease-in-out;
    }

    .drag-n-drop .header.cell {
        cursor: grab;
    }

    .drag-n-drop .header.cell * {
        pointer-events: none !important;
    }

    .drag-n-drop .row > * {
        cursor: no-drop;
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

    .ghost.column > :first-child {
        box-shadow: 1px 2px 3px var(--shadow-color);
        z-index: 10;
    }

    .ghost.row {
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }

    .ghost.row > :first-child {
        box-shadow: 2px 1px 3px var(--shadow-color);
        z-index: 10;
    }
    
    .ghost > * {
        position: relative;
    }

    .ghost .cell.even {
        background-color: var(--even-rows-background);
    }

    .ghost .cell.odd {
        background-color: var(--odd-rows-background);
    }

    #drop-highlight {
        pointer-events: none;
        position: fixed;
        box-shadow: 0px 0px 0px 2px cornflowerblue;
        background-color: rgba(100, 149, 237, 0.25);
        transition: transform 0.125s ease-in-out;
        z-index: 1000;
    }

    ${/Windows/.test(navigator.userAgent)&&/Chrome/.test(navigator.userAgent)?`
        /* Let's get this party started */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        /* Track */
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.25);
            margin-top: 32px;
            margin-left: 50px;
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: cornflowerblue;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.25);
        }
        
        ::-webkit-scrollbar-thumb:window-inactive {
            background: rgba(100, 149, 237, 0.25);
        }
    `:""}
`);var O=new CSSStyleSheet;O.replaceSync(`
        
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

`);"use strict";var U=Object.assign;typeof U!="function"&&(U=function(){var n=arguments,t=arguments[0];if(t==null)throw new TypeError("Cannot convert undefined or null to object");t=Object(t);for(var e=1;e<n.length;e++)if(n[e]&&typeof n[e]=="object")for(var o in n[e])t[o]=n[e][o];return t});function ct(n){var t=n+"",e=t.indexOf("...");return e>=0&&(e<t.indexOf(")")||t.indexOf("arguments")>=0)}function dt(n,t){t||(t={});var e=t.vargs||ct(n),o=Object.create(null),i=[],r=[],l=new WeakMap,d=function(a,u,w){return setTimeout(function(){if(w){u.splice(a,1),w.splice(a,1);return}u instanceof WeakMap?u.delete(a):delete u[a]},t.maxAge)},c=t.maxAge>0&&t.maxAge<Infinity?d:0,s=t.equals?t.equals:function(a,u){return a===u},h=t.maxArgs,p=t.serializer,f,x;return n.length===1&&!t.equals&&!e?(f=function(a){var u=typeof a;if(!p&&(u==="object"&&a||u==="function")){var w;return l.get(a)||(!c||c(a,l),l.set(a,w=n.call(this,a)),w)}var m=u==="number"||u==="boolean"||a==null?a:u==="string"?JSON.stringify(a):p(a);return o[m]||(!c||c(m,o),o[m]=n.call(this,a))}.bind(this),x=1):f=function(){var a=h||arguments.length,u;for(u=i.length-1;u>=0;u--)if(!(!h&&i[u].length!==a)){for(var w=a-1;w>=0&&s(i[u][w],arguments[w]);w--)if(w===0)return r[u]}return u=i.length-(u+1),!c||c(u,r,i),r[u]=n.apply(this,i[u]=arguments)}.bind(this),f.clear=function(){l=new WeakMap,o=Object.create(null),i=[],r=[]},f.keys=function(){return x?null:i.slice()},f.values=function(){return x?null:r.slice()},f.keyValues=function(){return x?{primitives:U({},o),objects:l}:null},f}var A=dt;function C(n,t){let e=document.createElement("template");e.innerHTML=n.replace(/\s+</g,"<");function o(){let i=e.content.cloneNode(!0).firstChild;return t?.call(this,i,...arguments),i}return o.template=e,o}var K=A((n,t)=>{let e=[],o=t.reduce((i,{field:r,search:l},d)=>{if(l){let c=new RegExp("^"+ut(l).replace(/\\\*/g,".*"),"i");e.push(c);let s=JSON.stringify(r);return i+`
&& this[${e.length-1}].test(row[${s}]) // [${d}] ${s} ${c}`}else return i},`row.id = id;
return true`)+`
`+n.sourceURL("filter");if(e.length>0)return new Function("row","id",o).bind(e)}),_=A((n,t)=>t.filter(n)),J=A((n,t)=>{let e=n.find(o=>o.sort);if(e){let o=e.sort==="asc"?1:-1,i=e.field;return[...t].sort(function(r,l){let d=r[i],c=l[i];return d===c?0:d<c?-o:o})}return t}),ht=document.createElement("canvas"),Q=ht.getContext("2d");document.fonts.ready.then(function(){console.log("fonts ready"),Q.font=window.getComputedStyle(document.body).font});function P(n){return Q.measureText(n).width*1.1}var pt=/([-*+?.^${}(|)[\]])/g;function ut(n){return n.replace(pt,"\\$1")}function T(n){return function(e){e.preventDefault(),e.stopPropagation();let o=this.getRootNode().host;o.classList.contains("busy")||(this.classList.add("active"),o.classList.add("busy"),requestAnimationFrame(()=>{n(this.parentElement,o),o.classList.remove("busy"),this.classList.remove("active")}))}}function k(n){return function(e){e.preventDefault(),e.stopPropagation();let o=this.getRootNode().host;this.classList.add("active");let i=n.call(this,e,this.closest(".cell"),o);i.pending=0,document.body.addEventListener("pointermove",l),document.body.addEventListener("pointerup",l);let r=()=>{this.classList.contains("active")&&(this.classList.remove("active"),document.body.removeEventListener("pointermove",l),document.body.removeEventListener("pointerup",l),i.onEnd())};function l(d){d.preventDefault(),d.stopPropagation(),d.buttons!==1&&(requestAnimationFrame(function(){i.onEnd(d),r()}),i.pending++),i.pending===0&&(requestAnimationFrame(function(){i.onMove(d,r),i.pending--}),i.pending++)}}}function Z(n,t){let e=t.appendChild(n.createGridCell({column:{},columnIndex:0},{row:{},rowIndex:0}));e.style.cssText="width:auto;height:auto;";let o=e.querySelector(".cell-text");return o.innerHTML="",function(i,r){return n.renderCell(o,i,r),e}}function tt(n){return`//# sourceURL=moderno://sleekgrid/${this}/${n}`}function $(n){let t=n.closest(".area"),{columns:e,leftIndex:o,rightIndex:i}=t.columnCtrl,{columnIndex:r}=n,l=e[r];return{area:t,columns:e,leftIndex:o,rightIndex:i,column:l,columnIndex:r}}function I(n){let t=n.closest(".area"),{rows:e,topIndex:o,bottomIndex:i}=t.rowCtrl,{rowIndex:r}=n.parentElement,l=e[r];return{area:t,rows:e,topIndex:o,bottomIndex:i,row:l,rowIndex:r}}function z(n){let t=n.closest(".area"),e=t.getBoundingClientRect(),{top:o,bottom:i,left:r,right:l}=n.getBoundingClientRect();return t.visibleTop!==void 0?(o=Math.max(o,t.visibleTop),i=Math.min(i,t.visibleBottom)):(o=Math.max(o,e.top),i=Math.min(i,e.bottom)),t.visibleLeft!==void 0?(r=Math.max(r,t.visibleLeft),l=Math.min(l,t.visibleRight)):(r=Math.max(r,e.left),l=Math.min(l,e.right)),{top:o,bottom:i,left:r,right:l,height:i-o,width:l-r}}function N(n){n[0].id===void 0&&n.forEach((t,e)=>t.id=String(e)),typeof n[0].id!="string"&&n.forEach(t=>t.id=String(t.id))}var ft=0,v=class extends HTMLElement{#e;#t;constructor(){super();this.features={header:{width:0,height:0,top:!1,right:!1,bottom:!1,left:!1},sticky:{top:null,right:null,bottom:null,left:null},resize:{columns:!1,rows:!1},dnd:{columns:!1,rows:!1},autosize:"quick"},this.pendingUpdate={},this.properties={rows:[],columns:[]},this.#t=this.properties.rows,this.#e=this.properties.columns;let t=this.attachShadow({mode:"open"});t.adoptedStyleSheets=[O,q,new CSSStyleSheet],t.appendChild(this.createRoot()),this.root=t.getElementById("root"),this.viewPort=t.getElementById("view-port"),this.theme="light",this.cellSize=Z(this,t.getElementById("sizer"));let e,o=i=>{cancelAnimationFrame(e),e=requestAnimationFrame(()=>{Array.isArray(i)&&this.viewPort.refresh(this.getBoundingClientRect()),this.refresh()})};new ResizeObserver(o).observe(this.viewPort),this.viewPort.addEventListener("scroll",o,{capture:!0,passive:!0}),this.window={left:0,top:0,width:0,height:0},this.sourceURL=tt.bind(`grid-${ft++}`)}static get observedAttributes(){return["theme","column-header","column-resize","column-dnd","row-header","row-resize","row-dnd","sticky-top","sticky-right","sticky-bottom","sticky-left","autosize"]}set theme(t){let{style:e}=this.shadowRoot.getElementById("root");t==="dark"?(e.setProperty("--primary-color","dodgerblue"),e.setProperty("--text-color","white"),e.setProperty("--background-color","#444"),e.setProperty("--even-rows-background","#222"),e.setProperty("--odd-rows-background","#111"),e.setProperty("--border-color","#333"),e.setProperty("--shadow-color","rgba(0, 0, 0, 1)"),e.setProperty("--border-color-active","white")):(e.setProperty("--primary-color","dodgerblue"),e.setProperty("--text-color","black"),e.setProperty("--background-color","white"),e.setProperty("--even-rows-background","white"),e.setProperty("--odd-rows-background","#eee"),e.setProperty("--border-color","lightgrey"),e.setProperty("--shadow-color","rgba(0, 0, 0, 0.25)"),e.setProperty("--border-color-active","black"))}get columns(){return this.#e}set columns(t){Array.isArray(t)&&t.length&&(typeof t[0]=="string"&&(t=t.map((e,o)=>({id:String(o),label:e,field:o}))),N(t)),this.requestUpdate({columns:t??[]})}get rows(){return this.#t}set rows(t){Array.isArray(t)&&t.length&&N(t),this.requestUpdate({rows:t??[]})}connectedCallback(){this.setAttribute("grid-id",this.gridId),this.useHighlight(),this.update(this.pendingUpdate),this.pendingUpdate=null;let{width:t,height:e}=this.viewPort.getBoundingClientRect();this.window.left=this.viewPort.scrollLeft,this.window.top=this.viewPort.scrollTop,this.window.width=t,this.window.height=e}disconnectedCallback(){}attributeChangedCallback(t,e,o){switch(t){case"theme":return this.theme=o;case"column-header":{let{header:i}=this.features;if(i.top=i.bottom=!1,o){let r=/bottom/i.test(o)?"bottom":"top";i[r]=!0}this.requestUpdate({features:{...this.features,header:i}});return}case"row-header":{let{header:i}=this.features;if(i.left=i.right=!1,o){let r=/right/i.test(o)?"right":"left";i[r]=!0}this.requestUpdate({features:{...this.features,header:i}});return}case"sticky-top":case"sticky-right":case"sticky-bottom":case"sticky-left":{let{sticky:i}=this.features,r=t.split("-")[1];if(o){let l=i[r]={};for(let d of o.split(","))l[d]=!0}else i[r]=null;this.requestUpdate({features:{...this.features,sticky:i}});return}case"column-resize":{let{resize:i}=this.features;i.columns=!(o===null||o==="false"),this.requestUpdate({features:{...this.features,resize:i}});return}case"row-resize":{let{resize:i}=this.features;i.rows=!(o===null||o==="false"),this.requestUpdate({features:{...this.features,resize:i}});return}case"column-dnd":{let{dnd:i}=this.features;i.columns=!(o===null||o==="false"),this.requestUpdate({features:{...this.features,dnd:i}});return}case"row-dnd":{let{dnd:i}=this.features;i.rows=!(o===null||o==="false"),this.requestUpdate({features:{...this.features,dnd:i}});return}case"autosize":{let i=!(o===null||o==="false");this.requestUpdate({features:{...this.features,autosize:i}});return}}}requestUpdate(t=this.properties){this.pendingUpdate||(this.pendingUpdate=Object.create(null),this.shadowRoot&&setTimeout(()=>{this.update(this.pendingUpdate),this.pendingUpdate=null},0)),Object.assign(this.pendingUpdate,t)}update(t=this.properties){Object.assign(this.properties,t);let e=Object.assign(Object.create(this.properties),t);this.filter(e),this.sort(e),this.layout(e),this.render(e)}filter(t){let{columns:e,rows:o}=t;if(e||o){e=e??this.#e,o=o??this.#t;let i=K(this,e);i&&(o=_(i,o),o!==this.#t&&(i&&o.length===0&&(o=[e.reduce(function(r,l){return l.search&&(r[l.field]="NO MATCH"),r.id="",r},{})]),t.rows=o))}}sort(t){let{columns:e,rows:o}=t;(e||o)&&(o=J(e??this.#e,o??this.#t),o!==this.#t&&(t.rows=o))}layout(t){let{action:e,columns:o,rows:i,features:r}=t,l=this.viewPort.getBoundingClientRect();r&&((r.sticky||r.header)&&(o=o??this.#e,i=i??this.#t,this.viewPort.layout()),this.features=r);let{top:d,right:c,bottom:s,left:h,center:p,scrollTop:f,clientHeight:x,scrollLeft:a,clientWidth:u}=this.viewPort;if(o){e||this.autosizeColumns(o,i??this.#t,u);let w=this.sliceColumns(o);if(h){let g=w.left;h.width=M(g),h.columnCtrl.layout(g),h.columns=g,d&&(d.left.columns=g),s&&(s.left.columns=g),u-=h.width}if(c){let g=w.right;c.width=M(g),c.columnCtrl.layout(g),c.columns=g,d&&(d.right.columns=g),s&&(s.right.columns=g),u-=c.width}let m=w.center;p.width=Math.max(M(m),u-((h?.width??8)+(c?.width??8))),p.columnCtrl.layout(m,a,u),p.columns=m,d&&(d.columns=m),s&&(s.columns=m),this.#e=o,this.window.width=u}if(i){e||this.autosizeRows(i,x);let w=this.sliceRows(i);if(d){let g=w.top;d.height=E(g),d.rowCtrl.layout(g),d.rows=g,h&&(d.left.rows=g),c&&(d.right.rows=g),x-=d.height}if(s){let g=w.bottom;s.height=E(g),s.rowCtrl.layout(g),s.rows=g,h&&(s.left.rows=g),c&&(s.right.rows=g),x-=s.height}let m=w.center;p.height=Math.max(E(m),x-((d?.height??8)+(s?.height??8))),p.rowCtrl.layout(m,f,x),p.rows=m,h&&(h.rows=m),c&&(c.rows=m),this.#t=i,this.window.height=x}this.window.left=a,this.window.top=f,this.viewPort.refresh(l)}render({columns:t,rows:e}){let{top:o,right:i,bottom:r,left:l,center:d}=this.viewPort,{rowCtrl:c,columnCtrl:s}=d;c.update(d,s),o&&o.rowCtrl.update(o,s),r&&r.rowCtrl.update(r,s),l&&(c.update(l,l.columnCtrl),o&&o.rowCtrl.update(o.left,l.columnCtrl),r&&r.rowCtrl.update(r.left,l.columnCtrl)),i&&(c.update(i,i.columnCtrl),o&&o.rowCtrl.update(o.right,i.columnCtrl),r&&r.rowCtrl.update(r.right,i.columnCtrl))}scrollTo(t,e){this.viewPort.scrollTo(t,e)}refresh(){let{top:t,right:e,bottom:o,left:i,center:r,scrollTop:l,scrollLeft:d,clientHeight:c,clientWidth:s}=this.viewPort;this.window.left=d,this.window.top=l,t&&(c-=t.height),e&&(s-=e.width),o&&(c-=o.height),i&&(s-=i.width),this.window.width=s,this.window.height=c;let{rowCtrl:h,columnCtrl:p}=r;p.sync(d,s),h.sync(l,c),p.refresh&&(t&&t.rowCtrl.refresh(t,p),o&&o.rowCtrl.refresh(o,p)),i&&h.refresh(i,i.columnCtrl),h.refresh(r,p),e&&h.refresh(e,e.columnCtrl),this.pending=null}autosizeColumns(t,e=this.#t,o){let i=this.features.autosize;if(i==="quick")for(let r=0;r<t.length;r++){let{field:l,label:d}=t[r],c=P(d);for(let s=0;s<e.length;s++)c=Math.max(c,P(e[s][l]));t[r].width=this.limit("column-width",c+18)}else if(i!==!0)for(let r=0;r<t.length;r++)t[r].width=this.limit("column-width",P(t[r].label)+18)}autoColumnWidth(t,e=this.#t){let o=P(t.label);for(let i of e)o=Math.max(o,this.cellSize(t,i).clientWidth);return this.limit("column-width",o+18)}autosizeRows(t,e){let o=this.features.autosize;for(let i,r=0;r<t.length;r++)i=t[r],i.height=this.limit("row-height",32)}autoRowHeight(t,e=this.#e){let o=0;for(let i of e)o=Math.max(o,this.cellSize(i,t).clientHeight);return o}limit(t,e){let o=this.getAttribute(`min-${t}`);o!==null&&(e=Math.max(e,parseInt(o)));let i=this.getAttribute(`max-${t}`);return i!==null&&(e=Math.min(e,parseInt(i))),e}renderCell(t,e,o){t.innerText=o[e.field]??""}setHeaderWidth(t){this.features.header.width=t,this.style.setProperty("--header-width",`${t}px`)}setHeaderHeight(t){this.features.header.height=t,this.style.setProperty("--header-height",`${t}px`);let e=Math.min(8,Math.max(2,2+(t-32)*6/10));this.style.setProperty("--search-input-padding",`${e}px`)}sliceColumns(t){let{header:e,sticky:o}=this.features,i=o?.left??{},r=o?.right??{},l=[],d=e?.left?[{id:"header",field:"id",width:50,position:"left"}]:[],c=[];for(let s,h=0;h<t.length;h++){if(s={...t[h]},i[s.id]){d.push(s);continue}if(r[s.id]){c.push(s);continue}l.push(s)}return e.right&&c.push({id:"header",field:"label",width:50,position:"right"}),{center:l,left:d,right:c}}sliceRows(t){let{header:e,sticky:o}=this.features,i=o?.top??{},r=o?.bottom??{},l=[],d=e.top?[{id:"header",field:"label",height:32,position:"top"}]:[],c=[];for(let s,h=0;h<t.length;h++){if(s={...t[h]},i[s.id]){d.push(s);continue}if(r[s.id]){c.push(s);continue}l.push(s)}return e.bottom&&c.push({id:"header",field:"id",height:32,position:"bottom"}),{center:l,top:d,bottom:c}}};var mt=C(`
    <div class="area">
        <!--highlight-->
    </div>
`);v.prototype.createArea=function(t){let e=mt();e.id=`${t}-area`,e.setAttribute("tabindex",String(gt(t)));let[o,i]=t.split("-");return o&&e.classList.add(`${o}-area`),i&&e.classList.add(`${i}-area`),e.addEventListener("keydown",function(r){let l=e.querySelector("#highlight");if(l)switch(r.code){case"KeyS":case"ArrowDown":return j(r,l,0,1);case"KeyW":case"ArrowUp":return j(r,l,0,-1);case"KeyA":case"ArrowLeft":return j(r,l,-1,0);case"KeyD":case"ArrowRight":return j(r,l,1,0)}}),e};function j(n,t,e,o){n.preventDefault(),n.stopPropagation(),t.move(e,o)}function gt(n){switch(n){case"top-left":return 1;case"top":return 2;case"top-right":return 3;case"left":return 4;case"center":return 5;case"right":return 6;case"bottom-left":return 7;case"bottom":return 8;case"bottom-right":return 9}}function H(n,t){let{style:e}=n.closest("#view-port"),o;Object.defineProperty(n,t,{get:()=>o,set:i=>e.setProperty(`--${n.id}-${t}`,`${o=i}px`)})}function S(n,t,e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}function et(n,t,e){let{rows:o}=n.properties;o[o.findIndex(i=>i.id===t)].height=e}var ot=T((n,t)=>{let{area:e,rows:o,rowIndex:i,row:r}=I(n),l=Math.round(t.autoRowHeight(r)-r.height);if(l){r.height+=l,e.height+=l,t.resizeRowParts(r.id,r.height);for(let d,c=i+1;c<o.length;c++)d=o[c],t.positionRowParts(d.id,d.top+=l);et(t,r.id,r.height)}}),it=k(function({pageY:n},t,e){let{area:o,rows:i,rowIndex:r,row:l}=I(t),d=0;return{onMove({pageY:c},s){let h=l.height+c-n;if(l.maxHeight!==void 0&&(h=Math.min(h,l.maxHeight)),l.minHeight!==void 0?h=Math.max(h,l.minHeight):h=Math.max(h,32),d=Math.round(h-l.height),d){e.resizeRowParts(l.id,l.height+=d),o.height+=d;for(let p,f=r+1;f<i.length;f++)p=i[f],e.positionRowParts(p.id,p.top+=d)}n=c,e.refresh()},onEnd(){et(e,l.id,l.height)}}});function wt(n,{row:t,rowIndex:e},{top:o,left:i,height:r}){let{clientWidth:l}=n.viewPort,d=n.root.appendChild(document.createElement("div"));d.className=`ghost row ${e%2?"odd":"even"}`,d.style.cssText=`
        left:${i+4}px;
        top:${o+2}px;
        height:${r-4}px;
        width:${l-8}px;
    `;for(let c of n.queryRowCells(t.id)){let s=c.cloneNode(!0);s.style.left=null,d.appendChild(s)}return requestAnimationFrame(function(){d.style.opacity="1"}),{move(c,s){d.style.transform=`translate(${c}px, ${s}px)`},dispose(){d.style.opacity=null,setTimeout(function(){d.remove()},300)}}}function xt(n,{rows:t,rowIndex:e},o,i){function r(a,u){let w=t[a],m,g=w.top;for(let b=a;b<u;b++){m=t[b]=t[b+1];for(let y of n.positionRowParts(m.id,m.top=g))y.rowIndex=b;g+=m.height}m=t[u]=w;for(let b of n.positionRowParts(m.id,m.top=g))b.rowIndex=u}function l(a,u){let w=t[u],m,g=t[a].top;for(let b=a;b<u;b++){m=w,w=t[b],t[b]=m;for(let y of n.positionRowParts(m.id,m.top=g))y.rowIndex=b;g+=m.height}m=t[u]=w;for(let b of n.positionRowParts(m.id,m.top=g))b.rowIndex=a}let d=W(o)-i,c,s=e,h=i,p=a=>{let u=a-h;return h=a,u},f=!1,x=()=>{f=!1};return{set done(a){x=()=>{a(),f=!1}},on(a,u){let w=p(a),m=a+d;if(!f){if(c=u.parentElement.rowIndex,w>0&&c>s){let g=W(u);m>g-8&&(r(s,c),s=c,o.parentElement.addEventListener("transitionend",x),f=!0)}w<0&&c<s&&W(u)<m+8&&(l(c,s),s=c,o.parentElement.addEventListener("transitionend",x),f=!0)}},dispose(){if(c){let a=[...n.properties.rows],u=t[s].id,w=t[s+1].id,m=a.findIndex(({id:y})=>y===u),[g]=a.splice(m,1),b=a.findIndex(({id:y})=>y===w);a.splice(b,0,g),n.requestUpdate({rows:a})}}}}function W(n){let{top:t,bottom:e}=n.getBoundingClientRect();return(t+e)/2}function bt(n,{rows:t},{top:e,bottom:o}){let i=n.shadowRoot.appendChild(document.createElement("div"));i.id="drop-highlight";let{left:r,right:l,bottom:d}=n.viewPort.getBoundingClientRect();i.style.cssText=`
        left:${r}px;
        top:${e}px;
        width:${l-r}px;
        height:${Math.min(o,d)-e-2}px;
        transform: translateY(0);
    `;let c;return{at(s,h){if(h||s!==c){let{top:p,bottom:f}=z(s);i.style.transform=`translateY(${p-e+1}px)`,i.style.height=`${f-p-2}px`,c=s}},dispose(){i.remove()}}}var rt=k(function({pageX:n,pageY:t},e,o){let i=I(e),{row:r}=i,l=z(e),d=wt(o,i,l),c=xt(o,i,e,n),s=bt(o,i,l);c.done=()=>{s.at(e,!0)},o.viewPort.classList.add("drag-n-drop","drag-row"),o.queryRowParts(r.id).forEach(a=>a.classList.add("detached"));let{left:h,right:p}=o.viewPort.getBoundingClientRect(),f=e.closest(".area"),x=f;return{onMove({pageX:a,pageY:u}){let w=Math.min(p,Math.max(h,a))-n,m=u-t;d.move(w,m);let g=o.shadowRoot.elementFromPoint(a,u);g.classList.contains("header")&&(x=g.closest(".area"),x===f?(s.at(e),c.on(u,g)):s.at(x))},onEnd(){if(d.dispose(),s.dispose(),c.dispose(),x!==f){let{sticky:a}=o.features,u=x.classList;u.contains("top-area")?a.top={...a.top,[r.id]:!0}:u.contains("bottom-area")&&(a.bottom={...a.bottom,[r.id]:!0}),o.requestUpdate({features:{...o.features,sticky:a}})}o.viewPort.classList.remove("drag-n-drop","drag-row"),o.queryRowParts(r.id).forEach(a=>a.classList.remove("detached"))}}});v.prototype.createGridRow=C(`
    <div class="row r-undefined" tabindex="-1"></div>
`);v.prototype.updateGridRow=function(t,{row:e,rowIndex:o}){t.row!==e&&(t.setAttribute("row-id",e.id),t.style.transform=`translateY(${e.top}px)`,t.style.height=`${e.height}px`,t.row=e),t.rowIndex!==o&&(t.classList.replace(t.classList[1],`r-${o}`),o%2?t.className=`row odd r-${o}`:t.className=`row even r-${o}`,t.rowIndex=o)};v.prototype.createGridCell=C(`
    <div class="cell c-undefined">
        <div class="cell-text"></div>
    </div>
`);v.prototype.updateGridCell=function(t,{column:e,columnIndex:o},{row:i}){t.columnIndex!==o&&(t.classList.replace(t.classList[1],`c-${o}`),t.columnIndex=o),t.column!==e&&(t.setAttribute("column-id",e.id),t.style.left=`${e.left}px`,t.style.width=`${e.width}px`,t.column=e),this.renderCell(t.firstChild,e,i)};v.prototype.createRowHeader=C(`
    <div class="undefined header cell c-undefined" tabindex="-1">
        <div class="cell-text"></div>
        <div class="handle height-handle"></div>
    </div>
`,function(n){let{firstChild:t,lastChild:e}=n;this.features.resize.columns&&(e.addEventListener("dblclick",ot),e.addEventListener("pointerdown",it)),this.features.dnd.rows&&t.addEventListener("pointerdown",rt)});v.prototype.updateRowHeader=function(t,{column:e,columnIndex:o},{row:i}){t.columnIndex!==o&&(t.classList.replace(t.classList[3],`c-${o}`),t.columnIndex=o),t.column!==e&&(t.setAttribute("column-id",e.id),t.classList.replace(t.classList[0],e.position),t.style.left=`${e.left}px`,t.style.width=`${e.width}px`,t.column=e),t.firstChild.innerText=i[e.field]};function vt(n,{column:t},{top:e,left:o,width:i}){let{clientHeight:r}=n.viewPort,l=n.root.appendChild(document.createElement("div"));l.className="ghost column",l.style.cssText=`
        left:${o+4}px;
        top:${e+2}px;
        width:${i-8}px;
        height:${r-4}px;
    `;for(let d of n.queryColumnCells(t.id)){let c=d.cloneNode(!0);c.style.left="0",c.style.transform=d.parentElement.transform,c.classList.add(d.parentElement.classList.contains("odd")?"odd":"even"),l.appendChild(c)}return l.firstElementChild.classList.remove("odd","even"),requestAnimationFrame(function(){l.style.opacity="1"}),{move(d,c){l.style.transform=`translate(${d}px, ${c}px)`},dispose(){l.style.opacity=null,setTimeout(function(){l.remove()},300)}}}function yt(n,{columns:t,columnIndex:e},o,i){function r(a,u){let w=t[a],m,g=w.left;for(let b=a;b<u;b++){m=t[b]=t[b+1];for(let y of n.positionColumnCells(m.id,m.left=g))y.columnIndex=b;g+=m.width}m=t[u]=w;for(let b of n.positionColumnCells(m.id,m.left=g))b.columnIndex=u}function l(a,u){let w=t[u],m,g=t[a].left;for(let b=a;b<u;b++){m=w,w=t[b],t[b]=m;for(let y of n.positionColumnCells(m.id,m.left=g))y.columnIndex=b;g+=m.width}m=t[u]=w;for(let b of n.positionColumnCells(m.id,m.left=g))b.columnIndex=u}let d=B(o)-i,c,s=e,h=i,p=a=>{let u=a-h;return h=a,u},f=!1,x=()=>{f=!1};return{set done(a){x=()=>{a(),f=!1}},on(a,u){let w=p(a),m=a+d;if(!f){if(c=u.columnIndex,w>0&&c>s){let g=B(u);m>g-8&&(r(s,c),s=c,o.addEventListener("transitionend",x),f=!0)}w<0&&c<s&&B(u)<m+8&&(l(c,s),s=c,o.addEventListener("transitionend",x),f=!0)}},dispose(){if(c){let a=[...n.properties.columns],u=t[s].id,w=t[s+1].id,m=a.findIndex(({id:y})=>y===u),[g]=a.splice(m,1),b=a.findIndex(({id:y})=>y===w);a.splice(b,0,g),n.requestUpdate({columns:a})}}}}function B(n){let{left:t,right:e}=n.getBoundingClientRect();return(t+e)/2}function Ct(n,{columns:t},{left:e,right:o}){let i=n.shadowRoot.appendChild(document.createElement("div"));i.id="drop-highlight";let{top:r,bottom:l,right:d}=n.viewPort.getBoundingClientRect();i.style.cssText=`
            top:${r}px;
            left:${e}px;
            height:${l-r}px;
            width:${Math.min(o,d)-e-2}px;
            transform: translateX(0);
        `;let c;return{at(s,h){if(h||s!==c){let{left:p,right:f}=z(s);i.style.transform=`translateX(${p-e+1}px)`,i.style.width=`${f-p-2}px`,c=s}},dispose(){i.remove()}}}var st=k(function({pageX:n,pageY:t},e,o){let i=$(e),{column:r}=i,l=z(e),d=vt(o,i,l),c=yt(o,i,e,n),s=Ct(o,i,l);c.done=()=>{s.at(e,!0)},o.viewPort.classList.add("drag-n-drop","drag-column"),o.queryColumnCells(r.id).forEach(a=>a.classList.add("detached"));let{top:h,bottom:p}=o.viewPort.getBoundingClientRect(),f=e.closest(".area"),x=f;return{onMove({pageX:a,pageY:u}){let w=a-n,m=Math.min(p,Math.max(h,u))-t;d.move(w,m);let g=o.shadowRoot.elementFromPoint(a,u);g.classList.contains("header")&&(x=g.closest(".area"),x===f?(s.at(e),c.on(a,g)):s.at(x))},onEnd(){if(d.dispose(),s.dispose(),c.dispose(),x!==f){let{sticky:a}=o.features,u=x.classList;u.contains("left-area")?a.left={...a.left,[r.id]:!0}:u.contains("right-area")&&(a.right={...a.right,[r.id]:!0}),o.requestUpdate({features:{...o.features,sticky:a}})}o.viewPort.classList.remove("drag-n-drop","drag-column"),o.queryColumnCells(r.id).forEach(a=>a.classList.remove("detached"))}}});function nt(n,t,e){let{columns:o}=n.properties;o[o.findIndex(i=>i.id===t)].width=e}var lt=T((n,t)=>{let{area:e,columns:o,columnIndex:i,column:r}=$(n),l=Math.round(t.autoColumnWidth(r)-r.width);if(l){r.width+=l,e.width+=l,t.resizeColumnCells(r.id,r.width);for(let d,c=i+1;c<o.length;c++)d=o[c],t.positionColumnCells(d.id,d.left+=l);nt(t,r.id,r.width)}}),at=k(function({pageX:n},t,e){let{area:o,columns:i,columnIndex:r,column:l}=$(t),d=0;return{onMove({pageX:c},s){let h=l.width+c-n;if(l.maxWidth!==void 0&&(h=Math.min(h,l.maxWidth)),l.minWidth!==void 0?h=Math.max(h,l.minWidth):h=Math.max(h,20),d=Math.round(h-l.width),d){e.resizeColumnCells(l.id,l.width+=d),o.width+=d;for(let p,f=r+1;f<i.length;f++)p=i[f],e.positionColumnCells(p.id,p.left+=d)}n=c,e.refresh()},onEnd(){nt(e,l.id,l.width)}}});var D={arrowUp:"M19.716 184.485l19.626 19.626c4.753 4.753 12.484 4.675 17.14-.173L134 123.22V468c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12V123.22l77.518 80.717c4.656 4.849 12.387 4.927 17.14.173l19.626-19.626c4.686-4.686 4.686-12.284 0-16.971L168.485 35.716c-4.686-4.686-12.284-4.686-16.971 0L19.716 167.515c-4.686 4.686-4.686 12.284 0 16.97z",arrowDown:"M300.3 327.5l-19.6-19.6c-4.8-4.8-12.5-4.7-17.1.2L186 388.8V44c0-6.6-5.4-12-12-12h-28c-6.6 0-12 5.4-12 12v344.8l-77.5-80.7c-4.7-4.8-12.4-4.9-17.1-.2l-19.6 19.6c-4.7 4.7-4.7 12.3 0 17l131.8 131.8c4.7 4.7 12.3 4.7 17 0l131.8-131.8c4.6-4.7 4.6-12.3-.1-17z",ellipsis:"M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z",search:"M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"};v.prototype.createHeaderRow=C(`
    <div class="undefined header row r-undefined" tabindex="-1"></div>
`);v.prototype.updateHeaderRow=function(t,{row:e,rowIndex:o}){if(t.row!==e){t.setAttribute("row-id",e.id),t.classList.replace(t.classList[0],e.position),t.style.transform=`translateY(${e.top}px)`,t.style.height=`${e.height}px`,t.row=e;let i=Math.min(8,Math.max(2,2+(e.height-32)*6/10));t.style.setProperty("--search-input-padding",`${i}px`)}t.rowIndex!==o&&(t.classList.replace(t.classList[3],`r-${o}`),t.rowIndex=o)};v.prototype.createStub=C(`
    <div class="undefined stub cell c-undefined" tabindex="-1">
        <div class="handle width-handle"></div>
        <div class="handle height-handle"></div>
    </div>
`);v.prototype.updateStub=function(t,{column:e,columnIndex:o}){t.column!==e&&(t.classList.replace(t.classList[0],e.position),t.setAttribute("column-id",e.id),t.style.left=`${e.left}px`,t.style.width=`${e.width}px`,t.column=e),t.columnIndex!==o&&(t.classList.replace(`c-${t.columnIndex}`,`c-${o}`),t.columnIndex=o)};v.prototype.createColumnHeader=C(`
    <div class="header cell c-undefined" tabindex="-1">
        <div class="handle width-handle"></div>
        <div class="cell-content">
            <input class="search-input" type="text" autocomplete="off" required value="">
            <hr class="search-hr">
            <label class="search-label">
                <p></p>
                <svg class="sort-icon" viewBox="0 0 512 512"><path fill="currentColor" d="${D.arrowUp}"></path></svg>
            </label>
            <svg class="menu-icon" viewBox="0 0 512 512"><path fill="currentColor" d="${D.ellipsis}"></path></svg>
        </div>
    </div>
`,function(n){let t=n.firstChild,e=n.lastChild.firstChild,o=e.nextSibling.nextSibling,i=o.nextSibling,r=this,l;e.addEventListener("focus",()=>{l=!0,r.scrollIntoView(e.closest(".cell"))}),e.addEventListener("blur",()=>l=!1),e.addEventListener("input",c=>{let s=n.getAttribute("column-id");r.properties.columns.find(h=>h.id===s).search=e.value,r.requestUpdate({action:"filter",columns:[...r.properties.columns]})}),i.addEventListener("click",c=>{let{left:s,top:h}=i.getBoundingClientRect(),p=document.createElement("dialog");p.className="ch menu",requestAnimationFrame(function(){p.setAttribute("open","")}),p.style.marginLeft=`${s-4}px`,p.style.top=`${h}px;`,p.innerHTML=`
            <div class="item">Pin Column</div>
            <div class="item">Clear Search</div>
            <div class="separator"><div class="line"></div></div>
            <div class="item">Hide Column</div>
        `,p.addEventListener("click",function(){p.removeAttribute("open"),setTimeout(function(){p.remove()},300)}),r.root.append(p)},!0),o.addEventListener("click",c=>{let{extentOffset:s,anchorOffset:h,focusNode:p}=r.root.getSelection();(s===h||p.parentNode!==c.target)&&e.focus()},!1);let d=o.lastChild;d.addEventListener("pointerdown",c=>{c.preventDefault(),c.stopPropagation()}),d.addEventListener("click",c=>{c.preventDefault(),c.stopPropagation();let s=n.getAttribute("column-id");r.requestUpdate({action:"sort",columns:[...r.properties.columns.map(h=>h.id===s?{...h,sort:h.sort?h.sort==="asc"?"desc":void 0:"asc"}:{...h,sort:void 0})]})}),r.features.resize.columns&&(t.addEventListener("dblclick",lt),t.addEventListener("pointerdown",at)),r.features.dnd.columns&&o.addEventListener("pointerdown",st)});v.prototype.updateColumnHeader=function(t,{column:e,columnIndex:o}){t.columnIndex!==o&&(t.classList.replace(`c-${t.columnIndex}`,`c-${o}`),t.columnIndex=o),t.column!==e&&(t.setAttribute("column-id",e.id),t.style.left=`${e.left}px`,t.style.width=`${e.width}px`,t.column=e),t.childNodes[1].childNodes[2].firstChild.replaceWith(e.label);let r=t.childNodes[1].childNodes[0];r.value!==e.search&&(r.value=e.search||"",e.search?t.setAttribute("search",e.search):t.removeAttribute("search")),e.sort?t.setAttribute("sort",e.sort):t.removeAttribute("sort")};v.prototype.createRoot=C(`
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
`,function(n){let t=n.querySelector("#view-port"),e=document.createTreeWalker(t,NodeFilter.SHOW_COMMENT);for(;e.nextNode();){let s=e.currentNode,h=null;Object.defineProperty(t,s.textContent,{get(){return h},set(p){p||(p=s),h||(h=s),h.replaceWith(p),p===s?h=null:h=p}})}let o=this,i=t.center=o.createArea("center");i.columnCtrl=new R(o),i.rowCtrl=new L(o),i.visibleRect={...t.getBoundingClientRect()},i.setAttribute("scroll-x",""),i.setAttribute("scroll-y",""),H(i,"width"),H(i,"height");let r=["top","bottom"],l=["left","right"],{header:d,sticky:c}=o.features;t.layout=function(){for(let s of r){let h=d[s],p=c[s];if(h||p){let f=this[s];f||(f=this[s]=o.createArea(s),f.rowCtrl=new L(o),f.columnCtrl=i.columnCtrl,f.setAttribute("scroll-x",""),H(f,"height"),S(f,i,"width")),f.header={[s]:h}}else this[s]&&(this[s].height=0,this[s]=null)}for(let s of l){let h=d[s],p=c[s];if(h||p){let f=this[s];f||(f=this[s]=o.createArea(s),f.rowCtrl=i.rowCtrl,f.columnCtrl=new R(o),f.setAttribute("scroll-y",""),H(f,"width"),S(f,i,"height")),f.header={[s]:h}}else this[s]&&(this[s].width=0,this[s]=null)}for(let s of r)for(let h of l){let p=`${s}-${h}`;if(this[s]&&this[h]){let f=this[p];f||(f=this[p]=this[s][h]=this[h][s]=o.createArea(p),f.columnCtrl=this[h].columnCtrl,f.rowCtrl=this[s].rowCtrl,S(f,this[h],"width"),S(f,this[s],"height"))}else this[p]=null,this[s]&&(this[s][h]=null),this[h]&&(this[h][s]=null)}},t.refresh=function(s){let{top:h,bottom:p,left:f,right:x,center:a}=this;a.visibleTop=s.top,a.visibleBottom=s.bottom,a.visibleLeft=s.left+f?.width,a.visibleRight=s.right-x?.width,h&&(a.visibleTop+=h.height,h.visibleLeft=a.visibleLeft,h.visibleRight=a.visibleRight),p&&(a.visibleBottom-=p.height,p.visibleLeft=a.visibleLeft,p.visibleRight=a.visibleRight),f&&(f.visibleTop=a.visibleTop,f.visibleBottom=a.visibleBottom),x&&(x.visibleTop=a.visibleTop,x.visibleBottom=a.visibleBottom)}});v.prototype.queryColumnCells=function(n){return this.viewPort.querySelectorAll(`[column-id="${n}"]`)};v.prototype.queryRowCells=function(n){return this.viewPort.querySelectorAll(`[row-id="${n}"] .cell`)};v.prototype.resizeColumnCells=function(t,e){let o=`${e}px`;for(let{style:i}of this.queryColumnCells(t))i.width=o};v.prototype.positionColumnCells=function(t,e){let o=`${e}px`,i=this.queryColumnCells(t);for(let{style:r}of i)r.left=o;return i};v.prototype.queryRowParts=function(n){return this.viewPort.querySelectorAll(`[row-id="${n}"]`)};v.prototype.resizeRowParts=function(t,e){let o=`${e}px`;for(let{style:i}of this.queryRowParts(t))i.height=o};v.prototype.positionRowParts=function(t,e){let o=`translateY(${e}px)`,i=this.queryRowParts(t);for(let{style:r}of i)r.transform=o;return i};var F=class extends HTMLDivElement{at(t,e){let{columnCtrl:{columns:o},rowCtrl:{rows:i}}=this.parentElement,{left:r,width:l}=o[t],{top:d,height:c}=i[e];this.className=`c-${t} r-${e}`,this.columnIndex=t,this.rowIndex=e,this.style.transform=`translate(${r}px,${d}px)`,this.style.width=`${l}px`,this.style.height=`${c}px`;let{window:s,viewPort:h}=this.getRootNode().host,p=this.parentElement,f=h.scrollLeft,x=h.scrollTop;if(p.hasAttribute("scroll-x"))if(r<s.left)f=r;else{let a=r+o[t].width-s.width-s.left-1;a>0&&(f+=a)}if(p.hasAttribute("scroll-y"))if(d<s.top)x=d;else{let a=d+i[e].height-s.height-s.top-1;a>0&&(x+=a)}(f!==h.scrollLeft||x!==h.scrollTop)&&h.scrollTo({left:f,top:x,behavior:"smooth"})}move(t,e){let{columnCtrl:{columns:o,leftIndex:i,rightIndex:r},rowCtrl:{rows:l,topIndex:d,bottomIndex:c}}=this.parentElement,{columnIndex:s,rowIndex:h}=this;this.at(Math.max(0,Math.min(s+t,o.length-1)),Math.max(0,Math.min(h+e,l.length-1)))}};v.prototype.useHighlight=C('<div id="highlight"></div>',function(t){t.columnIndex=0,t.rowIndex=0,t.at=F.prototype.at,t.move=F.prototype.move;let{root:e}=this,o=!1;e.addEventListener("pointerdown",i=>{let r=i.target.closest(".cell");if(r&&!r.classList.contains("header")){let{area:l}=I(r);i.stopPropagation(),l.firstChild!==t&&(t?.replaceWith(document.createComment("highlight")),l.firstChild.replaceWith(t),o=!0),t.at(r.columnIndex,r.parentElement.rowIndex)}else o&&(t?.replaceWith(document.createComment("highlight")),o=!1)},{capture:!0,passive:!0})});customElements.define("sleek-grid",v);})();
//# sourceMappingURL=sleek-grid.js.map
