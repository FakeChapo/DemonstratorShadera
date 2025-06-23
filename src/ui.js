/**
 * Build persistent "Shader: ON/OFF" indicator (top-right).
 * @returns {HTMLDivElement} The indicator element.
 */
export function buildIndicator() {
    const indicatorEl = document.createElement("div");
    indicatorEl.style.cssText =
        "position:absolute;top:10px;right:10px;padding:8px 12px;" +
        "background:rgba(0,0,0,0.6);color:#f00;font:14px sans-serif;" +
        "border-radius:4px;user-select:none;";
    indicatorEl.textContent = "Shader: OFF";
    document.body.appendChild(indicatorEl);
    return indicatorEl;
}

/**
 * Build small help guide overlay (bottom-left).
 */
export function buildHelp() {
    const helpEl = document.createElement("div");
    helpEl.style.cssText =
        "position:absolute;bottom:10px;left:10px;padding:8px 12px;" +
        "background:rgba(0,0,0,0.6);color:#fff;font:12px sans-serif;" +
        "border-radius:4px;user-select:none;line-height:1.4;";
    helpEl.innerHTML =
        "Controls:<br/>" +
        "W/A/S/D: Move<br/>" +
        "Space / Shift: Up / Down<br/>" +
        "Mouse Drag: Look Around<br/>" +
        "H: Toggle Shader";
    document.body.appendChild(helpEl);
}
