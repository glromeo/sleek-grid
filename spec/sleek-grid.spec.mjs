import {html, render, nextAnimationFrame} from "./lib/fixtures.mjs";

import "../lib/index.mjs";

describe("Sleek Grid", function () {

    it("I can create a grid with 26 columns and 1000 rows", async function () {

        const columns = [];
        let A_CC = "A".charCodeAt(0);
        let Z_CC = "Z".charCodeAt(0);
        for (let cc = A_CC; cc <= Z_CC; cc++) {
            columns.push(String.fromCharCode(cc));
        }

        const rows = [];
        for (let r = 0; r < 1000; r++) {
            const row = [];
            for (let cc = A_CC; cc <= Z_CC; cc++) {
                row.push(`${String.fromCharCode(cc)}:${r}`);
            }
            rows.push(row);
        }

        const fixture = render(html`
            <sleek-grid id="fixture" .columns=${columns} .rows=${rows} min-column-width="150" min-row-height="50"></sleek-grid>
        `, {style:{width: "1920px", height: "1080px"}});

        fixture.adoptedStyleSheets[2].replaceSync(`
            ::-webkit-scrollbar {
              display: none;
            }
        `);

        expect(fixture.querySelector("#view-port").offsetWidth).toBe(1920);
        expect(fixture.querySelector("#view-port").offsetHeight).toBe(1080);

        let firstRow = fixture.querySelectorAll(`[row-id="0"] [column-id]`);
        expect(firstRow.length).toBe(Math.ceil(1920 / 150));
        expect(firstRow[firstRow.length - 1].offsetLeft).toBeLessThan(1920);

        let firstColumn = fixture.querySelectorAll(`[column-id="0"]`);
        expect(firstColumn.length).toBe(Math.ceil(1080 / 50));
        expect(firstColumn[firstColumn.length - 1].offsetTop).toBeLessThan(1080);

        fixture.host.scrollTo(300, 100);

        await nextAnimationFrame();

        firstRow = fixture.querySelector(`[row-id]`);
        expect(firstRow.querySelectorAll(`[column-id]`).length).toBe(Math.ceil(1920 / 150));
        expect(firstRow.querySelector(`[column-id]`).offsetLeft).toBeGreaterThanOrEqual(300);

        firstColumn = fixture.querySelector(`[column-id]`);
        expect(firstColumn.length).toBe(Math.ceil(1080 / 50));
        expect(firstColumn[0].parentElement.offsetTop).toBeGreaterThanOrEqual(100);
    });



});