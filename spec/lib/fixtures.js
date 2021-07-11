import {render as renderHtml} from "lit";

export {html} from "lit";

export const root = document.getElementById("root");

document.body.style.overflow = "hidden";

let fixtureId = 0;

export const render = (value, options) => {
    let fixture = root.appendChild(document.createElement("div"));
    fixture.id = `fixture-${fixtureId++}`
    fixture.className = "fixture";
    fixture = fixture.appendChild(document.createElement("div"));
    fixture.className = "scroll-area";
    if (options.style) {
        Object.assign(fixture.style, options.style);
    }
    renderHtml(value, fixture);
    return fixture.firstElementChild.shadowRoot ?? fixture;
}

export const nextAnimationFrame = async () => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
});