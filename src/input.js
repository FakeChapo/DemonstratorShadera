/**
 * Hook up keyboard & mouse event listeners.
 * @param {{
 *   moveForward: boolean,
 *   moveBackward: boolean,
 *   moveLeft: boolean,
 *   moveRight: boolean,
 *   moveUp: boolean,
 *   moveDown: boolean,
 *   isMouseDown: boolean,
 *   prevMouseX: number,
 *   prevMouseY: number,
 *   yaw: number,
 *   pitch: number
 * }} controls - The shared controls state.
 * @param {function} onShaderToggle
 */
export function setupInput(controls, onShaderToggle) {
    document.addEventListener("keydown", e => {
        switch (e.code) {
            case "KeyW": {
                controls.moveForward = true;
                break;
            }
            case "KeyS": {
                controls.moveBackward = true;
                break;
            }
            case "KeyA": {
                controls.moveLeft = true;
                break;
            }
            case "KeyD": {
                controls.moveRight = true;
                break;
            }
            case "Space": {
                controls.moveUp = true;
                break;
            }
            case "ShiftLeft":
            case "ShiftRight": {
                controls.moveDown = true;
                break;
            }
            case "KeyH": {
                if (typeof onShaderToggle === "function") {
                    onShaderToggle();
                }
                break;
            }
            default: {
                // ignore
            }
        }
    });

    document.addEventListener("keyup", e => {
        switch (e.code) {
            case "KeyW": {
                controls.moveForward = false;
                break;
            }
            case "KeyS": {
                controls.moveBackward = false;
                break;
            }
            case "KeyA": {
                controls.moveLeft = false;
                break;
            }
            case "KeyD": {
                controls.moveRight = false;
                break;
            }
            case "Space": {
                controls.moveUp = false;
                break;
            }
            case "ShiftLeft":
            case "ShiftRight": {
                controls.moveDown = false;
                break;
            }
            default: {
                // ignore
            }
        }
    });

    document.addEventListener("mousedown", e => {
        if (e.button === 0) {
            controls.isMouseDown = true;
            controls.prevMouseX = e.clientX;
            controls.prevMouseY = e.clientY;
        }
    });

    document.addEventListener("mouseup", e => {
        if (e.button === 0) {
            controls.isMouseDown = false;
        }
    });

    document.addEventListener("mousemove", e => {
        if (!controls.isMouseDown) {
            return;
        }
        const dx = e.clientX - controls.prevMouseX;
        const dy = e.clientY - controls.prevMouseY;
        controls.prevMouseX = e.clientX;
        controls.prevMouseY = e.clientY;

        const speed = 0.002;
        controls.yaw -= dx * speed;
        controls.pitch -= dy * speed;
        controls.pitch = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, controls.pitch)
        );
    });
}
